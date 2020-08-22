package presetssrc

//PresetContext is a presetc
type PresetContext struct {
	PStore PresetStore
}

//User is an auth'd user
type User struct {
	UserID      int    `json:"id"`
	SpotifyID   string `json:"spotifyId"`
	AccessToken string `json:"accessToken"`
}

//Preset is a shuffle preset
type Preset struct {
	PresetID    int         `json:"presetId"`
	User        *User       `json:"user"`
	PresetName  string      `json:"presetName"`
	RepeatLimit int         `json:"repeatLimit"`
	Playlists   []*Playlist `json:"playlists"`
}

//Playlist is a playlist in a shuffle preset
type Playlist struct {
	PlaylistID   int    `json:"playlistID"`
	PresetID     int    `json:"presetID"`
	PlaylistName string `json:"playlistName"`
	SpotifyURI   string `json:"uri"`
	NumTracks    int    `json:"NumTracks"`
	Order        bool   `json:"order"`
	Weight       int    `json:"weight"`
}

//Track represents a track in a playlist
type Track struct {
	Track struct {
		TrackName string `json:"name"`
		TrackURI  string `json:"id"`
	} `json:"track"`
}

//PlaylistTracks contains tracks in the playlist
type PlaylistTracks struct {
	Tracks []*Track `json:"items"`
	Total  int      `json:"total"`
}

//TrackURI contains a track uri
type TrackURI struct {
	URI string `json:"trackUri"`
}
