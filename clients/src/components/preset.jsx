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
        edit: false
      }
    }

    componentDidMount () {
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
      setTimeout(() => {
        this.props.getUserPageInfo()
        }, 200);
    }

    clickAddPlaylist() {
      setTimeout(() => {
        this.props.getUserPageInfo()
        }, 500);
    }

    clickEdit = () => {
      this.setState({
        edit: !this.state.edit
      })
    }

    queueSong = () => {
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
        } else {
          console.log("failed to queue song")
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
        } else {
          console.log("failed to delete")
        }
      })
    }
      
    getAccessToken(refresh_token) {
      var client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID
      var client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET

      fetch('https://accounts.spotify.com/api/token', {
        method: 'post',
        headers: {
          'Content-Type': "application/x-www-form-urlencoded",
          "Authorization": "Basic " + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: refresh_token
        })
      })
      .then((response) => {
        response.json().then((data) => {
          if (response.status === 200) {
            return  "Bearer " + data.access_token
          } else {
            return "no work :("
          }
        })
      })
    }

}

export default Preset