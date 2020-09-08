package gatewaysrc

import (
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"time"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/spotify"
)

var (
	spotifyOauthConfig = &oauth2.Config{
		RedirectURL:  "https://shuffle.cahillaw.me/callback",
		ClientID:     os.Getenv("SPOTIFY_CLIENT_ID"),
		ClientSecret: os.Getenv("SPOTIFY_CLIENT_SECRET"),
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
		fmt.Println("state is not valid")
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	token, err := spotifyOauthConfig.Exchange(oauth2.NoContext, r.FormValue("code"))
	if err != nil {
		fmt.Println("state is nots valid")
		http.Redirect(w, r, "https://shuffle.cahillaw.me/presets", http.StatusTemporaryRedirect)
		return
	}

	fmt.Println(token.AccessToken)
	fmt.Println(token.RefreshToken)

	url := "http://localhost:3000/redirect?access_token=" + token.AccessToken + "&refresh_token=" + token.RefreshToken
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}
