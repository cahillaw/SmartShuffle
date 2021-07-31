package gatewaysrc

//GatewayContext is the context needed for db calls in gateway
type GatewayContext struct {
	GStore GatewayStore
}

//User is an auth'd user
type User struct {
	UserID      int    `json:"id"`
	SpotifyID   string `json:"spotifyId"`
	AccessToken string `json:"accessToken"`
}

//SpotifyInfo contains info regarding spotify account
type SpotifyInfo struct {
	ID string `json:"id"`
}

type Token struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	Scope       string `json:"scope"`
	ExpiresIn   int    `json:"expires_in"`
}
