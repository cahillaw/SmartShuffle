package main

import (
	"SmartShuffleApplication/servers/presets/presetssrc"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func main() {

	addr := os.Getenv("ADDR")
	if len(addr) == 0 {
		addr = ":80"
	}

	dsn, dsnok := os.LookupEnv("DSN")
	if dsnok == false {
		os.Stdout.WriteString("dsn not set")
		os.Exit(1)
	}

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		os.Stdout.WriteString(err.Error())
		os.Stdout.WriteString("error opening database")
		os.Exit(1)
	}

	defer db.Close()

	if err := db.Ping(); err != nil {
		fmt.Printf("error pinging database: %v\n", err)
	} else {
		fmt.Printf("successfully connected!\n")
	}

	ctx := &presetssrc.PresetContext{}
	stdb := &presetssrc.SQLStore{}
	stdb.DB = db
	ctx.PStore = stdb

	mux := mux.NewRouter()

	mux.HandleFunc("/v1/presets", ctx.CreatePresetHandler)
	mux.HandleFunc("/v1/presets/{presetID}", ctx.PresetHandler)
	mux.HandleFunc("/v1/playlists", ctx.CreatePlaylistHandler)
	mux.HandleFunc("/v1/playlists/{playlistID}", ctx.PlaylistHandler)
	mux.HandleFunc("/v1/userpage", ctx.UserPageHandler)
	mux.HandleFunc("/v1/queue/{presetID}", ctx.QueueSong)
	mux.HandleFunc("/v1/gpt", ctx.TestGPT)
	mux.HandleFunc("/v1/updateplaylists/{presetID}", ctx.EditPlaylists)

	log.Printf("server is lsitening at %s", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}
