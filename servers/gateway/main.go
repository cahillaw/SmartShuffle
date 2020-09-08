package main

import (
	"SmartShuffleApplication/servers/gateway/gatewaysrc"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httputil"
	"os"
	"strings"

	"github.com/gorilla/mux"
)

func main() {
	addr := os.Getenv("ADDR")
	if len(addr) == 0 {
		addr = ":443"
	}

	tlsKeyPath, keyok := os.LookupEnv("TLSKEY")
	tlsCertPath, certok := os.LookupEnv("TLSCERT")

	if keyok == false || certok == false {
		os.Stdout.WriteString("key/certificate not set")
		os.Exit(1)
	}

	presetsaddr, ok := os.LookupEnv("PRESETSADDR")
	if ok == false {
		os.Stdout.WriteString("presetsaddr not set")
		os.Exit(1)
	}

	dsn, dsnok := os.LookupEnv("DSN")
	if dsnok == false {
		os.Stdout.WriteString("dsn not set")
		os.Exit(1)
	}

	if dsnok == false {
		os.Stdout.WriteString("dsn not set")
		os.Exit(1)
	}

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		os.Stdout.WriteString("error opening database")
		os.Exit(1)
	}

	defer db.Close()

	if err := db.Ping(); err != nil {
		fmt.Printf("error pinging database: %v\n", err)
	} else {
		fmt.Printf("successfully connected!\n")
	}

	ctx := &gatewaysrc.GatewayContext{}
	stdb := &gatewaysrc.SQLStore{}
	stdb.DB = db
	ctx.GStore = stdb

	presetsDirector := func(r *http.Request) {
		serverName := presetsaddr

		r.Header.Del("X-User")
		spotifyid, err := GetSpotifyID(r)
		if err == nil {
			user, errGetUserInfo := ctx.GStore.GetUserInfo(spotifyid)
			if errGetUserInfo == nil && user != nil {
				user.AccessToken = r.Header.Get("Authorization")
				encoded, _ := json.Marshal(user)
				r.Header.Set("X-User", string(encoded))
			} else {
				fmt.Println(errGetUserInfo.Error())
			}
		}

		r.Host = serverName
		r.URL.Host = serverName
		r.URL.Scheme = "http"
	}

	mux := mux.NewRouter()

	presetsProxy := &httputil.ReverseProxy{Director: presetsDirector}
	mux.Handle("/v1/presets", presetsProxy)
	mux.Handle("/v1/presets/{presetID}", presetsProxy)
	mux.Handle("/v1/playlists", presetsProxy)
	mux.Handle("/v1/playlists/{playlistID}", presetsProxy)
	mux.Handle("/v1/userpage", presetsProxy)
	mux.Handle("/v1/queue/{presetID}", presetsProxy)
	mux.Handle("/v1/gpt", presetsProxy)
	mux.Handle("/v1/updateplaylists/{presetID}", presetsProxy)

	mux.HandleFunc("/", ctx.HandleHome)
	mux.HandleFunc("/login", ctx.HandleLogin)
	mux.HandleFunc("/callback", ctx.HandleCallback)

	wrappedMux := gatewaysrc.AddFiveResponseHeaders(mux, "Access-Control-Allow-Origin", "*", "Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE", "Access-Control-Allow-Headers", "Content-Type, Authorization", "Access-Control-Expose-Headers", "Authorization", "Access-Control-Max-Age", "600")

	log.Printf("server is lsitening at %s", addr)
	log.Fatal(http.ListenAndServeTLS(addr, tlsCertPath, tlsKeyPath, wrappedMux))
}

//GetSpotifyID returns the spotifyid for the auth token
func GetSpotifyID(r *http.Request) (string, error) {
	authorization := r.Header.Get("Authorization")
	if authorization == "" {
		query, ok := r.URL.Query()["auth"]
		if !ok || len(query[0]) < 1 {
			return "", errors.New("No auth token")
		}
		authorization = query[0]
	}

	arr := strings.SplitAfter(authorization, " ")
	if arr[0] != "Bearer " {
		return "", errors.New("Wrong scheme")
	}

	client := &http.Client{}
	req, err := http.NewRequest("GET", "https://api.spotify.com/v1/me", nil)
	if err != nil {
		return "", errors.New("Internal Server Error")
	}

	req.Header.Set("Authorization", r.Header.Get("Authorization"))
	response, err := client.Do(req)
	if err != nil {
		return "", errors.New("Internal Server Error")
	}

	fmt.Println(response.StatusCode)

	responseData, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return "", errors.New("Error reading response from SpotifyAPUI")
	}

	//defer resp.Body.Close()
	SpotifyInfo := &gatewaysrc.SpotifyInfo{}
	json.Unmarshal(responseData, &SpotifyInfo)

	return SpotifyInfo.ID, nil
}
