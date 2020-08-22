package presetssrc

//PresetStore contains all db methods needed to create/maintain presets
type PresetStore interface {
	CreatePreset(ps *Preset) (*Preset, error)
	GetPreset(psid int) (*Preset, error)
	EditPreset(ps *Preset) error
	DeletePreset(psid int) error

	CreatePlaylist(pl *Playlist) (*Playlist, error)
	GetPlaylist(plid int) (*Playlist, error)
	EditPlaylist(pl *Playlist) error
	DeletePlaylist(plid int) error

	GetPresets(userid int) ([]*Preset, error)

	InRecentTracks(trackURI string, psid int, numTracks int) (bool, error)
	AddRecentTrack(psid int, trackURI string) error

	UpdateWeight(pl *Playlist) error
}
