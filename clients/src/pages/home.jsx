import React from 'react'
import { Link } from 'react-router-dom'
import { Jumbotron, Container, Row, Col } from 'react-bootstrap'
import './home.css'
import Preset from '../components/preset'
import Create from '../components/create'

class Home extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        presetsdata: '',
        loggedIn: true,
        access_token: ''
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
          />
        </div>
        );
        return (
          <div>
            <Jumbotron>
              <h1 id="title">Welcome to SmartShuffle.io</h1>
              <br></br>
              <div>Create your own custom Radio Stations and start listening! </div>
              <div>Changing the playlist is a relic of the past!</div>
            </Jumbotron>
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

    getUserPageInfo = () => {
      var url = "https://shuffle.cahillaw.me/v1/userpage"
      fetch(url, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.state.access_token 
        }
      })
      .then((response) => {
        response.json().then((data) => {
          console.log(data)
          if (response.status === 200) {
            this.setState({
              presetsdata: data
            })
          } else {
            console.log("non 200 status code loading page info")
          }
        })
      })
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