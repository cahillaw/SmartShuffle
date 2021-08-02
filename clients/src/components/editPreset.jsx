import React from 'react'
import './editPreset.css'
import { Button, Container, Row, Col, Form, Alert} from 'react-bootstrap'
import { serverBase } from '../misc/constants'

class EditPreset extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        clicked: false,
        repeatLimit: this.props.repeatLimit,
        name: this.props.name,
        showError: false
      }
    }

    render = () => {
      const ErrorAlert = () => {
        if(this.state.showError === true) {
          return (
            <Alert variant="danger" onClose={() => this.removeAlert()} dismissible>
              Invalid input. Repeat limit must be between 0 and 50.
            </Alert>
          )
        } else {
          return <br></br>
        }
      }

      return (
        <div id="createForm">
          <Container>
            <Row>
              <Col>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>
                      <strong>Station Name</strong></Form.Label>
                    <Form.Control type="name" defaultValue={this.props.name} placeholder="SmartShuffle Radio" onChange={this.handleNameChange}/>
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label><strong>Repeat Limit</strong></Form.Label>
                    <Form.Control type="number" min="0" max ="50" placeholder="20" defaultValue={this.props.repeatLimit} onChange={this.handleRepeatLimitChange}/>
                    <Form.Text id = "ft">
                    Repeat Limit is the number of tracks in between two plays of the same song. For example, if the Repeat Limit was 20 and you just heard a song, you would not hear it for another 20 songs. Choose 0 for no repeat limit.
                    </Form.Text>
                  </Form.Group>
                  <Button id = "epcbutton" variant= "dark" size= "sm" onClick={() => this.clickSubmitHandler()}>Update</Button>{' '}
                  <Button id = "epcancel" variant= "dark" size= "sm" onClick={() => this.props.clickEdit()}>Cancel</Button>{' '}
                </Form>
                <ErrorAlert></ErrorAlert>
              </Col>
            </Row>
          </Container>
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
        clicked: true
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
      if(this.state.name !== '' && (this.state.repeatLimit >= 0 && this.state.repeatLimit <= 50) ) {
        this.editNewPreset();
      } else {
        this.setState({
          showError: true
        })
      }
    }

    editNewPreset = () => {
      setTimeout(() => {
        var url = serverBase + "/v1/presets/" + this.props.data.presetId
        var rl = parseInt(this.state.repeatLimit, 10)
        fetch(url, {
          method: 'PATCH',
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
          if (response.status === 200) {
            response.json().then((data) => {
              this.props.editPreset(data)
              this.props.clickEdit()
            })
          } else if (response.status === 401) {
            this.props.getAccessToken(this.editNewPreset)
          }
        })
      }, 0)
    }

}

export default EditPreset