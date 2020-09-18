package presetssrc

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"path"
	"strconv"
	"strings"
	"time"

	"github.com/jmcvetta/randutil"
)

//CreatePresetHandler allows users to create a new preset
func (ctx *PresetContext) CreatePresetHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		userHeader := r.Header.Get("X-User")
		if len(userHeader) == 0 {
			http.Error(w, "Not authorized", http.StatusUnauthorized)
			return
		}

		user := &User{}
		errDecode := json.Unmarshal([]byte(userHeader), &user)
		if errDecode != nil {
			http.Error(w, "Error getting user", http.StatusInternalServerError)
			return
		}

		preset := &Preset{}
		errDecode = json.NewDecoder(r.Body).Decode(&preset)
		if errDecode != nil {
			http.Error(w, "Bad input", http.StatusBadRequest)
			return
		}

		preset.User = user
		preset, errDB := ctx.PStore.CreatePreset(preset)
		if errDB != nil {
			http.Error(w, errDB.Error(), http.StatusInternalServerError)
			return
		}

		preset.Playlists = make([]*Playlist, 0)

		encoded, errEncode := json.Marshal(preset)
		if errEncode != nil {
			http.Error(w, "Error encoding user to JSON", http.StatusBadRequest)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		w.Write(encoded)

	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

//PresetHandler is a handler for presets: methods: get, patch, delete
func (ctx *PresetContext) PresetHandler(w http.ResponseWriter, r *http.Request) {
	userHeader := r.Header.Get("X-User")
	if len(userHeader) == 0 {
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	user := &User{}
	errDecode := json.Unmarshal([]byte(userHeader), &user)
	if errDecode != nil {
		http.Error(w, "Error getting user", http.StatusInternalServerError)
		return
	}

	pathid := path.Base(r.URL.Path)
	split := strings.Split(pathid, "&")
	pathid = split[0]
	pid, errConv := strconv.Atoi(pathid)
	if errConv != nil {
		http.Error(w, "Not an integer", http.StatusBadRequest)
		return
	}

	preset, errDB := ctx.PStore.GetPreset(pid)
	if errDB != nil {
		http.Error(w, errDB.Error(), http.StatusInternalServerError)
		return
	}
	if preset == nil {
		http.Error(w, "Preset does not exist", http.StatusBadRequest)
		return
	}
	if preset.User.UserID != user.UserID {
		http.Error(w, "Access forbidden", http.StatusForbidden)
		return
	}

	if r.Method == http.MethodGet {
		encoded, errEncode := json.Marshal(preset)
		if errEncode != nil {
			http.Error(w, "Error encoding user to JSON", http.StatusBadRequest)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(encoded)
	} else if r.Method == http.MethodPatch {
		pu := &Preset{}
		errDecode = json.NewDecoder(r.Body).Decode(&pu)
		if errDecode != nil {
			http.Error(w, "Bad input", http.StatusBadRequest)
			return
		}

		pu.PresetID = pid //makes it so you can't spoof presetid
		errDB := ctx.PStore.EditPreset(pu)
		if errDB != nil {
			http.Error(w, errDB.Error(), http.StatusInternalServerError)
			return
		}

		encoded, errEncode := json.Marshal(pu)
		if errEncode != nil {
			http.Error(w, "Error encoding user to JSON", http.StatusBadRequest)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(encoded)
	} else if r.Method == http.MethodDelete {
		//NEED TO DELETE PLAYLISTS AS WELL
		errDelete := ctx.PStore.DeletePreset(pid)
		if errDelete != nil {
			http.Error(w, errDelete.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Preset deleted successfully"))
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

//CreatePlaylistHandler creates a playlist. Methods: POST
func (ctx *PresetContext) CreatePlaylistHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		userHeader := r.Header.Get("X-User")
		if len(userHeader) == 0 {
			http.Error(w, "Not authorized", http.StatusUnauthorized)
			return
		}

		user := &User{}
		errDecode := json.Unmarshal([]byte(userHeader), &user)
		if errDecode != nil {
			http.Error(w, "Error getting user", http.StatusInternalServerError)
			return
		}

		pl := &Playlist{}
		errDecode = json.NewDecoder(r.Body).Decode(&pl)
		if errDecode != nil {
			http.Error(w, "Bad input", http.StatusBadRequest)
			return
		}

		//check if presetid exists + is yours
		preset, errDB := ctx.PStore.GetPreset(pl.PresetID)
		if errDB != nil {
			http.Error(w, errDB.Error(), http.StatusInternalServerError)
			return
		}
		if preset == nil {
			http.Error(w, "Preset does not exist", http.StatusBadRequest)
			return
		}
		if preset.User.UserID != user.UserID {
			http.Error(w, "Access forbidden", http.StatusForbidden)
			return
		}
		//done, can proceed

		pl, errDB = ctx.PStore.CreatePlaylist(pl)
		if errDB != nil {
			http.Error(w, errDB.Error(), http.StatusInternalServerError)
			return
		}

		encoded, errEncode := json.Marshal(pl)
		if errEncode != nil {
			http.Error(w, "Error encoding user to JSON", http.StatusBadRequest)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		w.Write(encoded)
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

//PlaylistHandler is a handler for playlists: methods: get, patch, delete
func (ctx *PresetContext) PlaylistHandler(w http.ResponseWriter, r *http.Request) {
	userHeader := r.Header.Get("X-User")
	if len(userHeader) == 0 {
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	user := &User{}
	errDecode := json.Unmarshal([]byte(userHeader), &user)
	if errDecode != nil {
		http.Error(w, "Error getting user", http.StatusInternalServerError)
		return
	}

	pathid := path.Base(r.URL.Path)
	split := strings.Split(pathid, "&")
	pathid = split[0]
	plid, errConv := strconv.Atoi(pathid)
	if errConv != nil {
		http.Error(w, "Not an integer", http.StatusBadRequest)
		return
	}

	pl, errDB := ctx.PStore.GetPlaylist(plid)
	if errDB != nil {
		http.Error(w, errDB.Error(), http.StatusInternalServerError)
		return
	}
	if pl == nil {
		http.Error(w, "Preset does not exist", http.StatusBadRequest)
		return
	}
	//to check if playlist is yours
	preset, errDB := ctx.PStore.GetPreset(pl.PresetID)
	if errDB != nil {
		http.Error(w, errDB.Error(), http.StatusInternalServerError)
		return
	}
	if preset.User.UserID != user.UserID {
		http.Error(w, "Access forbidden", http.StatusForbidden)
		return
	}
	//ok now were good to go

	if r.Method == http.MethodGet {
		encoded, errEncode := json.Marshal(pl)
		if errEncode != nil {
			http.Error(w, "Error encoding user to JSON", http.StatusBadRequest)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(encoded)
	} else if r.Method == http.MethodPatch {
		plu := &Playlist{}
		errDecode = json.NewDecoder(r.Body).Decode(&plu)
		if errDecode != nil {
			http.Error(w, "Bad input", http.StatusBadRequest)
			return
		}

		plu.PlaylistID = plid //spoof protection
		errDB := ctx.PStore.EditPlaylist(plu)
		if errDB != nil {
			http.Error(w, errDB.Error(), http.StatusInternalServerError)
			return
		}

		encoded, errEncode := json.Marshal(plu)
		if errEncode != nil {
			http.Error(w, "Error encoding user to JSON", http.StatusBadRequest)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(encoded)
	} else if r.Method == http.MethodDelete {
		errDelete := ctx.PStore.DeletePlaylist(plid)
		if errDelete != nil {
			http.Error(w, errDelete.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Playlist deleted successfully"))
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}

}

//UserPageHandler handles requests to a user's page
func (ctx *PresetContext) UserPageHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userHeader := r.Header.Get("X-User")
	if len(userHeader) == 0 {
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	user := &User{}
	errDecode := json.Unmarshal([]byte(userHeader), &user)
	if errDecode != nil {
		http.Error(w, "Error getting user", http.StatusInternalServerError)
		return
	}

	presets, errGetPresets := ctx.PStore.GetPresets(user.UserID)
	if errGetPresets != nil {
		http.Error(w, errGetPresets.Error(), http.StatusInternalServerError)
	}

	encoded, errEncode := json.Marshal(presets)
	if errEncode != nil {
		http.Error(w, errEncode.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(encoded)
}

//QueueSong will queue a song from the specified preset, assuming you are the owner of the preset
func (ctx *PresetContext) QueueSong(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userHeader := r.Header.Get("X-User")
	if len(userHeader) == 0 {
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	user := &User{}
	errDecode := json.Unmarshal([]byte(userHeader), &user)
	if errDecode != nil {
		http.Error(w, "Error getting user", http.StatusInternalServerError)
		return
	}

	pathid := path.Base(r.URL.Path)
	split := strings.Split(pathid, "&")
	pathid = split[0]
	pid, errConv := strconv.Atoi(pathid)
	if errConv != nil {
		http.Error(w, "Not an integer", http.StatusBadRequest)
		return
	}

	preset, errDB := ctx.PStore.GetPreset(pid)
	if errDB != nil {
		http.Error(w, errDB.Error(), http.StatusInternalServerError)
		return
	}
	if preset == nil {
		http.Error(w, "Preset does not exist", http.StatusBadRequest)
		return
	}
	if preset.User.UserID != user.UserID {
		http.Error(w, "Access forbidden", http.StatusForbidden)
		return
	}

	choices := make([]randutil.Choice, 0)
	for _, pl := range preset.Playlists {
		choices = append(choices, randutil.Choice{pl.Weight, pl})
	}
	result, err := randutil.WeightedChoice(choices)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	//TestPL := &Playlist{}
	//TestPL.SpotifyURI = "7ryQO7Am1wFuGmkympfCjb"

	playlist := result.Item.(*Playlist)
	tracks, err := GetPlaylistTracks(user, playlist)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	code, uri, errQueueSong := ctx.QueueSongFromPlaylist(user, preset, tracks)
	if errQueueSong != nil {
		http.Error(w, errQueueSong.Error(), code)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(uri))
}

//TestGPT is a test handler
func (ctx *PresetContext) TestGPT(w http.ResponseWriter, r *http.Request) {
	userHeader := r.Header.Get("X-User")
	if len(userHeader) == 0 {
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	user := &User{}
	errDecode := json.Unmarshal([]byte(userHeader), &user)
	if errDecode != nil {
		http.Error(w, "Error getting user", http.StatusInternalServerError)
		return
	}

	TestPL := &Playlist{}
	TestPL.SpotifyURI = "38p8VZWNplCs5CP0eNvdvp"
	TestPL.NumTracks = -1
	TestPL.Order = true

	tracks, err := GetPlaylistTracks(user, TestPL)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	encoded, errEncode := json.Marshal(tracks)
	if errEncode != nil {
		http.Error(w, errEncode.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(encoded)
}

//QueueSongFromPlaylist queues a song from a specified playlist
func (ctx *PresetContext) QueueSongFromPlaylist(user *User, ps *Preset, plt *PlaylistTracks) (int, string, error) {
	total := plt.Total
	if plt.Total > 100 {
		total = 100
	}

	if ps.RepeatLimit <= 0 { //for no repeat limit
		rand.Seed(time.Now().UnixNano())
		index := rand.Intn(total)
		uri := plt.Tracks[index].Track.TrackURI
		code, errQueue := Queue(user, uri)
		if errQueue != nil {
			return code, uri, errQueue
		}
		errAddTrack := ctx.PStore.AddRecentTrack(ps.PresetID, uri)
		return code, uri, errAddTrack
	}

	for i := 0; i < ps.RepeatLimit; i++ {
		rand.Seed(time.Now().UnixNano())
		index := rand.Intn(total)
		uri := plt.Tracks[index].Track.TrackURI
		contains, err := ctx.PStore.InRecentTracks(uri, ps.PresetID, ps.RepeatLimit-i)
		if err != nil {
			return 0, uri, err
		}
		if contains {
			fmt.Println("true")
		}
		if !contains {
			code, errQueue := Queue(user, uri)
			if errQueue != nil {
				return code, uri, errQueue
			}
			errAddTrack := ctx.PStore.AddRecentTrack(ps.PresetID, uri)
			return code, uri, errAddTrack
		}
	}

	return 666, "", errors.New("Hit refresh limit")
}

//Queue ques the song with the specified spotify track uri
func Queue(user *User, uri string) (int, error) {
	url := "https://api.spotify.com/v1/me/player/queue?uri=spotify%3Atrack%3A" + uri
	client := &http.Client{}
	req, err := http.NewRequest("POST", url, nil)
	if err != nil {
		return 0, err
	}

	req.Header.Set("Authorization", user.AccessToken)
	response, err := client.Do(req)
	if err != nil {
		return 0, err
	}

	fmt.Println(response.StatusCode)

	if response.StatusCode != 204 {
		fmt.Println(uri)
		return response.StatusCode, errors.New("Spotify status code" + strconv.Itoa(response.StatusCode))
	}

	return 204, nil
}

//GetPlaylistTracks gets the tracks for a given playlist
func GetPlaylistTracks(user *User, pl *Playlist) (*PlaylistTracks, error) {
	url := "https://api.spotify.com/v1/playlists/" + pl.SpotifyURI + "/tracks"
	client := &http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", user.AccessToken)
	response, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	responseData, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	defer response.Body.Close()
	tracks := &PlaylistTracks{}
	json.Unmarshal(responseData, &tracks)

	startIndex := pl.NumTracks //temp
	if tracks.Total > 100 {
		if pl.NumTracks > 0 {
			startIndex = tracks.Total - 100
		} else {
			rand.Seed(time.Now().UnixNano())
			startIndex = rand.Intn(tracks.Total-100) + 1
		}

		url = "https://api.spotify.com/v1/playlists/" + pl.SpotifyURI + "/tracks?offset=" + strconv.Itoa(startIndex) + "&limit=100"
		client := &http.Client{}
		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			return nil, err
		}

		req.Header.Set("Authorization", user.AccessToken)
		response, err := client.Do(req)
		if err != nil {
			return nil, err
		}

		fmt.Println(response.StatusCode)
		responseData, err := ioutil.ReadAll(response.Body)
		if err != nil {
			return nil, err
		}

		defer response.Body.Close()
		tracks2 := &PlaylistTracks{}
		json.Unmarshal(responseData, &tracks2)
		tracks2.Total = 100

		tracks = tracks2
	}

	to := 1
	newTracks := &PlaylistTracks{}
	newTracks.Tracks = make([]*Track, 0)
	if pl.NumTracks > 0 {
		if pl.Order {
			for i := 0; i < pl.NumTracks; i++ {
				newTracks.Tracks = append(newTracks.Tracks, tracks.Tracks[i])
			}
		} else {
			to = tracks.Total - pl.NumTracks - 1
			for i := tracks.Total - 1; i > to; i-- {
				newTracks.Tracks = append(newTracks.Tracks, tracks.Tracks[i])
			}
		}
		newTracks.Total = len(newTracks.Tracks)
		return newTracks, nil
	}

	return tracks, nil

}

//EditPlaylists edits the weights + other parameters of the playlist
func (ctx *PresetContext) EditPlaylists(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userHeader := r.Header.Get("X-User")
	if len(userHeader) == 0 {
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	user := &User{}
	errDecode := json.Unmarshal([]byte(userHeader), &user)
	if errDecode != nil {
		http.Error(w, "Error getting user", http.StatusInternalServerError)
		return
	}

	pathid := path.Base(r.URL.Path)
	split := strings.Split(pathid, "&")
	pathid = split[0]
	pid, errConv := strconv.Atoi(pathid)
	if errConv != nil {
		http.Error(w, "Not an integer", http.StatusBadRequest)
		return
	}

	preset, errDB := ctx.PStore.GetPreset(pid)
	if errDB != nil {
		http.Error(w, errDB.Error(), http.StatusInternalServerError)
		return
	}
	if preset == nil {
		http.Error(w, "Preset does not exist", http.StatusBadRequest)
		return
	}
	if preset.User.UserID != user.UserID {
		http.Error(w, "Access forbidden", http.StatusForbidden)
		return
	}

	p := &Preset{}
	errDecode = json.NewDecoder(r.Body).Decode(&p)
	if errDecode != nil {
		http.Error(w, "Bad input", http.StatusBadRequest)
		return
	}

	for i := 0; i < len(p.Playlists); i++ {
		if p.Playlists[i].PresetID != pid {
			http.Error(w, "One or more playlist does not belong to the preset. Check the playlistIDs of each playlist", http.StatusBadRequest)
			return
		}

		err := ctx.PStore.EditPlaylist(p.Playlists[i])
		if err != nil {
			http.Error(w, "Error upding weight for"+strconv.Itoa(p.Playlists[i].PlaylistID), http.StatusInternalServerError)
			return
		}
	}

	encoded, errEncode := json.Marshal(p)
	if errEncode != nil {
		http.Error(w, "Error encoding user to JSON", http.StatusBadRequest)
		return
	}
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(encoded)
}
