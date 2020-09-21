import React from 'react'
import { Row, Col, Button, Nav } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'


class LoginPage extends React.Component {
    constructor (props) {
      super(props)
  
      this.state = {
        rt: ""
      }
    }

    componentDidMount() {
      this.setState({
        rt: this.getCookie("refresh_token")
      })
    }

    render = () => {
      if(this.state.rt !== "") {
        return <Redirect to={{
          pathname: '/home',
          state: {
            access_token: this.getCookie("access_token").replace('Bearer ', ''),
            refresh_token: this.getCookie("refresh_token")
          }
        }} />
      }
      return (
        <div id ="loginpagebody">
          <div id = "base">
            <Row className="align-items-center">
              <Col>
                <h1 id = "ltitle">SmartShuffle.io</h1>
                <h5 id = "catch">Shuffling like you have never seen it before</h5>
                <div id = "premreq">Spotify Premium Required</div>
                <div id = "centered">
                  <Button id = "loginbutton" variant= "dark" size= "sm" href="https://smartshuffle.io/login">Login with Spotify</Button>{' '}
                </div>
              </Col>
            </Row>
          </div>
          <div className="footer">
          <Row className="align-items-center">
            <Nav className="mr-auto">
              <Nav.Link id = "footertext" href="/about">About</Nav.Link>
              <Nav.Link id = "footertext" href="/about#privacy">Privacy</Nav.Link>
              <Nav.Link id = "footertext" href="/about#contact">Contact Us</Nav.Link>
            </Nav>
          </Row>
          </div>
        </div>
      )
    }

    getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "" 
    }

  }
  
  export default LoginPage