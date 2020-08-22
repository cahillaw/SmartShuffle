import React from 'react'
import './playlist.css'
import { Button, Card, Accordion, Spinner } from 'react-bootstrap'
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
                <Button id = "deletebuttonpl" variant= "dark" size= "sm" onClick={() => this.clickDeletePL()}>Delete Playlist</Button>{' '}
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

    clickDeletePL() {
      this.deletePlaylist();
      setTimeout(() => {
        this.props.getUserPageInfo()
        }, 200);
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
          console.log("deleted")
        } else {
          console.log("failed to delete")
        }
      })
    }

    getPlaylistImageAndNumTracks() {
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