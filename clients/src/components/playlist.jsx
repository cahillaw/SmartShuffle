import React, { useState } from 'react'
import './playlist.css'
import { Button, Card, Accordion, Spinner, Modal } from 'react-bootstrap'
import EditPlaylist from './editPlaylist'
import { serverBase } from '../misc/constants'

class Playlist extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        order: '',
        mosaic: '',
        loading: true,
        totalTracks: 0,
        edit: false
      }
    }

    componentDidMount () {
      this.getPlaylistImageAndNumTracks();
    }

    render = () => {
      function DeletePlaylist(props) {
        const [show, setShow] = useState(false);
      
        const handleClose = () => {
          setShow(false);
        }

        const handleDelete = () => {
          setShow(false);
          props.clickDeletePL();
        }
        const handleShow = () => setShow(true);

        return (
          <>
            <Button id = "deletebuttonpl" variant= "dark" size= "sm" onClick={handleShow}>Delete</Button>{' '}
      
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Delete Playlist</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to delete this playlist?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="dark" onClick={handleDelete}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        );
      }

      const { edit } = this.state;
      return (
        <Accordion id = "playlist">
          <Card>
            <Card.Header id="header">
              {this.state.loading ? <Spinner id="spinner" animation = "border"/> : <img id ="mosaic" src={this.state.mosaic} alt="mosaic"/>}
            <Accordion.Toggle id = "playlistname" as={Button} variant="link" eventKey="0" >
                {this.props.data.playlistName}
            </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
            <Card.Body>
              Number of Tracks: {this.checkSign()}
              <br></br>
              Order: {this.checkOrder()}
              <br></br>
              Playlist Weight: {this.props.data.weight}
              <div id = "editdropdown">
                <DeletePlaylist clickDeletePL={this.deletePlaylist}></DeletePlaylist>
                <Button id = "editbuttonpl" variant= "dark" size= "sm" onClick={this.clickEditPL}>Edit</Button> {
                  edit ? 
                  <div>
                    <br></br>
                    <hr></hr>
                    <EditPlaylist
                      access_token = {this.props.access_token}
                      refresh_token = {this.props.refresh_token}
                      data = {this.props.data}
                      clickEditPL = {this.clickEditPL}
                      getUserPageInfo = {this.props.getUserPageInfo}
                      editPlaylist = {this.props.editPlaylist}
                      getAccessToken = {this.props.getAccessToken}
                      getPlaylistImageAndNumTracks = {this.getPlaylistImageAndNumTracks}
                    />
                  </div>
                  : null } 
              </div>
            </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      )
    }

    clickDeletePL = () => {
      this.deletePlaylist();
    }

    clickEditPL = () => {
      this.setState({
        edit: !this.state.edit,
      });
    }

    deletePlaylist = () => { 
      setTimeout(() => {
        var url = serverBase + "/v1/playlists/" + this.props.data.playlistID
        fetch(url, {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.props.access_token 
          }
        })
        .then((response) => {
          if (response.status === 200) {
            this.props.deletePlaylist(this.props.data.presetID, this.props.data.playlistID)
            this.props.updatePresetTotalTracks(this.props.data.playlistID, 0)
            this.props.updatePlaylistAvgLength(this.props.data.playlistID, 0)
          } else if (response.status === 401) {
            this.props.getAccessToken(this.deletePlaylist)
          }
        })
      }, 0)
    }

    getPlaylistImageAndNumTracks = () => {
      setTimeout(() => {
        var url = "https://api.spotify.com/v1/playlists/" + this.props.data.uri
        fetch(url, {
          method: 'get',
          headers: {
            'Authorization': this.props.access_token
          }
        })
        .then((response) => {
          if (response.status === 200) {
            response.json().then((pladata) => {
              this.setState({
                mosaic: pladata.images[0].url,
                totalTracks: pladata.tracks.total,
                loading: false
              })

              //for auto-detecting queue interval
              var avgLength = 0
              var totalAvgLength = 0
              if(pladata.tracks.total <= 100) {
                if(this.props.data.NumTracks < 0) {
                  for (var i = 0; i<pladata.tracks.total; i++) {
                    avgLength = avgLength + pladata.tracks.items[i].track.duration_ms
                  }
                  totalAvgLength = avgLength/pladata.tracks.total
                } else {
                  if(this.props.data.order) {
                    for (var j = 0; j<this.props.data.NumTracks; j++) {
                      avgLength = avgLength + pladata.tracks.items[j].track.duration_ms
                    }
                    totalAvgLength = avgLength/this.props.data.NumTracks
                  } else {
                    for (var k = this.props.data.NumTracks - 1; k>=0; k--) {
                      avgLength = avgLength + pladata.tracks.items[k].track.duration_ms
                    }
                    totalAvgLength = avgLength/this.props.data.NumTracks
                  }
                }
              } else {
                for (var l = 0; l<100; l++) {
                  avgLength = avgLength + pladata.tracks.items[l].track.duration_ms
                }
                totalAvgLength = avgLength/100
              }

              this.props.updatePlaylistAvgLength(this.props.data.playlistID, totalAvgLength)
              //end section

              //for bad preset composition
              if(this.props.data.NumTracks < 0 ) {
                this.props.updatePresetTotalTracks(this.props.data.playlistID, pladata.tracks.total)
              } else {
                this.props.updatePresetTotalTracks(this.props.data.playlistID, this.props.data.NumTracks)
              }

            })
          } else if (response.status === 401) {
            this.props.getAccessToken(this.getPlaylistImageAndNumTracks)
          }
        })
      }, 0)
    }

    checkOrder() {
      if(this.props.data.NumTracks <= 0) {
          return "N/A"
      } else if (this.props.data.order) {
        return "First"
      }
      return "Last"
    }

    checkSign() {
        if(this.props.data.NumTracks < 0) {
            return this.state.totalTracks
        } 
        return this.props.data.NumTracks
    }

}

export default Playlist