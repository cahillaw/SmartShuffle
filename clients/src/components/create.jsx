import React from 'react'
import './create.css'
import { Button, Container, Row, Col, Form, Alert} from 'react-bootstrap'

class Create extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        clicked: false,
        repeatLimit: 0,
        name: '',
        showError: false
      }
    }

    render = () => {
      const ErrorAlert = () => {
        if(this.state.showError === true) {
          return (
            <Alert variant="danger" onClose={() => this.removeAlert()} dismissible>
              Invalid input. Station name must be between 1 and 50 characters and the repeat limit must be between 0 and 50.
            </Alert>
          )
        } else {
          return null
        }
      }

      if(this.state.clicked) {
        return (
          <div id="createForm">
            <Container>
               <Row>
                 <Col>
                  <Form>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label>
                        <strong>Station Name</strong></Form.Label>
                      <Form.Control type="name" placeholder="SmartShuffle Radio" onChange={this.handleNameChange}/>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label><strong>Repeat Limit</strong></Form.Label>
                      <Form.Control type="number" min="0" max ="50" placeholder="20" onChange={this.handleRepeatLimitChange}/>
                      <Form.Text id = "ft">
                      Repeat Limit is the number of tracks in between two plays of the same song. For example, if the Repeat Limit was 20 and you just heard a song, you would not hear it for another 20 songs. Choose 0 for no repeat limit.
                      </Form.Text>
                    </Form.Group>
                  </Form>
                  <ErrorAlert></ErrorAlert>
                  <strong>You will add playlists in the next step.</strong>
                </Col>
                </Row>
                <Row>
                  <Col>
                    <Button id = "cancel" variant= "dark" size= "sm" onClick={() => this.clickHandler()}>Cancel</Button>{' '}
                    <Button id = "cbutton" variant= "dark" size= "sm" onClick={() => this.clickSubmitHandler()}>Create Station</Button>{' '}
                  </Col>
                </Row>
            </Container>
          </div>
        )
      }

        return (
            <div id="create">
                <h1>Create a new station?</h1>
                <Button id = "crbutton" variant= "dark" size= "sm" onClick={() => this.clickHandler()}>Get started!</Button>{' '}
            </div>
        )
    }
  
    removeAlert() {
      this.setState({
        showError: false
      })
    }
    
    clickHandler() {
      this.setState({
        clicked: !this.state.clicked
      })
    }

    handleNameChange = (event) => {
      this.setState({
        name: event.target.value
      })
    }

    handleRepeatLimitChange = (event) => {
      this.setState({
        repeatLimit: event.target.value
      })
    }

    clickSubmitHandler() {
      if((this.state.name !== '' && this.state.name.length < 50) && (this.state.repeatLimit >= 0 && this.state.repeatLimit <= 50) ) {
        this.createNewPreset();
      } else {
        this.setState({
          showError: true
        })
      }
    }

    createNewPreset = () => {
      setTimeout(() => {
        var url = "https://shuffle.cahillaw.me/v1/presets"
        var rl = parseInt(this.state.repeatLimit, 10)
        fetch(url, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.props.access_token 
          },
          body: JSON.stringify({
            presetName: this.state.name,
            repeatLimit: rl
          })
        })
        .then((response) => {
          if (response.status === 201) {
            response.json().then((data) => {
              this.props.addNewPreset(data)
              this.setState({
                clicked: false
              })
            })
          } else if (response.status === 401) {
            console.log("access token is bad, getting new one...")
            this.props.getAccessToken(this.createNewPreset)
          }
        })
      }, 0)
    }

}

export default Create