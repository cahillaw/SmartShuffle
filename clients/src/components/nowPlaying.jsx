import React from 'react'
import './nowPlaying.css'
import { Spinner, Col, Row, Container, ProgressBar, Button, Alert } from 'react-bootstrap'
import StationListening from '../components/stationListening'
import Logo from '../images/smartshuflelogo.png'


class NowPlaying extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            aa: "",
            track: "",
            artist: "",
            album: "",
            loading: true,
            length: 0,
            current: 0,
            curMin: "0.00",
            curLen: "3.00",
            isIdle: false
        }
        this.npinterval = ""
        this.time = ""
        this.time2 = ""
      }

      componentDidMount () {
        var num = 0
        this.getCurrentPlaybackInfo()
        this.npinterval = setInterval(() => {
          if(!this.props.loggedIn) {
            clearInterval(this.npinterval)
          }
          if(!this.state.isIdle) {
            num = num + 1
            if(this.props.listening && !this.state.pausedProgress) {
              var numAdd = 1000
              if (this.state.current + 1000 > this.state.length) {
                numAdd = 0
              }
              this.setState({
                current: this.state.current + numAdd,
                curMin:  this.millisToMinutesAndSeconds(this.state.current + numAdd)
              })
            }
            if (num%30 === 0) {
                this.getCurrentPlaybackInfo()
            }
          }
        }, 1000)

        this.inactivityTime();
        
      }
      
      
      render = () => {
        if(!this.props.listening) {
          const StationName = () => {
            if(this.props.curPresetName === "") {
              return (
                <strong>No Current Station</strong>
              )
            } else {
              return (
                <div>
                  <strong>Listening to {this.props.curPresetName}</strong>
                  <br></br>
                  <br></br>
                  <Alert id = "noqueue" variant = "warning">SmartShuffle will not queue while playback is paused</Alert>
                  <Button id = "stoplistening" variant= "dark" size= "sm" onClick={this.props.stopListening}>Stop Listening</Button>{' '}
                </div>  
              )               
            }
          }

          return (
            <div id = "nowplaying">
              <Container>
              <Row>
                <Col >
                  <strong id = "title">Now Playing</strong>
                  <br></br>
                  <br></br>
                  <strong>Cannot find Spotify Session</strong>
                  <div>To see what you are listening to here and to play a station, start listening to something on Spotify!</div>
                </Col>
                <Col>
                  <StationName></StationName>
                </Col>
              </Row>
            </Container>
            </div>
          )
        }

        return (
            <div id = "nowplaying">
              <Container>
              <Row>
                <Col >
                  <strong id = "title">Now Playing</strong>
                  <br></br>
                  {this.state.loading ? <Spinner id="spinner" animation = "border"/> : <img id ="aa" src={this.state.aa ? this.state.aa : Logo} alt="album artwork"/>}
                  <br></br>
                  <div id = "textoverflow">
                    <strong>{this.state.track}</strong> 
                    <br></br>
                    <strong id = "title">{this.state.artist}</strong>
                  </div>
                </Col>
                <Col>
                  <StationListening 
                    pause={this.props.pause} 
                    play={this.props.play}
                    skipSong={this.props.skipSong}
                    stopListening={this.props.stopListening}
                    changeListening={this.props.changeListening}
                    queueSong = {this.props.queueSong}
                    curPresetID = {this.props.curPresetID}
                    curPresetName = {this.props.curPresetName}
                    handleTQChange = {this.handleTQChange}
                    getCurrentPlaybackInfo = {this.getCurrentPlaybackInfo}
                    listening = {this.props.listening}
                    pausedProgress = {this.pausedProgress}
                    ></StationListening>
                </Col>
              </Row>
              <Row id ="row2">
                <Col> 
                  <div id = "left"> {this.state.curMin} </div>
                </Col>
                <Col>
                  <ProgressBar id = "bar" min = "0.00" max = {this.state.length} now = {this.state.current}></ProgressBar>
                </Col>
                <Col>
                  <div id = "right"> {this.state.curLen}</div>
                </Col>
              </Row>
            </Container>
            </div>
        )
      }

      getCurrentPlaybackInfo = () => {
        setTimeout(() => {
            var url = "https://api.spotify.com/v1/me/player/currently-playing"
            fetch(url, {
              method: 'get',
              headers: {
                'Authorization': this.props.access_token
              }
            })
            .then((response) => {
              if (response.status === 200) {
                response.json().then((data) => {
                  this.props.changeListening(data.is_playing)
                  this.setState({
                    aa: data.item.is_local ? "" : data.item.album.images[0].url,
                    track: data.item.name ? data.item.name : "Unknown",
                    artist: data.item.artists[0].name ? data.item.artists[0].name : "Unknown",
                    album: data.item.album.name ? data.item.album.name : "Unknown",
                    loading: false,
                    current: data.progress_ms,
                    length: data.item.duration_ms,
                    curMin: this.millisToMinutesAndSeconds(data.progress_ms),
                    curLen: this.millisToMinutesAndSeconds(data.item.duration_ms),
                    pausedProgress: !data.is_playing
                  })
                })
              } else if (response.status === 401) {
                this.props.getAccessToken(this.getCurrentPlaybackInfo)
              }
            })
          }, 0)
      }

      pausedProgress = () => {
        this.setState({
          pausedProgress: !this.state.pausedProgress
        })
      }

      millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
      //  console.log(seconds)
        if (parseInt(seconds) === 60) {
          minutes = minutes + 1
          seconds = 0
        }
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
      }

      inactivityTime = () => {
        window.onload = this.resetTimer;
        document.onmousemove = this.resetTimer;
        document.onkeypress = this.resetTimer;
        document.onmousedown = this.resetTimer; 
        document.ontouchstart = this.resetTimer;
        document.onclick = this.resetTimer;    
      }

      resetTimer = () => {
        if(this.state.isIdle) {
          this.getCurrentPlaybackInfo()
          this.setState({
            isIdle: false
          })
        }
        clearTimeout(this.time);
        clearTimeout(this.time2)
        this.time = setTimeout(() => {
          this.setState({
            isIdle: true
          })
          var currentPausedState = this.props.listening
          this.time2 = setTimeout(()=> {
            this.getCurrentPlaybackInfo()
            setTimeout(() => {
              if(this.props.listening !== currentPausedState) {
                this.resetTimer();
              }
            }, 5000)
          }, 300000)
        }, 300000)
    }
}

export default NowPlaying