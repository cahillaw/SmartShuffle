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
        listening: false,
        presetTotalTracks: 0,
        totalTracksMap: new Map(),
        presetAvgLength: 0,
        lengthsMap: new Map()
      }
    }

    componentDidMount() {
      setTimeout(()=> {
        //this.calculateAvgLength()
      }, 1000)
    }

    render = () => {
      const ErrorAlert = () => {
        if(!this.props.isPremium) {
          return (
            <Alert variant="danger">
              <Alert.Heading>You do not have Spotify Premium</Alert.Heading>
                <div>
                  You cannot start a station without premium.
                </div>
            </Alert>
          )
        } else if (!this.props.listening) {
          return (
            <Alert variant="danger">
              <Alert.Heading>Cannot find Spotify Session</Alert.Heading>
                <div>
                  Start listening to something on Spotify to resolve this issue.
                </div>
            </Alert>
          )
        } else if (this.state.presetTotalTracks < this.props.data.repeatLimit*3) {
          return (
            <Alert variant="danger">
              <Alert.Heading>Bad Station Composition</Alert.Heading>
                <div>
                  You must have at least 3 times as many tracks in the station as the repeat limit. 
                  <br></br>
                  Current total: {this.state.presetTotalTracks} 
                  <br></br>
                  Current repeat limit: {this.props.data.repeatLimit}
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
            <Button id = "deletebutton" variant= "dark" size= "sm" onClick={handleShow}>Delete</Button>{' '}
      
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
        var pls = JSON.parse(JSON.stringify(props.data.playlists))
        var totalWeight = 0
        
        for(var i = 0; i< pls.length; i++) {
          totalWeight = totalWeight + pls[i].weight
        }
        
        const [show, setShow] = useState(false);
        const [weights, setWeight] = useState(pls);
        const [total, setTotal] = useState(totalWeight);
        const [showError, setError] = useState(false);

        const playlists = pls.map((pl, i) => 
        <div key={pl.playlistID}> 
          <Row id = "ewrow">
            <Col>
            <strong>{pl.playlistName}</strong>
              <Form.Control key = {i} id = "wbox" type="number" min = "0" max = "10000" size="sm" defaultValue={pl.weight} 
              onChange={e => {
                if(e.target.value === "") {
                  weights[i].weight = 0
                } else if(e.target.value < 0) {
                  setError(true)
                  weights[i].weight = 0
                } else if (e.target.value > 10000){
                  setError(true)
                  weights[i].weight = 10000
                } else if(parseInt(e.target.value) !== parseFloat(e.target.value)) {
                  setError(true)
                  weights[i].weight = Math.round(parseFloat(e.target.value))
                } else {
                  weights[i].weight = parseInt(e.target.value)
                }
                setWeight(...[weights])
                var tWC = 0
                for(var j = 0; j< weights.length; j++) {
                  tWC = tWC + weights[j].weight
                }
                setTotal(tWC)
              }}/>
            </Col>
          </Row>
        </div>
        );

        const handleShow = () => {
          setShow(!show)
          pls = JSON.parse(JSON.stringify(props.data.playlists))
          totalWeight = 0
          for(var i = 0; i< pls.length; i++) {
            totalWeight = totalWeight + pls[i].weight
          }
          setWeight(pls)
          setTotal(totalWeight)
        } 

        const handleClose = () => {
          setWeight(props.data.playlists)
          setShow(!show);
        }

        const removeAlert = () => {
          setError(false)
        }

        const handleSubmit = () => {
          var ps = JSON.parse(JSON.stringify(this.props.data))
          ps.playlists = weights
          props.editWeights(ps)
          setShow(false);
        }

        return (
          <>
            <Button id = "weights" variant= "dark" size= "sm" onClick={handleShow}>Edit Weights</Button>{' '}
      
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Modify Playlist Weights</Modal.Title>
              </Modal.Header>
              <Modal.Body id = "eplbody">
                <div id = "wdesc">
                  A playlist weight is the chance a song from that playlist will be queued when a song is queued. If the total weights add to 100, each number will be a percent, however each number is weighted against each other, so it don't have to add up to 100. For example, if you wanted more precision, you could use 1000 instead. It is recomended that your weights add to 100.
                </div>
                <hr></hr>
                {props.data.playlists.length < 1 ? <div>This station has no playlists</div> : playlists}
              </Modal.Body>
              <div>
                <hr></hr>
                <div id = "total">Total</div>
                <div id = "totalnum">{total}</div>
                {showError ? 
                  <Alert id = "ewalert" variant="danger" onClose={removeAlert} dismissible>
                    Each weight must be an integer greater than or equal 0 and less than 10000
                  </Alert>
                  : null
                }
              </div>
              <Modal.Footer>
                <Button id = "margin" variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button id = "margin" variant="dark" onClick={handleSubmit} disabled = {props.data.playlists.length < 1}>
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
        const [interval, setInterval] = useState(props.presetAvgLength);
        const [errorMessage, setEM] = useState("")
        const [showError, showErrorMessage] = useState(false)

        const handleClose = () => {
          setShow(!show);
          showErrorMessage(false)
        }

        const handleSubmit = () => {
          if (numQueue > 10 || numQueue < 0) {
            setEM("Number of songs to queue must be an integer between 0 and 10")
            showErrorMessage(true)
          } else if (parseInt(numQueue) !== parseFloat(numQueue)){
            setEM("Number of songs to queue must be an integer")
            showErrorMessage(true)
          } else if(interval < 2) {
            setEM("Queue interval must be no less than 2 minutes")
            showErrorMessage(true)
          } else {
            setShow(false);
            props.startShuffling(this.props.data.presetId, this.props.data.presetName, parseInt(numQueue), interval);
          }          
        }

        const handleShow = () => {
          setShow(!show)
        } 

        const handleQueueChange = (event) => {
          setQueue(event.target.value)
        }

        const handleIntervalChange = (event) => {
          setInterval(parseFloat(event.target.value))
        }        

        const removeAlert = () => {
          showErrorMessage(false)
        }

        return (
          <>
            <Button id = "button" variant= "dark" size= "sm" onClick={handleShow} disabled = {this.props.curStation}>Start Shuffling!</Button>{' '}
      
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title id = "sstitle">Start {this.props.data.presetName}</Modal.Title>
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
                  <Form.Control type="number" size="sm" min="2" max ="60" placeholder="3" defaultValue={isNaN(props.presetAvgLength) ? "3" : props.presetAvgLength} step ="1" onChange={handleIntervalChange}/>

                  <Form.Text>
                      {isNaN(props.presetAvgLength) ? <strong>Queue interval auto-detection failed, total station weight is 0.</strong> : <strong>Queue interval auto-detected at {props.presetAvgLength} minutes </strong>}
                      <br></br>
                      SmartShuffle will automatically queue a new song every X minutes. For seamless listening, select a value close to the average track length of tracks in the station. The auto-detected value attempts to do this for you!
                  </Form.Text>
                </Form.Group>
                {showError ? 
                      <Alert variant="danger" onClose={removeAlert} dismissible>
                        {errorMessage}
                      </Alert>
                      : null
                }
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="dark" onClick={handleSubmit} disabled = {!this.props.isPremium || !this.props.listening || this.state.presetTotalTracks < this.props.data.repeatLimit*3 || showError}>
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
          updatePresetTotalTracks = {this.updatePresetTotalTracks}
          updatePlaylistAvgLength = {this.updatePlaylistAvgLength}
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
              startShuffling = {this.props.startShuffling}
              presetAvgLength = {this.state.presetAvgLength}>
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
              <Button id = "editbutton" variant= "dark" size= "sm" onClick={() => this.clickEdit()}>Edit</Button>{' '}
            </div>
          </div>
        )
    }

    clickShuffle = () => {
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

    updatePresetTotalTracks = (plid, num) => {
      var map = this.state.totalTracksMap
      map.set(plid, num)
      var sum = 0
      function logMapElements(value) {
        sum = sum + value;
      }
      map.forEach(logMapElements)

      this.setState({
        totalTracksMap: map,
        presetTotalTracks: sum
      })
    }

    updatePlaylistAvgLength = (plid, num) => {
      var map = this.state.lengthsMap
      map.set(plid, num/60000)

      this.calculateAvgLength()
    }

    calculateAvgLength = () => {
      var totalWeight = 0
      var totalLength = 0

      for(var i = 0; i<this.props.data.playlists.length; i++) {
        totalWeight = totalWeight + this.props.data.playlists[i].weight
      }

      var map = this.state.lengthsMap
      for(var j = 0; j<this.props.data.playlists.length; j++) {
        totalLength = totalLength + map.get(this.props.data.playlists[j].playlistID)*this.props.data.playlists[j].weight/totalWeight
      }
      var avg = (totalLength).toFixed(2)

      this.setState({
        presetAvgLength: avg
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
            this.props.deletePreset(this.props.data.presetId)
          } else if (response.status === 401) {
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
          },
          body: JSON.stringify(pldata)
        })
        .then((response) => {
          if (response.status === 200) {
            response.json().then((data) => {
              this.props.editPlaylists(data)
              setTimeout(() =>{
                this.calculateAvgLength()
              },0)
            })
          } else if (response.status === 401) {
            this.props.getAccessToken(this.deletePreset)
          }
        })
      }, 0)
    }
    
}

export default Preset