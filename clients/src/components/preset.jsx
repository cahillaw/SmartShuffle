import React, { useState } from 'react'
import './preset.css'
import { Button, Modal } from 'react-bootstrap'
import Playlist from './playlist'
import NewPlaylist from './newPlaylist'
import EditPreset from './editPreset'

class Preset extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        access_token: '',
        refresh_token: '',
        edit: false,
        test: true
      }
    }

    componentDidMount () {
      console.log("loaded")
     // console.log(process.env.REACT_APP_SPOTIFY_CLIENT_ID)
     // console.log(process.env.REACT_APP_SPOTIFY_CLIENT_SECRET)
    }

    render = () => {
      function DeletePreset(props) {
        const [show, setShow] = useState(false);
      
        const handleClose = () => {
          setShow(false);
        }

        const handleDelete = () => {
          setShow(false);
          props.clickDelete();
        }
        const handleShow = () => setShow(true);

        return (
          <>
            <Button id = "deletebutton" variant= "dark" size= "sm" onClick={handleShow}>Delete Station</Button>{' '}
      
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Delete Station</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to delete this station?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="dark" onClick={handleDelete}>
                  Delete Station
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        );
      }

      var pls = this.props.data.playlists
      const playlists = pls.map((pl) => 
      <div key={pl.playlistID}> 
        <Playlist 
          data = {pl}
          access_token = {this.props.access_token}
          refresh_token = {this.props.refresh_token}
          getUserPageInfo = {this.props.getUserPageInfo}
          deletePlaylist = {this.props.deletePlaylist}
          editPlaylist = {this.props.editPlaylist}
          getAccessToken = {this.props.getAccessToken}
        />
      </div>
      );

      if(this.state.edit) {
        return (
          <EditPreset
            access_token = {this.props.access_token}
            refresh_token = {this.props.refresh_token}
            data = {this.props.data}
            name = {this.props.data.presetName}
            repeatLimit = {this.props.data.repeatLimit}
            getUserPageInfo = {this.props.getUserPageInfo}
            clickEdit = {this.clickEdit}
            editPreset = {this.props.editPreset}
            getAccessToken = {this.props.getAccessToken}
          />
        )
      }

        return (
          <div id = "preset">
            <strong id = "pname"> {this.props.data.presetName} </strong>
            <Button id = "button" variant= "dark" size= "sm" onClick={() => this.queueSong()} >Queue Song!</Button>{' '}
            <Button variant= "dark" size= "sm" onClick={() => this.startShuffling()} >Skip Song</Button>{' '}
            <div id = "rlimit"> Repeat Limit: {this.props.data.repeatLimit} </div>
            <div id = "playlists">
              {playlists}
              <NewPlaylist
                access_token = {this.props.access_token}
                refresh_token = {this.props.refresh_token}
                data = {this.props.data}
                getUserPageInfo = {this.props.getUserPageInfo}
                addNewPlaylist = {this.props.addNewPlaylist}
                getAccessToken = {this.props.getAccessToken}
               />
            </div>
            <div>
              <DeletePreset clickDelete={this.clickDelete} test="3"></DeletePreset>
              <Button id = "editbutton" variant= "dark" size= "sm" onClick={() => this.clickEdit()}>Edit Station</Button>{' '}
            </div>
          </div>
        )
    }

    clickDelete = () => {
      this.deletePreset();
    }

    clickEdit = () => {
      this.setState({
        edit: !this.state.edit
      })
    }
    
    queueSong = () => {
      setTimeout(() => {
        /*
        if (this.state.test) {
          var auth = "somethingwrongobv"
          this.setState({
            test: false
          })
        } else {
          var auth = this.props.access_token
        }
        */
        
       // console.log(auth)
        var url = "https://shuffle.cahillaw.me/v1/queue/" + this.props.data.presetId
        fetch(url, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.props.access_token
          }
        })
        .then((response) => {
          if (response.status === 200) {
            response.text().then((data) => {
              console.log(data)
          //    return data
            })
            console.log("Song Queued!")
          } else if (response.status === 401) {
            console.log("access token is bad, getting new one...")
            this.props.getAccessToken(this.queueSong)
          }
        })
      }, 0)
    }

    queueSongPromise = () => {
      var url = "https://shuffle.cahillaw.me/v1/queue/" + this.props.data.presetId
      return fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.props.access_token
        }
      })
      .then(function(response) {
        if (response.status === 200) {
          return response.text()
        } else if (response.status === 401) {
          console.log("access token is bad, getting new one...")
          this.props.getAccessToken(this.queueSongPromise)
        }
      }).then(function(text) {
        return text;
      }).then(function(result) {
        return result;
      })
    }

    startShuffling = () => {
    var test = "swag"
    this.queueSongPromise().then((result) => {
       test = result
       console.log(test)
       this.skipSong()
    })
    setTimeout(() => {
      console.log(test)
    }, 3000)
      /*
      console.log(uri)
      var tracks = [uri]
      var index = 0
      setTimeout(() => {
        this.skipSong()
          for(var i = 0; i<1; i++) {
            setTimeout(() => {
              this.queueSongPromise().then(function(result) {
                tracks.push(result)
              })
            }, 100)
          }

          setInterval(() => {
            this.getCurrentPlaybackInfo().then(function(result) {
              console.log(result);
              if(!tracks.includes(result.item.id)) {
                  tracks.splice(index, 0, result.item.id)
                  index++
              }

              if (result.is_playing && tracks[index] !== result.item.id) {
                for(var j = index + 1; j<tracks.length; j++) {
                  this.queueSongPromise().then(function(result) {
                    tracks.push(result)
                  })
                  if(tracks[j] === result.item.id) {
                    index = j
                    break
                  } 
                }
              }
            });
          }, 3000)
      }, 0)
      */
    }

    test = () => {
      this.getCurrentPlaybackInfo().then(function(result) {
        console.log(result);
      });
    }

    getCurrentPlaybackInfo = () => {
      return fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        method: 'get',
        headers: {
          'Authorization': this.props.access_token
        }
      })
      .then(function(response) {
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 401) {
          console.log("access token is bad, getting new one...")
          this.props.getAccessToken(this.getCurrentPlaybackInfo)
        }
      }).then(function(json) {
        console.log(json.progress_ms)
        return json;
      })
    }

    skipSong = () => {
      setTimeout(() => {
        var url = "https://api.spotify.com/v1/me/player/next"
        fetch(url, {
          method: 'post',
          headers: {
            'Authorization': this.props.access_token
          }
        })
        .then((response) => {
          if (response.status === 204) {
            console.log("song skipped")
          } else if (response.status === 401) {
            console.log("access token is bad, getting new one...")
            this.props.getAccessToken(this.skipSong)
          }
        })
      }, 0)
    }

    deletePreset = () => { 
      setTimeout(() => {
        var url = "https://shuffle.cahillaw.me/v1/presets/" + this.props.data.presetId
        fetch(url, {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.props.access_token 
          }
        })
        .then((response) => {
          if (response.status === 200) {
            console.log("deleted")
            this.props.deletePreset(this.props.data.presetId)
          } else if (response.status === 401) {
            console.log("access token is bad, getting new one...")
            this.props.getAccessToken(this.deletePreset)
          }
        })
      }, 0)
    }
    
}

export default Preset