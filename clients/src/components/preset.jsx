import React, { useState } from 'react'
import './preset.css'
import { Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap'
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
        listening: false
      }
    }

    componentDidMount () {
      console.log("loaded")
     // console.log(process.env.REACT_APP_SPOTIFY_CLIENT_ID)
     // console.log(process.env.REACT_APP_SPOTIFY_CLIENT_SECRET)
    }

    render = () => {
      const ErrorAlert = () => {
        if(!this.props.listening) {
          return (
            <Alert variant="danger">
              <Alert.Heading>Cannot find Spotify Session</Alert.Heading>
                <div>
                  Start listening to something on Spotify to resolve this issue.
                </div>
            </Alert>
          )
        } else {
          return null
        }
      }

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

      const EditWeightsModal = (props) => {
        var pls = props.data.playlists
        const [show, setShow] = useState(false);
        const [weights, setWeight] = useState(pls);

        const playlists = pls.map((pl, i) => 
        <div key={pl.playlistID}> 
          <Row id = "ewrow">
            <Col>
            <strong>{pl.playlistName}</strong>
              <Form.Control key = {i} id = "wbox" type="number" size="sm" defaultValue={pl.weight} 
              onChange={e => {
                weights[i].weight = parseInt(e.target.value, 10)
                setWeight(...[weights])
                console.log(weights)
              }}/>
            </Col>
          </Row>
        </div>
        );

        const handleShow = () => {
          setShow(!show)
        } 

        const handleClose = () => {
          setShow(!show);
        }

        const handleSubmit = () => {
          var ps = this.props.data
          ps.playlists = weights
          console.log(ps)
          props.editWeights(ps)
          setShow(false);
        }

        return (
          <>
            <Button id = "weights" variant= "dark" size= "sm" onClick={handleShow}>Edit Playlist Weights</Button>{' '}
      
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Modify Playlist Weights</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {playlists}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="dark" onClick={handleSubmit}>
                  Update
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        );
      }

      const StartShuffleModal = (props) => {

        const [show, setShow] = useState(false);
        const [numQueue, setQueue] = useState(5);
        const [interval, setInterval] = useState(3);

        const handleClose = () => {
          setShow(!show);
        }

        const handleSubmit = () => {
          setShow(false);
     //     props.changeInModal();
          props.startShuffling(this.props.data.presetId, this.props.data.presetName, numQueue, interval);
        }

        const handleShow = () => {
          setShow(!show)
        } 

        const handleQueueChange = (event) => {
          setQueue(event.target.value)
        }

        const handleIntervalChange = (event) => {
          setInterval(event.target.value)
        }        

        return (
          <>
            <Button id = "button" variant= "dark" size= "sm" onClick={handleShow} >Start Shuffling!</Button>{' '}
      
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Start {this.props.data.presetName}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ErrorAlert></ErrorAlert>
                <Form.Group controlId="startcontrols">
                  <Form.Label><strong>Queue Songs on Startup</strong></Form.Label>
                  <Form.Control type="number" size="sm" min="0" max ="10" placeholder="5" defaultValue="5" onChange={handleQueueChange}/>
                  <Form.Text>
                    The more songs you queue, the more you can skip without running out of songs in queue. If you skip songs using the in-site skip button, a song will be queued automatically so the number you intially queue doesn't matter as much.
                  </Form.Text>
                  <br></br>
                  <Form.Label><strong>Queue Interval</strong></Form.Label>
                  <Form.Control type="number" size="sm" min="2" max ="60" placeholder="3" defaultValue="3" onChange={handleIntervalChange}/>
                  <Form.Text>
                      SmartShuffle will automatically queue a new song every X minutes. For seamless listening, select a value close to the average song length of songs in the station.
                  </Form.Text>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="dark" onClick={handleSubmit} disabled = {!this.props.listening}>
                  Start Shuffling!
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
            <div id = "pname"> {this.props.data.presetName} </div>
            <StartShuffleModal 
              startShuffling = {this.props.startShuffling}>
            </StartShuffleModal>
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
              <EditWeightsModal
                data = {this.props.data}
                editWeights = {this.editWeights}
              />
              <DeletePreset clickDelete={this.clickDelete}></DeletePreset>
              <Button id = "editbutton" variant= "dark" size= "sm" onClick={() => this.clickEdit()}>Edit Station</Button>{' '}
            </div>
          </div>
        )
    }

    clickShuffle = () => {
      console.log("clicked")
      this.props.startShuffling(this.props.data.presetId, this.props.data.presetName);
    }

    clickDelete = () => {
      this.deletePreset();
    }

    clickEdit = () => {
      this.setState({
        edit: !this.state.edit
      })
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

    editWeights = (pldata) => {
      setTimeout(() => {
        var url = "https://shuffle.cahillaw.me/v1/updateplaylists/" + this.props.data.presetId
        fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.props.access_token 
          }
        })
        .then((response) => {
          if (response.status === 200) {
            response.json().then((data) => {
              this.props.editPlaylists(data)
            })
          } else if (response.status === 401) {
            console.log("access token is bad, getting new one...")
            this.props.getAccessToken(this.deletePreset)
          }
        })
      }, 0)
    }
    
}

export default Preset