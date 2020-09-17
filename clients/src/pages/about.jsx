import React from 'react'
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap'
import './about.css'
import SSNav from '../components/ssNav'


class About extends React.Component {
    constructor (props) {
      super(props)
  
      this.state = {
        route: "info"
      }
    }

    componentDidMount() {

    }

    render = () => {

      const Content = () => {
        if(this.state.route === "info") {
          return (
            <Row>
              <Col className = "contentcol">
                <h2 id = "abouttitle">About SmartShuffle.io</h2>
                <p>SmartShuffle is a web application that allows Spotify users to create custom radio stations that let users better control how they shuffle music. Each station is built from individual playlists, each with a specific weight that allows users to control precisely how often they hear each song. SmartShuffle uses the Spotify play queue to listen to stations, adding songs to the end of the playback queue in the background for a seamless listening experience. </p>
                <h3>The Story of SmartShuffle</h3>
                <i>Changing the playlist is a relic of the past…</i>
                <div id ="story">I created SmartShuffle as a way of dealing with the frustration of changing the playlist. I listen to a lot of music, so I end up getting sick of listening to my main playlist pretty quickly every day. The solution of course is to change the playlist - however I found myself changing it as often as every 5 songs. This solution added up to hours of lost productivity every day and quite frankly, didn’t even work very well. If only, I thought, there was some way to combine playlists so that I could hear songs from my main playlist most of the time, while also sprinkling in fresh songs from my past that I had not heard in months. I tried this in Spotify - I copy pasted my 2000 song “Starred” playlist into a new playlist, and then copy pasted in every song from my main playlist 50 times. I thought this would weigh new and old songs relatively equally, and give me a fresh playlist that I wouldn’t have to change off of every 20 minutes. I was wrong - Spotify’s shuffler ignores duplicates, so I was just listening to Starred. Another shuffling issue occured in my main playlist. I typically listen to it in order of recently added, as to hear the fresh songs I had recently discovered first. After a certain point, I would then start shuffling, however if I did I found myself skipping song after song. I wanted to hear all the songs on shuffle, however Spotify excluded the new tracks because I had just listened to them, making me switch off the playlist faster. I created SmartShuffle to solve both of these issues. Before SmartShuffle, I would start changing the playlist after an hour or two, but I can now listen to the same customized station for 6 - 8 hours daily before feeling the need to switch it up. Mission accomplished! </div>
              </Col>
            </Row>
          )
        } else if (this.state.route === "privacy") {
          return (
            <Row>
              <Col className = "contentcol">
                <h2 id = "abouttitle">Privacy Policy</h2>
                <p>SmartShuffle.io is a free service. By using SmartShuffle.io, you agree to the policies regarding information collection and use outlined in this privacy policy.</p>
                <p>In order to relate your data to your Spotify account, we collect the Spotify user ID of those who use the site. This is only for use in our internal database, and is not displayed or used anywhere on the site. For the Repeat Limit functionality to work, we also collect the tracks you queue as you listen to a station. This data is not used outside its intended purpose, and old data is periodically deleted. If you want to manually remove your listening history, deleting a station also deletes all track history for that station.</p>
                <p>Both Spotify and SmartShuffle.io uses cookies to maintain your log-in state. You have the option to refuse these cookies, however some site functionality may not work as expected. Re-logging in through the login portal should fix any issues regarding cookies.</p>
              </Col>
            </Row>
          )
        } else if (this.state.route === "changelog") {
          return (
            <Row>
              <Col className = "contentcol">
              <h2 id = "abouttitle">Changelog</h2>
                <h3 id="-0-0-0-9-16-20">[0.1.0] - 9/16/20</h3>
                <ul>
                <li>Added about page.</li>
                <li>Added privacy policy.</li>
                <li>Added changelog to the site.</li>
                <li>Added contact us.</li>
                <li>Reworked the main navbar, content is now centered.</li>
                </ul>
                <h3 id="-0-0-1-9-12-20">[0.0.1] - 9/12/20</h3>
                <ul>
                <li>Added changelog.</li>
                <li>Added an idle timer that will cause the site to stop making now playing API requests after 5 minutes of inactivity.</li>
                <li>Local tracks are now displayed in now playing correctly.</li>
                <li>Fixed a bug with edit playlist weights that caused an error to always appear, rendering the feature unusable.</li>
                </ul>
                <h3 id="-0-0-0-9-11-20">[0.0.0] - 9/11/20</h3>
                <ul>
                <li>Site is now live at smartshuffle.io</li>
                </ul>
              </Col>
            </Row>
          )
        } else if (this.state.route === "blog") {
          return (
            <Row>
              <Col className = "contentcol">
                <h2 id = "abouttitle">Blog</h2>
                <i>Coming soon...</i>
              </Col>
            </Row>
          )
        } else if (this.state.route === "contact") {
          return (
            <Row>
              <Col className = "contentcol">
              <h2 id = "abouttitle">Contact Us</h2>
              <p>SmartShuffle.io is currently in Beta, so we are looking for feedback in all aspects of the site. Please email all concern/suggestions/bug reports/otherwise to <a href ="mailto:cahillawx@gmail.com">cahillawx@gmail.com</a></p>
              <br></br>
              <h3>Thanks for using SmartShuffle!</h3>
              </Col>
            </Row>
          )
        }
      }


      return (
          <div>
              <SSNav></SSNav>
              <Container className = "subnavcont">
                <Navbar className = "subnav" bg="dark" variant="dark">
                    <Navbar.Brand href="#info" onClick={() => this.changeRoute()}>About</Navbar.Brand>
                    <Nav className="mr-auto">
                      <Nav.Link href="#privacy" onClick={() => this.changeRoute()}>Privacy</Nav.Link>
                      <Nav.Link href="#changelog" onClick={() => this.changeRoute()}>Changelog</Nav.Link>
                      <Nav.Link href="#contact" onClick={() => this.changeRoute()}>Contact Us</Nav.Link>
                    </Nav>
                </Navbar>
              </Container>
              <Container>
                  <Col>
                    <Row className ="justify-content-md-center">
                        <Container id = "aboutinfo">
                          <Content></Content>
                        </Container>
                    </Row>
                  </Col>
              </Container>
          </div>
      )
    }

    changeRoute = () => {
      setTimeout(()=>{
        this.setState({
          route: this.props.location.hash.replace("#", "")
        })
      },0)
    }

  }
  
  export default About