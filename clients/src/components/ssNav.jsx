import React from 'react'
import Logo from '../images/smartshuflelogo.png'
import { Container, Navbar, Button, Nav } from 'react-bootstrap'
import './ssNav.css'


class SSNav extends React.Component {
    constructor (props) {
      super(props)
  
      this.state = {
      }
    }
    
    render = () => {
      return (
        <Navbar expand="xl" className="color-nav" variant="light">
        <Container className = "navcontainer">
          <Navbar.Brand className="extend" href = "/home">
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
          </Nav>
          <Button id = "logout" variant= "dark" size= "sm" onClick={() => this.logOut()}>Logout</Button>{' '}
          </Container>
      </Navbar>
      )
    }

    logOut = () => {
        document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/'
      }

  }
  
  export default SSNav