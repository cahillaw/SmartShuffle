package gatewaysrc

import (
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/spotify"
)

var clientId = os.Getenv("SPOTIFY_CLIENT_ID")
var clientSecret = os.Getenv("SPOTIFY_CLIENT_SECRET")

var (
	spotifyOauthConfig = &oauth2.Config{
		RedirectURL:  (os.Getenv("SS_SERVER_URL") + "/callback"),
		ClientID:     clientId,
		ClientSecret: clientSecret,
		Scopes:       []string{"user-modify-playback-state", "playlist-read-private", "user-read-currently-playing", "user-read-private"},
		Endpoint:     spotify.Endpoint,
	}
)
var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

func randSeq(n int) string {
	rand.Seed(time.Now().UnixNano())
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

//HandleHome login page might be removed lol
func (ctx *GatewayContext) HandleHome(w http.ResponseWriter, r *http.Request) {
	var htmlIndex = `<html>
		<body>
			<a href="/login">Spotify Log In</a>
		</body>
	</html>`

	fmt.Fprintf(w, htmlIndex)
}

//HandleLogin handles requests to login with Spotify
func (ctx *GatewayContext) HandleLogin(w http.ResponseWriter, r *http.Request) {
	state := randSeq(16)
	cookie := http.Cookie{
		Name:  "spotify_auth_state",
		Value: state,
	}
	http.SetCookie(w, &cookie)

	url := spotifyOauthConfig.AuthCodeURL(state)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

//HandleCallback handles callback after authenticating
func (ctx *GatewayContext) HandleCallback(w http.ResponseWriter, r *http.Request) {
	cookie, _ := r.Cookie("spotify_auth_state")

	if r.FormValue("state") != cookie.Value {
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	token, err := spotifyOauthConfig.Exchange(oauth2.NoContext, r.FormValue("code"))
	if err != nil {
		http.Redirect(w, r, "/presets", http.StatusTemporaryRedirect)
		return
	}

	url := os.Getenv("SS_CLIENT_URL") + "/redirect?access_token=" + token.AccessToken + "&refresh_token=" + token.RefreshToken
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func (ctx *GatewayContext) GetNewAccessToken(w http.ResponseWriter, r *http.Request) {
	refreshToken := r.URL.Query().Get("refresh_token")
	if refreshToken == "" {
		http.Error(w, "No refresh token provided", http.StatusBadRequest)
		return
	}

	data := url.Values{
		"grant_type":    {"refresh_token"},
		"refresh_token": {refreshToken},
	}

	req, err := http.NewRequest("POST", "https://accounts.spotify.com/api/token", strings.NewReader(data.Encode()))
	if err != nil {
		http.Error(w, "Could not make request", http.StatusInternalServerError)
		return
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Authorization", "Basic "+base64.StdEncoding.EncodeToString([]byte(clientId+":"+clientSecret)))

	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		http.Error(w, "Could not make request", http.StatusInternalServerError)
		return
	}

	responseData, err := ioutil.ReadAll(response.Body)
	if err != nil {
		http.Error(w, "Could not read response body from Spotify", http.StatusInternalServerError)
		return
	}

	defer response.Body.Close()

	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(responseData)
}
