import React, { useState } from 'react'
import './nowPlaying.css'
import Next from '../images/nextsong.png'
import { Spinner, Col, Row, Container, ProgressBar, Button, Form } from 'react-bootstrap'


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
            curLen: "3.00"
        }
      }

      componentDidMount () {
        var num = 0
        this.getCurrentPlaybackInfo()
        setInterval(() => {
          num = num + 1
          if(this.props.listening) {
            var numAdd = 1000
            if (this.state.current + 1000 > this.state.length) {
              var numAdd = 0
            }
            this.setState({
              current: this.state.current + numAdd,
              curMin:  this.millisToMinutesAndSeconds(this.state.current + numAdd)
            })
          }
          if (num%30 === 0) {
            if(!this.props.inModal) {
              this.getCurrentPlaybackInfo()
            }
          }
        }, 1000)
      }
      
      render = () => {

        const StationListening = (props) => {

          const [numQueue, setQueue] = useState(1);

          const handleSkip = () => {
            props.skipSong();
            setTimeout(() => {
              this.getCurrentPlaybackInfo()
            }, 800)
          }

          const handlePause = () => {
            props.pause();
            props.changeListening(false)
          }

          const handlePlay = () => {
            props.play();
            props.changeListening(true)
          }

          const handleStopListening = () => {
            props.stopListening();
          }

          const handleQueueSongs = () => {
            for(var i = 0; i<numQueue; i++) {
              setTimeout(() => {
                props.queueSong(props.curPresetID)
              }, i*1000)
            }
          }
      
          const handleQueueChange = (event) => {
            console.log(event.target.value)
            setQueue(event.target.value)
          }

          if(this.props.curPresetName === "") {
            return (
              <div>
                <strong>No Current Station</strong>
                  <br></br>
                  <br></br> {
                    this.props.listening ? 
                    <div>
                      <Button id = "pause" variant= "dark" size= "sm" onClick={handlePause}>Pause</Button>{' '}
                      <Button id = "skip" variant= "dark" size= "sm"><img id ="nextsong" src={Next} onClick={handleSkip} alt ="Next Song" /></Button>{' '}
                    </div>
                    : <div>
                      <Button id = "play" variant= "dark" size= "sm" onClick={handlePlay}>Play</Button>{' '}
                      <Button id = "skip" variant= "dark" size= "sm"><img id ="nextsong" src={Next} onClick={handleSkip} alt ="Next Song" /></Button>{' '}
                    </div>
                  }
              </div>
            )
          } else {
            return (
              <div>
                <strong>Listening to {this.props.curPresetName}</strong>
                  <br></br>
                  <br></br>
                  <Button id = "pause" variant= "dark" size= "sm" onClick={handlePause}>Pause</Button>{' '}
                  <Button id = "skip" variant= "dark" size= "sm"><img id ="nextsong" src={Next} onClick={handleSkip} alt ="Next Song" /></Button>{' '}
                  <br></br>
                  <br></br>
                      <Button id = "queuesongs" variant= "dark" size= "sm" onClick={handleQueueSongs}>Queue Songs</Button>{' '}
                      <Form.Control id = "qs" type="number" size= "sm" defaultValue={numQueue} min = "1" max = "5" onChange={handleQueueChange}/>
                  <br></br>
                  <br></br>
                  <Button id = "stoplistening" variant= "dark" size= "sm" onClick={handleStopListening}>Stop Listening</Button>{' '}
              </div>
            )
          }
        }

        if(!this.props.listening) {
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
                  <strong>No Current Station</strong>
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
                  {this.state.loading ? <Spinner id="spinner" animation = "border"/> : <img id ="aa" src={this.state.aa} alt="album artwork"/>}
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
                    listening={this.props.listening}
                    queueSong = {this.props.queueSong}
                    curPresetID = {this.props.curPresetID}
                    handleTQChange = {this.handleTQChange}
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
                    aa: data.item.album.images[0].url,
                    track: data.item.name,
                    artist: data.item.artists[0].name,
                    album: data.item.album.name,
                    loading: false,
                    current: data.progress_ms,
                    length: data.item.duration_ms,
                    curMin: this.millisToMinutesAndSeconds(data.progress_ms),
                    curLen: this.millisToMinutesAndSeconds(data.item.duration_ms)
                  })
                })
              } else if (response.status === 401) {
                console.log("access token is bad, getting new one...")
                this.props.getAccessToken(this.getCurrentPlaybackInfo)
              }
            })
          }, 0)
      }

      millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        if (seconds == 60) {
          minutes = minutes + 1
          seconds = 0
        }
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
      }
}

export default NowPlaying