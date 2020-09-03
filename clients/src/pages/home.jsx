import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Navbar } from 'react-bootstrap'
import Next from '../images/nextsong.png'
import './home.css'
import Preset from '../components/preset'
import Create from '../components/create'
import NowPlaying from '../components/nowPlaying'

class Home extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        presetsdata: '',
        loggedIn: true,
        access_token: '',
        curPresetID: 0,
        curPresetName: "",
        listening: false
      }
    }

    componentDidMount () {
      if(this.props.location.state == null) {
        this.setState ({
          loggedIn: false
        })
      } else {
        if (this.state.access_token === '') {
          this.setState({
            access_token: "Bearer " + this.props.location.state.access_token
          },
          this.onATCallback
          )
        }
      }
    }

    /*
    shouldComponentUpdate(nextProps, nextState) {
      console.log(nextProps, nextState)
      
      if (!this.state.presetsdata === "") {
        if(nextState.listening === this.state.listening) {
          return false;
        } else {
          console.log("not the same?")
        }
      }
      
      return true
    }
    */
   
    render = () => {
      if (!this.state.loggedIn) {
        return (
          <div>
            Does not appear that you are logged in, please try logging in&nbsp;    
            <Link to = "/">here</Link>
          </div>
          
        )
      }

      if(this.state.presetsdata !== '') {
        var ps = this.state.presetsdata
        const presets = ps.map((ps) => 
        <div key={ps.presetId}>
          <Preset 
            data = {ps}
            access_token = {this.state.access_token}
            refresh_token = {this.props.location.state.refresh_token}
            getUserPageInfo = {this.getUserPageInfo}
            addNewPlaylist = {this.addNewPlaylist}
            deletePreset = {this.deletePreset}
            deletePlaylist = {this.deletePlaylist}
            editPreset = {this.editPreset}
            editPlaylist = {this.editPlaylist}
            getAccessToken = {this.getAccessToken}
            changeStation = {this.changeStation}
            skipSong = {this.skipSong}
            startShuffling = {this.startShuffling}
            queueSong = {this.queueSong}
            listening = {this.state.listening}
            editPlaylists = {this.editPlaylists}
          />
        </div>
        );
        return (
          <div>
             <Navbar bg="dark" variant="dark">
              <Navbar.Brand>
                <img
                  alt=""
                  src={Next}
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                />{' '}
                SmartShuffle
              </Navbar.Brand>
            </Navbar>
            <Container>
              <Row className ="justify-content-md-center">
                <Col md = "auto">
                  <NowPlaying
                    access_token = {this.state.access_token}
                    refresh_token = {this.props.location.state.refresh_token}
                    getAccessToken = {this.getAccessToken}
                    curPresetID = {this.state.curPresetID}
                    curPresetName = {this.state.curPresetName}
                    skipSong = {this.skipSong}
                    pause = {this.pause}
                    play = {this.play}
                    stopListening = {this.stopListening}
                    changeListening = {this.changeListening}
                    listening = {this.state.listening}
                    queueSong = {this.queueSong}
                  ></NowPlaying>
                </Col>
              </Row>
            </Container>
            <Container>
              <Row>
                <Col>
                  <div id = "container">
                    {presets}
                    <Create 
                      access_token = {this.state.access_token}
                      refresh_token = {this.props.location.state.refresh_token}
                      addNewPreset = {this.addNewPreset}
                      getAccessToken = {this.getAccessToken}
                    />
                  </div>
                </Col>
              </Row>
            </Container>
        </div>
        )
      }

      return (
        <div>Loading...</div>
      )
    }
      
    //function incase more gets added here since setState callback can only take 1
    onATCallback() {
      this.getUserPageInfo()
    }

    addNewPreset = (ps) => {
      var presets = this.state.presetsdata.concat(ps)
      this.setState({
        presetsdata: presets
      })
      console.log(presets)
    }

    addNewPlaylist = (pl, psid) => {
      var presets = this.state.presetsdata
      for(var i = 0; i<presets.length; i++) {
        if (presets[i].presetId === psid) {
          presets[i].playlists = presets[i].playlists.concat(pl)
          break
        }
      }

      this.setState({
        presetsdata: presets
      })
      console.log(presets)
    }

    deletePreset = (psid) => {
      var presets = this.state.presetsdata
      for(var i = 0; i<presets.length; i++) {
        if (presets[i].presetId === psid) {
          presets.splice(i, 1)
          break
        }
      }

      this.setState({
        presetsdata: presets
      })
      console.log(presets)
    } 

    deletePlaylist = (psid, plid) => {
      var presets = this.state.presetsdata
      for(var i = 0; i<presets.length; i++) {
        if (presets[i].presetId === psid) {
          for(var j = 0; i<presets[i].playlists.length; j++) {
            if(presets[i].playlists[j].playlistID === plid) {
              presets[i].playlists.splice(j, 1)
              break
            }
          }
        }
      }

      this.setState({
        presetsdata: presets
      })
      console.log(presets)
    }

    editPreset = (ps) => {
      var presets = this.state.presetsdata
      for(var i = 0; i<presets.length; i++) {
        if (presets[i].presetId === ps.presetId) {
          presets[i].presetName = ps.presetName
          presets[i].repeatLimit = ps.repeatLimit
          break
        }
      }

      this.setState({
        presetsdata: presets
      })
      console.log(presets)
    }

    editPlaylist = (psid, pl) => {
      var presets = this.state.presetsdata
      console.log(pl)
      for(var i = 0; i<presets.length; i++) {
        if (presets[i].presetId === psid) {
          for(var j = 0; i<presets[i].playlists.length; j++) {
            if(presets[i].playlists[j].playlistID === pl.playlistID) {
              console.log(pl.playlistName)
              presets[i].playlists[j].NumTracks = pl.NumTracks
              presets[i].playlists[j].order = pl.order
              presets[i].playlists[j].playlistName = pl.playlistName
              presets[i].playlists[j].uri = pl.uri
              presets[i].playlists[j].weight = pl.weight
              break
            }
          }
        }
      }

      this.setState({
        presetsdata: presets
      })
      console.log(presets)
    }

    editPlaylists = (ps) => {
      var presets = this.state.presetsdata
      for(var i = 0; i<presets.length; i++) {
        if (presets[i].presetId === ps.presetId) {
          presets[i] = ps
          break
        }
      }

      this.setState({
        presetsdata: presets
      })
      console.log(presets)
    }

    stopListening = () => {
      this.setState({
        listening: false,
        curPresetID: 0,
        curPresetName: ""
      })
    }

    changeListening = (l) => {
      if (l !== this.state.listening) {
        this.setState({
          listening: l
        })
      }
    }

    queueSong = (psid) => {
      setTimeout(() => {
        var url = "https://shuffle.cahillaw.me/v1/queue/" + psid
        fetch(url, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.state.access_token
          }
        })
        .then((response) => {
          if (response.status === 200) {
            response.text().then((data) => {
              console.log(data)
            })
            console.log("Song Queued!")
          } else if (response.status === 401) {
            console.log("access token is bad, getting new one...")
            this.getAccessToken(this.queueSong)
          } else if (response.status === 404) {
            alert("Cannot find Spotify Session")
          }
        })
      }, 0)
    }

    startShuffling = (psid, psname, numSongs, interval) => {
      this.setState({
        listening: true,
        curPresetID: psid,
        curPresetName: psname
      })
      for(var i = 0; i<numSongs; i++) {
        setTimeout(() => {
          this.queueSong(psid)
        }, i*1000)
      }
      setTimeout(() => {
    //    this.skipSong()
        setInterval(() => {
          if(this.state.curPresetName !== "" && this.state.listening) {
            this.queueSong(psid)
          }
        }, interval*60000)

      },0)
    }

    skipSong = () => {
      setTimeout(() => {
        var url = "https://api.spotify.com/v1/me/player/next"
        fetch(url, {
          method: 'post',
          headers: {
            'Authorization': this.state.access_token
          }
        })
        .then((response) => {
          if (response.status === 204) {
            console.log("song skipped")
            if(this.state.curPresetID > 0) {
              this.queueSong(this.state.curPresetID)
            }
          } else if (response.status === 401) {
            console.log("access token is bad, getting new one...")
            this.props.getAccessToken(this.skipSong)
          }
        })
      }, 0)
    }

    pause = () => {
      setTimeout(() => {
        var url = "https://api.spotify.com/v1/me/player/pause"
        fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': this.state.access_token
          }
        })
        .then((response) => {
          if (response.status === 204) {
            console.log("paused playback")
          } else if (response.status === 401) {
            console.log("access token is bad, getting new one...")
            this.props.getAccessToken(this.pause)
          } else if (response.status === 403) {
            alert("Playback is already paused")
          }
        })
      }, 0)
    }

    play = () => {
      setTimeout(() => {
        var url = "https://api.spotify.com/v1/me/player/play"
        fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': this.state.access_token
          }
        })
        .then((response) => {
          if (response.status === 204) {
            console.log("started playback")
          } else if (response.status === 401) {
            console.log("access token is bad, getting new one...")
            this.props.getAccessToken(this.play)
          } else if (response.status === 403) {
            alert("Playback is already playing")
          }
        })
      }, 0)
    }

    getUserPageInfo = () => {
      setTimeout(() => {
        var url = "https://shuffle.cahillaw.me/v1/userpage"
        fetch(url, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.state.access_token 
          }
        })
        .then((response) => {
          if (response.status === 200) {
            response.json().then((data) => {
              console.log(data)
              this.setState({
                presetsdata: data
              })
            })
          } else if (response.status === 401) {
            console.log("access token is bad, getting new one...")
            this.getAccessToken(this.getUserPageInfo)
          }
        })
      }, 0)
      
    }

    //taken from https://formcarry.com/documentation/fetch-api-example
    encodeFormData = (data) => {
      return Object.keys(data)
          .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
          .join('&');
    }

    getAccessToken = (callback) => {
      var client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID
      var client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET

      let formData = {grant_type: 'refresh_token', refresh_token: this.props.location.state.refresh_token}

      fetch('https://accounts.spotify.com/api/token', {
        method: 'post',
        headers: {
          'Content-Type': "application/x-www-form-urlencoded",
          'Accept': 'application/json',
          'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        body: this.encodeFormData(formData)
      })
      .then((response) => {
        response.json().then((data) => {
          if (response.status === 200) {
            var newAccessToken = "Bearer " + data.access_token
            console.log(newAccessToken)
            this.setState ({
              access_token: newAccessToken
            },
            callback()
            )
          } else {
            console.log("failed to get new token")
          }
        })
      })
    }

}

export default Home