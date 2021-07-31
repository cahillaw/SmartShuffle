package presetssrc

import (
	"database/sql"

	_ "github.com/go-sql-driver/mysql" //needed
)

//SQLStore holds db info
type SQLStore struct {
	DB *sql.DB
}

//CreatePreset creates a preset
func (sqls *SQLStore) CreatePreset(ps *Preset) (*Preset, error) {
	insq := "insert into preset(user_id, preset_name, repeat_limit) values(?,?,?)"

	res, errExec := sqls.DB.Exec(insq, ps.User.UserID, ps.PresetName, ps.RepeatLimit)
	if errExec != nil {
		return nil, errExec
	}

	psid, errID := res.LastInsertId()
	if errID != nil {
		return nil, errID
	}
	ps.PresetID = int(psid)

	return ps, nil
}

//GetPreset gets preset
func (sqls *SQLStore) GetPreset(psid int) (*Preset, error) {
	ps := &Preset{}
	ps.User = &User{}
	insq := "select * from preset where preset_id = ?"

	errQuery := sqls.DB.QueryRow(insq, psid).Scan(&ps.PresetID, &ps.User.UserID, &ps.PresetName, &ps.RepeatLimit)
	if errQuery != nil {
		if errQuery == sql.ErrNoRows {
			return nil, nil
		}
		return nil, errQuery
	}

	pls := make([]*Playlist, 0)
	insq = "select * from playlist where preset_id = ?"

	res, errQuery := sqls.DB.Query(insq, psid)
	if errQuery != nil {
		return nil, errQuery
	}
	defer res.Close()

	for res.Next() {
		pl := &Playlist{}
		errScan := res.Scan(&pl.PlaylistID, &pl.PresetID, &pl.PlaylistName, &pl.SpotifyURI, &pl.NumTracks, &pl.Order, &pl.Weight)
		if errScan != nil {
			return nil, errScan
		}
		pls = append(pls, pl)
	}
	ps.Playlists = pls

	return ps, nil
}

//EditPreset edits a preset
func (sqls *SQLStore) EditPreset(ps *Preset) error {
	insq := "update preset set preset_name = ?, repeat_limit = ? where preset_id = ?"
	_, errExec := sqls.DB.Exec(insq, ps.PresetName, ps.RepeatLimit, ps.PresetID)
	if errExec != nil {
		return errExec
	}
	return nil
}

//DeletePreset deletes a desired preset
func (sqls *SQLStore) DeletePreset(psid int) error {
	insq := "delete from playlist where preset_id = ?"
	_, errExec := sqls.DB.Exec(insq, psid)
	if errExec != nil {
		return errExec
	}

	insq = "delete from recent_tracks where preset_id = ?"
	_, errExec = sqls.DB.Exec(insq, psid)
	if errExec != nil {
		return errExec
	}

	insq = "delete from preset where preset_id = ?"
	_, errExec = sqls.DB.Exec(insq, psid)
	if errExec != nil {
		return errExec
	}

	return nil
}

//CreatePlaylist creates a playlist for a preset
func (sqls *SQLStore) CreatePlaylist(pl *Playlist) (*Playlist, error) {
	insq := "insert into playlist(preset_id, playlist_name, spotify_uri, num_tracks, `order`, weight) values(?,?,?,?,?,?)"
	res, errExec := sqls.DB.Exec(insq, pl.PresetID, pl.PlaylistName, pl.SpotifyURI, pl.NumTracks, pl.Order, pl.Weight)
	if errExec != nil {
		return nil, errExec
	}

	psid, errID := res.LastInsertId()
	if errID != nil {
		return nil, errID
	}

	pl.PlaylistID = int(psid)
	return pl, nil
}

