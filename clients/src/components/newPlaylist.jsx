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
        weight: 20,
        showError: false,
        errorMessage: '',
        isToggled: false,
        bodyOpen: false
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
              <Button id = "openbody" variant= "dark" size= "sm" onClick={this.openBody}>Add New Playlist</Button> 
              </Card.Header>
              {
               this.state.bodyOpen ?
               <Card.Body>
               <Form>
                 <Form.Group>
                   <Form.Label>
                     <strong>Playlist Name</strong>
                   </Form.Label>
                   <Form.Control type="name" size="sm" placeholder="All-Time Favorites" onChange={this.handleNameChange}/>
                 </Form.Group>
                 <Form.Group>
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
                     <Form.Group>
                     <Form.Label><strong>Playlist Order</strong></Form.Label>
                       <Form.Control as="select" onChange={this.handleOrderChange}>
                         <option>First Added</option>
                         <option>Recently Added</option>
                       </Form.Control>
                     </Form.Group>
                     <Form.Group>
                     <Form.Label><strong>Number of Tracks</strong></Form.Label>
                       <Form.Control type="number" size="sm" min="0" max = "10000" placeholder="20" onChange={this.handleNumTracksChange}/>
                       <Form.Text>
                         Number of tracks from the playlist. The tracks selected depend on the order of the playlist, if First Added is selected, only the first X songs will be selected, where if Recently Added is selected, the most recently added X songs will be selected.
                       </Form.Text>
                     </Form.Group>
                     </div>
                     : null
                   }
                 </Form.Group>
 
                 <Form.Group>
                   <Form.Label><strong>Playlist Weight</strong></Form.Label>
                   <Form.Control type="number" size="sm" min="0" max ="100" defaultValue= "20" onChange={this.handleWeightChange}/>
                   <Form.Text>
                     A playlist weight is the chance a song from that playlist will be queued when a song is queued. You can easily adjust all playlist weights at the same time using the edit weights button.
                   </Form.Text>
                 </Form.Group>
                 <ErrorAlert></ErrorAlert>
                 <Button id = "submitbody" variant="dark" size="sm" onClick={() => this.clickSubmitHandler()}>Add Playlist</Button>
                 <Button id = "cancelnp" variant="dark" size="sm" onClick={this.openBody}>Cancel</Button> 
               </Form>
               </Card.Body>
               : null
              }
            </Card>
          </Accordion>
        )
    }

    openBody = () => {
      this.setState({
        bodyOpen: !this.state.bodyOpen
      });
    }

    removeAlert() {
      this.setState({
        showError: false
      })
    }
    
    toggleAccord = () => {
      this.setState({ isToggled: !this.state.isToggled})
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
            this.toggleAccord();
            this.createNewPlaylist();
          }
        })
      }
    }

    createNewPlaylist = () => {
      setTimeout(() => {
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
          if (response.status === 201) {
            response.json().then((data) => {
              this.props.addNewPlaylist(data, this.props.data.presetId)
              this.setState({
                isChecked: true,
                name: '',
                uri: '',
                order: true,
                numTracks: -1,
                weight: 0,
                showError: false,
                errorMessage: '',
                isToggled: false,
                bodyOpen: false
              })
            })
          } else if (response.status === 401) {
            this.props.getAccessToken(this.createNewPlaylist)
          }
          
        })
      }, 0)
    }

}

export default NewPlaylist