import React from 'react'
import './newPlaylist.css'
import { Button, Card, Accordion, Form, Alert } from 'react-bootstrap'

class NewPlaylist extends React.Component {
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
        errorMessage: ''
      }
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
          return null;
        }
      }

      const { isChecked } = this.state;
        return (
          <Accordion id ="newPlaylist">
            <Card>
              <Card.Header id="header">
              <Accordion.Toggle id="toggle" as={Button}  variant= "dark" size= "sm" eventKey="0" >
                  Add New Playlist
              </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
              <Card.Body>
              <Form>
                <Form.Group controlId="plname">
                  <Form.Label>
                    <strong>Playlist Name</strong>
                  </Form.Label>
                  <Form.Control type="name" size="sm" placeholder="All-Time Favorites" onChange={this.handleNameChange}/>
                </Form.Group>
                <Form.Group controlId="plname">
                  <Form.Label>
                    <strong>Spotify Playlist URI</strong>
                  </Form.Label>
                  <Form.Control type="name" size="sm" placeholder="spotify:playlist:37i9dQZF1DX1helbHcrYM1" onChange={this.handleURIChange}/>
                </Form.Group>
                
                <Form.Group id="formGridCheckbox">
                  <Form.Check type="checkbox" label="Use all tracks in playlist?" checked={this.state.isChecked}
                  onChange={this.toggleChange}/> {
                    !isChecked
                    ? <div>
                      <br></br>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label><strong>Playlist Order</strong></Form.Label>
                      <Form.Control as="select" onChange={this.handleOrderChange}>
                        <option>First Added</option>
                        <option>Recently Added</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="pluri">
                    <Form.Label><strong>Number of Tracks</strong></Form.Label>
                      <Form.Control type="number" size="sm" min="0" placeholder="20" onChange={this.handleNumTracksChange}/>
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
                  <Form.Control type="number" size="sm" min="0" max ="100" placeholder="20" onChange={this.handleWeightChange}/>
                  <Form.Text>
                    Weight is the percentage amount that a track from this playlist will be selected. The total weight of all playlists in a given station must be less than or equal to 100. If the weight you want to add exceeds 100, set a temporary value now and go back and edit those first.
                  </Form.Text>
                </Form.Group>
                <ErrorAlert></ErrorAlert>
                <Button id = "button" variant= "dark" size= "sm" onClick={() => this.clickSubmitHandler()}>Add Playlist!</Button>{' '}
              </Form>
              </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
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
          if(res.status >= 400) {
            this.setState({
              errorMessage: "Error: Invalid Spotify Playlist URI"
            })
            valid = false
          } 
        })
      }
      setTimeout(() => {
        if(!valid){
          this.setState({
            showError: true
          })
        } else {
          this.createNewPlaylist();
          setTimeout(() => {
            this.props.getUserPageInfo()
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
            }, 200);
        }
      }, 200);

      if(!valid){
        this.setState({
          showError: true
        })
      } 
    }

    validateURI = () => {
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
            errorMessage: "Error: Invalid Spotify Playlist URI"
          })
          return false
        } else {
          return true 
        }
      })
    }

    createNewPlaylist = () => {
      var url = "https://shuffle.cahillaw.me/v1/playlists"
      var nT = parseInt(this.state.numTracks, 10)
      var w = parseInt(this.state.weight, 10)
      fetch(url, {
        method: 'post',
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
          if (response.status === 201) {
            console.log(data)
          } else {
            console.log("non 200 status code")
          }
        })
      })
    }

}

export default NewPlaylist