//GetPlaylist gets a playlist
func (sqls *SQLStore) GetPlaylist(plid int) (*Playlist, error) {
	pl := &Playlist{}
	insq := "select * from playlist where playlist_id = ?"

	errQuery := sqls.DB.QueryRow(insq, plid).Scan(&pl.PlaylistID, &pl.PresetID, &pl.PlaylistName, &pl.SpotifyURI, &pl.NumTracks, &pl.Order, &pl.Weight)
	if errQuery != nil {
		if errQuery == sql.ErrNoRows {
			return nil, nil
		}
		return nil, errQuery
	}

	return pl, nil
}

//EditPlaylist edits a playlist
func (sqls *SQLStore) EditPlaylist(pl *Playlist) error {
	insq := "update playlist set playlist_name = ?, spotify_uri = ?, num_tracks = ?, `order` = ?, weight = ? where playlist_id = ?"
	_, errExec := sqls.DB.Exec(insq, pl.PlaylistName, pl.SpotifyURI, pl.NumTracks, pl.Order, pl.Weight, pl.PlaylistID)
	if errExec != nil {
		return errExec
	}
	return nil
}

//DeletePlaylist deletes a playlist
func (sqls *SQLStore) DeletePlaylist(plid int) error {
	insq := "delete from playlist where playlist_id = ?"
	_, errExec := sqls.DB.Exec(insq, plid)
	if errExec != nil {
		return errExec
	}
	return nil
}

//GetPresets gets all the presets acccociated with a given user
func (sqls *SQLStore) GetPresets(userid int) ([]*Preset, error) {
	presets := make([]*Preset, 0)

	insq := "select * from preset where user_id = ?"
	res, errQuery := sqls.DB.Query(insq, userid)
	if errQuery != nil {
		if errQuery == sql.ErrNoRows {
			return nil, nil
		}
		return nil, errQuery
	}
	defer res.Close()

	for res.Next() {
		ps := &Preset{}
		ps.User = &User{}
		errScan := res.Scan(&ps.PresetID, &ps.User.UserID, &ps.PresetName, &ps.RepeatLimit)
		if errScan != nil {
			return nil, errScan
		}

		pls := make([]*Playlist, 0)
		insq = "select * from playlist where preset_id = ?"

		res2, errQuery := sqls.DB.Query(insq, ps.PresetID)
		if errQuery != nil {
			return nil, errQuery
		}
		defer res2.Close()

		for res2.Next() {
			pl := &Playlist{}
			errScan := res2.Scan(&pl.PlaylistID, &pl.PresetID, &pl.PlaylistName, &pl.SpotifyURI, &pl.NumTracks, &pl.Order, &pl.Weight)
			if errScan != nil {
				return nil, errScan
			}
			pls = append(pls, pl)
		}
		ps.Playlists = pls
		presets = append(presets, ps)
	}

	return presets, nil
}

//InRecentTracks gets the recent tracks for a preset
func (sqls *SQLStore) InRecentTracks(trackURI string, psid int, numTracks int) (bool, error) {
	insq := "select track_uri from recent_tracks where preset_id = ? order by rt_id desc limit ?"
	res, errQuery := sqls.DB.Query(insq, psid, numTracks)
	if errQuery != nil {
		return false, errQuery
	}
	defer res.Close()

	for res.Next() {
		uri := &TrackURI{}
		errScan := res.Scan(&uri.URI)
		if errScan != nil {
			return false, errScan
		}
		if uri.URI == trackURI {
			return true, nil
		}
	}
	return false, nil
}

//AddRecentTrack adds a recent track to the db
func (sqls *SQLStore) AddRecentTrack(psid int, trackURI string) error {
	insq := "insert into recent_tracks(preset_id, track_uri) values(?,?)"
	_, errExec := sqls.DB.Exec(insq, psid, trackURI)
	if errExec != nil {
		return errExec
	}
	return nil
}

//UpdateWeight updates teh weight of a playlist
func (sqls *SQLStore) UpdateWeight(pl *Playlist) error {
	insq := "update playlist set weight = ? where playlist_id = ?"
	_, errExec := sqls.DB.Exec(insq, pl.Weight, pl.PlaylistID)
	if errExec != nil {
		return errExec
	}
	return nil
}
