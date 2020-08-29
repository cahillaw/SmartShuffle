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
        listening: false
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
            <strong id = "pname"> {this.props.data.presetName} </strong>
            <Button id = "button" variant= "dark" size= "sm" onClick={() => this.clickShuffle()} >Start Shuffling!</Button>{' '}
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
    
}

export default Preset