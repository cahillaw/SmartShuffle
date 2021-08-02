import React from 'react'
import './editPlaylist.css'
import { Button, Form, Alert} from 'react-bootstrap'
import { serverBase } from '../misc/constants'

class EditPlaylist extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        isChecked: true,
        name: '',
        uri: '',
        order: true,
        numTracks: -1,
        weight: 0,
        showError: false,
        errorMessage: '',
      }
    }

    componentDidMount () {
        this.setState({
            isChecked: this.props.data.NumTracks <= 0,
            name: this.props.data.playlistName,
            uri: this.props.data.uri,
            order: this.props.data.order,
            numTracks: this.props.data.NumTracks,
            weight: this.props.data.weight
        })
    }

    render = () => {
      const ErrorAlert = () => {
        if(this.state.showError === true) {
          return (
            <Alert id = "epalerterror" variant="danger" onClose={() => this.removeAlert()} dismissible>
              {this.state.errorMessage}
            </Alert>
          )
        } else {
          return <br></br>
        }
      }

      const { isChecked } = this.state;
      return (
        <Form>
          <Form.Group controlId="plname">
            <Form.Label>
              <strong>Playlist Name</strong></Form.Label>
            <Form.Control type="name" size="sm" placeholder="All-Time Favorites" defaultValue={this.props.data.playlistName} onChange={this.handleNameChange}/>
          </Form.Group>
          <Form.Group controlId="plname">
            <Form.Label>
              <strong>Spotify Playlist URI</strong></Form.Label>
            <Form.Control type="name" size="sm" placeholder="spotify:playlist:37i9dQZF1DX1helbHcrYM1" defaultValue={this.props.data.uri} onChange={this.handleURIChange}/>
          </Form.Group>
          
          <Form.Group id="formGridCheckbox">
            <Form.Check type="checkbox" label="Use all tracks in playlist?" checked={this.state.isChecked}
            onChange={this.toggleChange}/> {
              !isChecked
              ? <div>
              <br></br>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label><strong>Playlist Order</strong></Form.Label>
                <Form.Control as="select" defaultValue={
                    this.props.data.order ? 1 : 0 }
                    onChange={this.handleOrderChange}>
                    <option value = "1">First</option>
                    <option value = "0">Last</option>
                </Form.Control>
              </Form.Group>
            <Form.Group controlId="pluri">
              <Form.Label><strong>Number of Tracks</strong></Form.Label>
              <Form.Control type="number" size="sm" min="0" max = "10000" placeholder="20" defaultValue={this.props.data.NumTracks >=0 ? this.props.data.NumTracks : ""} onChange={this.handleNumTracksChange}/>
              <Form.Text>
              Number of tracks from the playlist. The tracks selected depend on the order of the playlist, if First is selected, only the first X songs will be selected, where if Last is selected, the bottom X songs will be selected.
              </Form.Text>
            </Form.Group>
            </div>
            : null
          }
          </Form.Group>

          <Form.Group controlId="pluri">
            <Form.Label><strong>Playlist Weight</strong></Form.Label>
            <Form.Control type="number" size="sm" min="0" max ="100" placeholder="20" defaultValue={this.props.data.weight} onChange={this.handleWeightChange}/>
            <Form.Text>
              A playlist weight is the chance a song from that playlist will be queued when a song is queued. You can easily adjust all playlist weights at the same time using the edit weights button.
            </Form.Text>
          </Form.Group>
          <ErrorAlert></ErrorAlert>
          <div id="editplbuttons">
            <Button id = "update" variant= "dark" size= "sm" onClick={() => this.clickSubmitHandler()}>Update!</Button>{' '}
            <Button id = "eplaycancel" variant= "dark" size= "sm" onClick={() => this.props.clickEditPL()}>Cancel</Button>{' '}
          </div>
        </Form>
      )
    }
  
    removeAlert() {
      this.setState({
          showError: false
      })
    }

    toggleChange = () => {
      this.setState({
        isChecked: !this.state.isChecked,
      });
    }
  
    handleNameChange = (event) => {
      this.setState({
        name: event.target.value
      })
    }
  
    handleURIChange = (event) => {
      var euri = event.target.value
      euri = euri.replace("spotify:playlist:", "")
      euri = euri.replace("https://open.spotify.com/playlist/", "")
      var splituri = euri.split("?",2)
      this.setState({
          uri: splituri[0]
      })
    }

    handleOrderChange = (event) => {
      if(event.target.value === "1") {
        this.setState({
          order: true
        })
      } else {
        this.setState({
          order: false
        })
      }
    }

    handleNumTracksChange = (event) => {
      this.setState({
          numTracks: event.target.value
      })
    }

    handleWeightChange = (event) => {
      this.setState({
          weight: event.target.value
      })
    } 

    clickSubmitHandler() {
      if(!this.state.name || this.state.name.length > 50) {
        this.setState({
          errorMessage: "Error: Empty playlist name or name over 50 characters",
          showError: true
        })
      } else if (this.state.uri === '') {
        this.setState({
          errorMessage: "Error: Empty URI",
          showError: true
        })
      } else if (this.state.order === '') {
        this.setState({
          errorMessage: "Error: Please select a playlist order",
          showError: true
        })
      } else if ((this.state.numTracks < 1 && !this.state.isChecked) || this.state.numTracks > 1000) {
        this.setState({
          errorMessage: "Number of tracks must be between 1 and 10,000",
          showError: true
        })
      } else if(this.state.weight < 0 || this.state.weight > 100) {
        this.setState({
          errorMessage: "Error: Weight must be an integer between 0 and 100",
          showError: true
        })
      } else if (parseInt(this.state.weight) !== parseFloat(this.state.weight)) {
        this.setState({
          errorMessage: "Error: Weight must be an integer",
          showError: true
        })
      } else {
        var url = "https://api.spotify.com/v1/playlists/" + this.state.uri
        fetch(url, {
          method: 'get',
          headers: {
            'Authorization': this.props.access_token
          }
        })
        .then((res) => {
          if(res.status >= 400) {
            this.setState({
              errorMessage: "Error: Invalid Spotify Playlist URI",
              showError: true
            })
          } else {
            this.editPlaylist();
          }
        })
      }
    }

    editPlaylist = () => {
      setTimeout(() => {
        var url = serverBase + "/v1/playlists/" + this.props.data.playlistID
        var nT = parseInt(this.state.numTracks, 10)
        var w = parseInt(this.state.weight, 10)
        if(this.state.isChecked) {
          nT = -1
        }
        fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.props.access_token 
          },
          body: JSON.stringify({
            presetID: this.props.data.presetID,
            playlistName: this.state.name,
            uri: this.state.uri,
            NumTracks: nT,
            order: this.state.order,
            weight: w
          })
        })
        .then((response) => {
          if (response.status === 200) {
            response.json().then((data) => {
              this.props.editPlaylist(this.props.data.presetID, data)
              this.setState({
                isChecked: nT > 0,
                name: this.state.name,
                uri: this.state.uri,
                order: this.state.order,
                numTracks: nT,
                weight: w,
                showError: false,
                errorMessage: ''
              })
              this.props.clickEditPL()
              this.props.getPlaylistImageAndNumTracks()
            })
          } else if (response.status === 401) {
            this.props.getAccessToken(this.editPlaylist)
          }
        })
      }, 0)
      
    }

}

export default EditPlaylist