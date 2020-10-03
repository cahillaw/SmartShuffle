import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Alert } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import './home.css'
import Preset from '../components/preset'
import Create from '../components/create'
import NowPlaying from '../components/nowPlaying'
import SSNav from '../components/ssNav'

class Home extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        presetsdata: '',
        loggedIn: true,
        access_token: '',
        curPresetID: 0,
        curPresetName: "",
        listening: false,
        curStation: false
      }
      this.interval = ""
      this.numRetries = 0
    }

    componentDidMount () {
      var rt = this.getCookie("refresh_token") 
      var at = this.getCookie("access_token")
      //if didn't come from login page:
  
      if (this.props.location.state == null) {
        if(!rt) {
          this.setState ({
            loggedIn: false
          })
        } else if (!at) {
          this.setState({
            refresh_token: rt
          },
          this.getAccessToken(() => {
            this.onATCallback()
          }))
        } else {
          this.setState({
            access_token: at,
            refresh_token: rt
          },
          this.onATCallback
          )
        }
      } else {
        //came from login page
        if (this.state.access_token === '') {
          this.setCookie("refresh_token", this.props.location.state.refresh_token, 365)
          //if page is refreshed once access token has expired
          this.getAccessToken(() => {
            this.onATCallback()
          })
        }
      }
    }
   
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
            refresh_token = {this.state.refresh_token}
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
            curStation = {this.state.curStation}
            isPremium = {this.state.isPremium}
          />
        </div>
        );
        return (
          <div>
            <Helmet>
              <title>Home | SmartShuffle.io</title>
              <meta property="og:title" content = "Home | SmartShuffle.io"/>
              <meta property="og:url" content = "http://smartshuffle.io/home"/>
            </Helmet>
            <SSNav></SSNav>
            <div id = "pagecontent">
            <div id = "npcont">
              <Row id = "alertrow">
                <Col>
                  <div id ="alertcenter">
                    {this.state.premError ? null : 
                    <Alert id="noprem" variant="danger" onClose={() => this.setState({premError: true})} dismissible>
                      <Alert.Heading>
                      You do not have Spotify Premium
                      </Alert.Heading>
                        <div>
                          SmartShuffle needs to be able to queue songs to listen to stations, a feature only availble with Spotify Premium. You can test the site by creating stations, however you will not be able able to listen to them. 
                        </div>
                    </Alert>
                    }
                  </div>
                </Col>
              </Row>
              <Row id = "nprow">
                <Col id = "npcol">
                  <div id = "npcenter">
                    <NowPlaying
                      access_token = {this.state.access_token}
                      refresh_token = {this.state.refresh_token}
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
                      loggedIn = {this.state.loggedIn}
                    ></NowPlaying>
                  </div>
                </Col>
              </Row>
            </div>
            <Container id = "outside">
              <Row>
                <Col id = "pscol">
                  <div id = "container">
                    {presets}
                    <Create 
                      access_token = {this.state.access_token}
                      refresh_token = {this.state.refresh_token}
                      addNewPreset = {this.addNewPreset}
                      getAccessToken = {this.getAccessToken}
                    />
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
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
      setTimeout(() =>{
        this.checkIfPremium()
      }, 0)
    }

    addNewPreset = (ps) => {
      var presets = this.state.presetsdata.concat(ps)
      this.setState({
        presetsdata: presets
      })
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
    } 

    deletePlaylist = (psid, plid) => {
      var presets = this.state.presetsdata
      for(var i = 0; i<presets.length; i++) {
        if (presets[i].presetId === psid) {
          for(var j = 0; j<presets[i].playlists.length; j++) {
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
    }

    editPlaylist = (psid, pl) => {
      var presets = this.state.presetsdata
      for(var i = 0; i<presets.length; i++) {
        if (presets[i].presetId === psid) {
          for(var j = 0; j<presets[i].playlists.length; j++) {
            if(presets[i].playlists[j].playlistID === pl.playlistID) {
              presets[i].playlists[j] = pl
              break
            }
          }
        }
      }

      this.setState({
        presetsdata: presets
      })
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
    }

    stopListening = () => {
      this.setState({
        curPresetID: 0,
        curPresetName: "",
        curStation: false
      })
      clearInterval(this.interval)
    }

    changeListening = (l) => {
      if (l !== this.state.listening) {
        this.setState({
          listening: l
        })
      }
    }

    queueSong = (psid, callback) => {
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
            if(typeof callback === "function") {
              callback();
            }
          } else if (response.status === 401 || response.status === 403 ) {
            this.getAccessToken(this.queueSong(psid))
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
        curPresetName: psname,
        curStation: true
      })
      for(var i = 0; i<numSongs; i++) {
        setTimeout(() => {
          this.queueSong(psid)
        }, i*1000)
      }
      setTimeout(() => {
    //    this.skipSong()
        this.interval = setInterval(() => {
          if(this.state.curPresetName !== "" && this.state.listening) {
            this.queueSong(psid)
          }
        }, interval*60000)

      },0)
    }

    skipSong = (callback) => {
      if(this.state.curPresetID > 0) {
        this.queueSong(this.state.curPresetID, this.ssFunc(callback))
      } else {
        this.ssFunc(callback);
      }
    }

    ssFunc = (callback) => {
      setTimeout(() => {
        var url = "https://api.spotify.com/v1/me/player/next"
        fetch(url, {
          method: 'post',
          headers: {
            'Authorization': this.state.access_token
          }
        })
        .then((response) => {
          if(typeof callback === "function") {
            callback();
          }
          if (response.status === 401) {
            this.getAccessToken(this.skipSong)
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
          } else if (response.status === 401) {
            this.getAccessToken(this.pause)
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
          } else if (response.status === 401) {
            this.getAccessToken(this.play)
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
              this.setState({
                presetsdata: data
              })
            })
          } else if (response.status === 401) {
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

    onSetStateCB(callback) {
      if(this.numRetries < 1) {
        this.numRetries++
        callback()
      } else {
        setTimeout(() => {
          this.numRetries++
          if(this.numRetries < 3) {
            callback()
          } else {
            this.numRetries = 0
          }
        }, 2000)
      }
    }

    logOut = () => {
      document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = '/'
    }

    getAccessToken = (callback) => {
      var client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID
      var client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET

      let formData = {grant_type: 'refresh_token', refresh_token: this.getCookie("refresh_token")}

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
        if (response.status === 200) {
          response.json().then((data) => {
            var newAccessToken = "Bearer " + data.access_token
            this.setCookie("access_token", newAccessToken, .0381944)
            this.setState ({
              access_token: newAccessToken
            },
            this.onSetStateCB(callback)
            )
          })
        } else if (response.status === 400) {
          this.setState({
            loggedIn: false
          })
        } 
      })
    }

    checkIfPremium = () => {
      fetch('https://api.spotify.com/v1/me', {
        method: 'get',
        headers: {
          'Authorization': this.state.access_token 
        }
      })
      .then((response) => {
        if (response.status === 200) {
            response.json().then((data) => {
              if (data.product !== "premium") {
                this.setState({
                  isPremium: false,
                  premError: false
                })
              } else {
                this.setState({
                  isPremium: true,
                  premError: true
                })
              }
            })
          } else if (response.status === 401) {
            this.getAccessToken(this.checkIfPremium)
          }
      }) 
    }

    //from: https://www.w3schools.com/js/js_cookies.asp
    setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays*24*60*60*1000));
      var expires = "expires="+ d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    //from: https://www.w3schools.com/js/js_cookies.asp
    getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
      }
      return ""
    }
}

export default Home