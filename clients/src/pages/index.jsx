import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'


class LoginPage extends React.Component {
    constructor (props) {
      super(props)
  
      this.state = {

      }
    }

    render = () => {
      return (
        <div id = "base">
          <Row id = "row1" className="align-items-center">
            <Col>
              <h1 id = "ltitle">SmartShuffle.io</h1>
              <h5 id = "catch">Shuffling like you have never seen it before</h5>
              <div id = "premreq">Spotify Premium Required</div>
              <div id = "centered">
                <Button id = "loginbutton" variant= "dark" size= "sm" href="https://shuffle.cahillaw.me/login">Login With Spotify</Button>{' '}
              </div>
            </Col>
          </Row>
        </div>
      )
    }

  }
  
  export default LoginPage