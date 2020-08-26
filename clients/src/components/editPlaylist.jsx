import React from 'react'
import './editPlaylist.css'
import { Button, Form, Alert} from 'react-bootstrap'

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
            name: this.props.data.presetName,
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
            <Alert variant="danger" onClose={() => this.removeAlert()} dismissible>
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
                    <option value = "1">First Added</option>
                    <option value = "0">Recently Added</option>
                </Form.Control>
              </Form.Group>
            <Form.Group controlId="pluri">
              <Form.Label><strong>Number of Tracks</strong></Form.Label>
              <Form.Control type="number" size="sm" min="0" placeholder="20" defaultValue={this.props.data.NumTracks} onChange={this.handleNumTracksChange}/>
              <Form.Text>
              Number of tracks from the playlist. The tracks selected depend on the order of the playlist, if First Added is selected, only the first X songs will be selected, where if Recently Added is selected, the most recently added X songs will be selected.
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
                Weight is the percentage amount that a track from this playlist will be selected. The total weight of all playlists in a given station must be less than or equal to 100. If the weight you want to add exceeds 100, set a temporary value now and go back and edit those first.
            </Form.Text>
          </Form.Group>
          <ErrorAlert></ErrorAlert>
          <Button id = "update" variant= "dark" size= "sm" onClick={() => this.clickSubmitHandler()}>Update Playlist!</Button>{' '}
          <Button id = "cancel" variant= "dark" size= "sm" onClick={() => this.props.clickEditPL()}>Cancel</Button>{' '}
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
      if(event.target.value === "First Added") {
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
      var valid = true
      if(this.state.name === '' ) {
        valid = false
        this.setState({
          errorMessage: "Error: Empty playlist name"
        })
      } else if (this.state.uri === '') {
        valid = false
        this.setState({
          errorMessage: "Error: Empty URI"
        })
      } else if (this.state.order === '') {
        valid = false
        this.setState({
          errorMessage: "Error: Please select a playlist order"
        })
      } else if(this.state.weight <= 0 || this.state.weight >= 100) {
        valid = false
        this.setState({
          errorMessage: "Error: Weight must be an integer between 0 and 100"
        })
      } else if (this.state.weight != Math.floor(this.state.weight)) {
        valid = false
        this.setState({
          errorMessage: "Error: Weight must be an integer"
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
          if(res.status >= 400 || !valid) {
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
        var url = "https://shuffle.cahillaw.me/v1/playlists/" + this.props.data.playlistID
        var nT = parseInt(this.state.numTracks, 10)
        var w = parseInt(this.state.weight, 10)
        fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.props.access_token 
          },
          body: JSON.stringify({
            presetID: this.props.data.presetId,
            playlistName: this.state.name,
            uri: this.state.uri,
            NumTracks: nT,
            order: this.state.order,
            weight: w
          })
        })
        .then((response) => {
          response.json().then((data) => {
            if (response.status === 200) {
              console.log(data)
              this.props.editPlaylist(this.props.data.presetID, data)
              this.props.clickEditPL()
              this.setState({
                isChecked: true,
                name: '',
                uri: '',
                order: true,
                numTracks: -1,
                weight: 0,
                showError: false,
                errorMessage: ''
              })
            } else if (response.status === 401) {
              console.log("access token is bad, getting new one...")
              this.props.getAccessToken(this.editPlaylist)
            }
          })
        })
      }, 0)
      
    }

}

export default EditPlaylist