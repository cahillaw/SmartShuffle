import React, { useState } from 'react'
import './stationListening.css'
import Next from '../images/nextsong.png'
import { Button, Form, Alert } from 'react-bootstrap'

class StationListening extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            paused: !this.props.listening,
            numQueue: 1
        }
    }

    render = () => {
        const handleSkip = () => {
          this.props.skipSong();
          setTimeout(() => {
            this.props.getCurrentPlaybackInfo()
          }, 1000)
        }

        const handlePause = () => {
          this.props.pause();
          this.setState({
            paused: true
          })
        }

        const handlePlay = () => {
          this.props.play();
          this.setState({
            paused: false
          })
        }

        const handleStopListening = () => {
          this.props.stopListening();
        }

        const handleQueueSongs = () => {
          if (this.state.numQueue > 5 || this.state.numQueue < 0) {
            alert("Number of songs to queue must be an integer between 0 and 10")
          } else if (parseInt(this.state.numQueue) !== parseFloat(this.state.numQueue)) {
            alert("Number of songs to queue must be an integer between 0 and 10")
          } else {
            console.log("ok")
            for(var i = 0; i<this.state.numQueue; i++) {
                setTimeout(() => {
                  this.props.queueSong(this.props.curPresetID)
                }, i*1000)
            }
          } 
        }
    
        const handleQueueChange = (event) => {
          console.log(event.target.value)
          this.setState({
              numQueue: event.target.value
          })
        }

        if(this.props.curPresetName === "") {
          return (
            <div>
              <strong>No Current Station</strong>
                <br></br>
                <br></br> {
                  !this.state.paused ? 
                  <div id = "controls">
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
                {
                  !this.state.paused ? 
                  <div id = "controls">
                    <Button id = "pause" variant= "dark" size= "sm" onClick={handlePause}>Pause</Button>{' '}
                    <Button id = "skip" variant= "dark" size= "sm"><img id ="nextsong" src={Next} onClick={handleSkip} alt ="Next Song" /></Button>{' '}
                  </div>
                  : <div>
                    <Button id = "play" variant= "dark" size= "sm" onClick={handlePlay}>Play</Button>{' '}
                    <Button id = "skip" variant= "dark" size= "sm"><img id ="nextsong" src={Next} onClick={handleSkip} alt ="Next Song" /></Button>{' '}
                  </div>
                }
                <br></br>
                    <Button id = "queuesongs" variant= "dark" size= "sm" onClick={handleQueueSongs}>Queue Songs</Button>{' '}
                    <Form.Control id = "qs" type="number" size= "sm" defaultValue={this.state.numQueue} min = "1" max = "5" onChange={handleQueueChange}/>
                <br></br>
                <br></br>
                <Button id = "stoplistening" variant= "dark" size= "sm" onClick={handleStopListening}>Stop Listening</Button>{' '}
            </div>
          )
        }
    }

}

export default StationListening