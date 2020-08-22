package gatewaysrc

//GatewayStore stores db methods for gateway
type GatewayStore interface {
	GetUserInfo(spotifyid string) (*User, error)
}
