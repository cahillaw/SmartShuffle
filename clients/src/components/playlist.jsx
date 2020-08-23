import React, { useState } from 'react'
import './playlist.css'
import { Button, Card, Accordion, Spinner, Modal } from 'react-bootstrap'
import EditPlaylist from './editPlaylist'

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
            <Button id = "deletebuttonpl" variant= "dark" size= "sm" onClick={handleShow}>Delete playlist</Button>{' '}
      
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
                  Delete Playlist
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
            <Accordion.Toggle as={Button} variant="link" eventKey="0" >
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
              <div>
                <DeletePlaylist clickDeletePL={this.clickDeletePL}></DeletePlaylist>
                <Button id = "editbuttonpl" variant= "dark" size= "sm" onClick={this.clickEditPL}>Edit Playlist</Button> {
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
      var url = "https://shuffle.cahillaw.me/v1/playlists/" + this.props.data.playlistID
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
          console.log("deleted")
        } else {
          console.log("failed to delete")
        }
      })
    }

    getPlaylistImageAndNumTracks() {
      console.log("redid call")
      var url = "https://api.spotify.com/v1/playlists/" + this.props.data.uri
      fetch(url, {
        method: 'get',
        headers: {
          'Authorization': this.props.access_token
        }
      })
      .then((res) => {
        res.json().then((pladata) => {
            this.setState({
              mosaic: pladata.images[0].url,
              totalTracks: pladata.tracks.total,
              loading: false
            })
        })
      })
    }

    checkOrder() {
      if(this.props.data.order && this.props.data.NumTracks < 0) {
          return "N/A"
      } else if (this.props.data.order) {
        return "First Added"
      }
      return "Recently Added"
    }

    checkSign() {
        if(this.props.data.NumTracks < 0) {
            return this.state.totalTracks
        } 
        return this.props.data.NumTracks
    }

}

export default Playlist