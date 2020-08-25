import React, { useState } from 'react'
import './preset.css'
import { Button, Modal } from 'react-bootstrap'
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
        test: true
      }
    }

    componentDidMount () {
      console.log("loaded")
     // console.log(process.env.REACT_APP_SPOTIFY_CLIENT_ID)
     // console.log(process.env.REACT_APP_SPOTIFY_CLIENT_SECRET)
    }

    render = () => {
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
          />
        )
      }

        return (
          <div id = "preset">
            <strong id = "pname"> {this.props.data.presetName} </strong>
            <Button id = "button" variant= "dark" size= "sm" onClick={() => this.queueSong()} >Queue Song!</Button>{' '}
            <div id = "rlimit"> Repeat Limit: {this.props.data.repeatLimit} </div>
            <div id = "playlists">
              {playlists}
              <NewPlaylist
                access_token = {this.props.access_token}
                refresh_token = {this.props.refresh_token}
                data = {this.props.data}
                getUserPageInfo = {this.props.getUserPageInfo}
                addNewPlaylist = {this.props.addNewPlaylist}
               />
            </div>
            <div>
              <DeletePreset clickDelete={this.clickDelete} test="3"></DeletePreset>
              <Button id = "editbutton" variant= "dark" size= "sm" onClick={() => this.clickEdit()}>Edit Station</Button>{' '}
            </div>
          </div>
        )
    }

    clickDelete = () => {
      this.deletePreset();
    }

    clickEdit = () => {
      this.setState({
        edit: !this.state.edit
      })
    }
    
    queueSong = () => {
      /*
      if (this.state.test) {
        var auth = "somethingwrongobv"
        this.setState({
          test: false
        })
      } else {
        var auth = this.props.access_token
      }
      */

     // console.log(auth)
      var url = "https://shuffle.cahillaw.me/v1/queue/" + this.props.data.presetId
      fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.props.access_token
        }
      })
      .then((response) => {
        if (response.status === 204) {
          console.log("Song Queued!")
        } else if (response.status === 401) {
          console.log("access token is bad, getting new one...")
          this.props.getAccessToken(this.queueSong)
        }
      })
    }

    deletePreset = () => { 
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
        } else {
          console.log("failed to delete")
        }
      })
    }
    
}

export default Preset