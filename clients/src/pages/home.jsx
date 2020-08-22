import React from 'react'
import { Link } from 'react-router-dom'
import { Jumbotron, Container, Row, Col } from 'react-bootstrap'
import './home.css'
import Preset from '../components/preset'
import Create from '../components/create'

class Home extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        access_token: '',
        refresh_token: '',
        presetsdata: '',
        loggedIn: true
      }
    }

    componentDidMount () {
      if(this.props.location.state == null) {
        this.setState ({
          loggedIn: false
        })
      } else {
        this.setState ({
          access_token: "Bearer " + this.props.location.state.access_token,
          refresh_token: this.props.location.state.refresh_token
        })
        setTimeout(() => {
          this.getUserPageInfo()
          }, 1);
      }
    }

    render = () => {
      if (!this.state.loggedIn) {
        return (
          <div>
            Does not appear that you are logged in, please try logging in&nbsp;    
            <Link to = "/">here</Link>
          </div>
          
        )
      }

      if(this.state.presetsdata !== '') {
        var ps = this.state.presetsdata
        const presets = ps.map((ps) => 
        <div key={ps.presetId}>
          <Preset 
            data = {ps}
            access_token = {this.state.access_token}
            refresh_token = {this.state.refresh_token}
            getUserPageInfo = {this.getUserPageInfo}
          />
        </div>
        );
        return (
          <div>
            <Jumbotron>
              <h1 id="title">Welcome to SmartShuffle.io</h1>
              <br></br>
              <div>Create your own custom Radio Stations and start listening! </div>
              <div>Changing the playlist is a relic of the past!</div>
            </Jumbotron>
            <Container>
              <Row>
                <Col>
                  <div id = "container">
                    {presets}
                    <Create 
                      access_token = {this.state.access_token}
                      refresh_token = {this.state.refresh_token}
                      addNewPreset = {this.addNewPreset}
                      getUserPageInfo = {this.getUserPageInfo}
                    />
                  </div>
                </Col>
              </Row>
            </Container>
        </div>
        )
      }

      return (
        <div>Loading...</div>
      )
    }
      
    //currently unused, might of not worked because was using presetsdata2
    addNewPreset = (ps) => {
      var presets = this.state.presetsdata.concat(ps)
      this.setState({
        presetsdata: presets
      })
      console.log(presets)
    }

    getUserPageInfo = () => {
      var url = "https://shuffle.cahillaw.me/v1/userpage"
      fetch(url, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.state.access_token 
        }
      })
      .then((response) => {
        response.json().then((data) => {
          if (response.status === 200) {
            this.setState({
              presetsdata: data
            })
          } else {
            console.log("non 200 status code loading page info")
          }
        })
      })
    }

}

export default Home