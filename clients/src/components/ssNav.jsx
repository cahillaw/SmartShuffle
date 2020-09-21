import React from 'react'
import Logo from '../images/smartshuflelogo.png'
import { Container, Navbar, Button, Nav } from 'react-bootstrap'
import './ssNav.css'


class SSNav extends React.Component {
    constructor (props) {
      super(props)
  
      this.state = {
        loggedIn: false
      }
    }
    
    componentDidMount() {
      this.setState({
        loggedIn: this.getCookie("refresh_token")
      })
    }

    render = () => {
      return (
        <Navbar expand="xl" className="color-nav" variant="light">
        <Container className = "navcontainer">
          <Navbar.Brand className="extend" href = {this.state.loggedIn ? "/home": "/"}>
              <img
              alt=""
              src={Logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              />{' '}
              <strong>SmartShuffle</strong>
          </Navbar.Brand>
          <Nav className="mr-auto">
              <Nav.Link href="/about">About</Nav.Link>
          </Nav>{
            this.state.loggedIn ?
          <Button id = "logout" variant= "dark" size= "sm" onClick={() => this.logOut()}>Logout</Button> : 
          <Button id = "logout" variant= "dark" size= "sm" href="https://smartshuffle.io/login">Login with Spotify</Button>}
          </Container>
      </Navbar>
      )
    }

    logOut = () => {
        document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/'
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
  
  export default SSNav