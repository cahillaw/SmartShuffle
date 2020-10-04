import React from 'react'
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
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
      if(this.props.location.hash.replace("#", "") === "") {
        this.setState({
          route: "info"
        })
      } else {
        this.setState({
          route: this.props.location.hash.replace("#", "")
        })
      }
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
                <div id ="story">I created SmartShuffle as a way of dealing with the frustration of changing the playlist. I listen to a lot of music, so I end up getting sick of listening to my main playlist pretty quickly every day. The solution of course is to change the playlist - however I found myself changing it as often as every 5 songs. This solution added up to hours of lost productivity every day and quite frankly, didn’t even work very well. I thought if only there was some way to combine playlists so that I could hear songs from my main playlist most of the time, while also sprinkling in fresh songs from my past that I had not heard in a while. I tried this in Spotify - I copy pasted my 2000 song “Starred” playlist into a new playlist, and then copy pasted in every song from my main playlist 50 times. I thought this would weigh new and old songs relatively equally, and give me a fresh playlist. I was wrong - Spotify’s shuffler ignores duplicates, so I was just listening to Starred. Another shuffling issue occured in my main playlist. I typically listen to it in order of recently added, as to hear the fresh songs I had recently discovered first. After a certain point, I would then start shuffling, however if I did I found myself skipping song after song. I wanted to hear all the songs on shuffle, however Spotify excluded the new tracks because I had just listened to them, making me switch off the playlist faster. I created SmartShuffle to solve both of these issues. Before SmartShuffle, I would start changing the playlist after an hour or two, but I can now listen to the same customized station for 6 - 8 hours daily before feeling the need to switch it up. Mission accomplished!</div>
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
                <strong>Last Updated: 9/16/20</strong>
              </Col>
            </Row>
          )
        } else if (this.state.route === "changelog") {
          return (
            <Row>
              <Col className = "contentcol">
              <h2 id = "abouttitle">Changelog</h2>
                <h3 id="-0-3-0-10-3-20">[0.3.0] - 10/3/20</h3>
                <ul>
                <li>Mobile site is now live!</li>
                <li>Button names are now less verbose.</li>
                <li>Background color is now a light blue-grey, and the about page textbox background color is now white.</li>
                <li>Fixed a bug that caused playback state to not change when idle even when the user changed playback state. </li>
                </ul>
                <h3 id="-0-2-1-9-25-20">[0.2.1] - 9/25/20</h3>
                <ul>
                <li>Now playing now seamlessly moves to the next song when the current song ends.</li>
                <li>Fixed a bug that occasionally caused a song to fail to queue.</li>
                <li>Fixed a bug that broke logging in for new users.</li>
                <li>Fixed a bug that caused the new playlist accordion to collapse when submitting if invalid inputs were detected.</li>
                </ul>
                <h3 id="-0-2-0-9-23-20">[0.2.0] - 9/23/20</h3>
                <ul>
                <li>Added site metadata, the site should now embed properly into external sites such as Facebook/Twitter/Discord/etc.</li>
                <li>Added page titles.</li>
                <li>If idle, SmartShuffle will now check your playback every 5 minutes instead of every 30 seconds. </li>
                <li>Closing Edit Playlist Weights without making a change now resets changes.</li>
                <li>Added Auto-Detection for Queue Interval. This is not perfect, otherwise it would require making additional api calls, however the estimate should be pretty close in the vast majority of cases.</li>
                <li>Fixed a bug that caused Edit Playlist Weights to not work after editing a playlist.</li>
                <li>Fixed a bug that caused bad access tokens to used in certain cases. This resulted in the site thinking you did not have premium, forcing you to log out and log back in again.</li>
                </ul>
                <h3 id="-0-0-0-9-21-20"> [0.1.3] - 9/21/20</h3>
                <ul>
                <li>Fixed a bug that caused queuing to stop sometime after going idle.</li>
                <li>Fixed a bug that caused now playing to not update after skipping a song.</li>
                </ul>
                <h3 id="-0-0-0-9-20-20"> [0.1.2] - 9/20/20</h3>
                <ul>
                <li>Reworked styling on login page, should now fit the screen regardless of screen size</li>
                <li>Added links to About, Privacy and Contact us to the login page.</li>
                <li>Updated navbar to support being linked from the login page. If not logged in, it will show login with Spotify and the SmartShuffle logo will link to the login page instead of home.</li>
                <li>Fixed a bug that prevented the progress bar from pausing after hiting the pause button. </li>
                <li>If you are listening to a station, the skip button will now queue a song first before skipping. This was previously in the opposite order, which caused problems when there was no other songs in queue.</li>
                <li>Added a warning notifying users that SmartShuffle will not queue new tracks when your playback is paused.</li>
                </ul>
                <h3 id="-0-0-0-9-17-20"> [0.1.1] - 9/17/20</h3>
                <ul>
                <li>Fixed a bug that defaulted new playlist's weight to 0 and new station's repeat limit to 0.</li>
                <li>Fixed a bug that would case SmartShuffle to think you didn't have premium after navigating from the about page.</li>
                <li>Fixed a bug that caused recently added to not work properly on playlists with greater than 200 songs.</li>
                <li>Fixed a bug that caused playlist edits to not be displayed. These edits were recorded properly, however you had to refresh the page to see them.</li>
                <li>Fixed a bug that prevented the progress bar from pausing after hiting the pause button. </li>
                <li>If you are listening to a station, the skip button will now queue a song first before skipping. This was previously in the opposite order, which caused problems when there was no other songs in queue.</li>
                <li>Added a warning notifying users that SmartShuffle will not queue new tracks when your playback is paused.</li>
                <li>Idle timer improvements to hopefully stop music from either queuing not or queueing due to poorly timed pausing of playback.</li>
                </ul>
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
            <Helmet>
              <title>About | SmartShuffle.io</title>
              <meta property="og:title" content="About | SmartShuffle.io"/>
              <meta property="og:url" content="http://smartshuffle.io/about"/>
            </Helmet>
              <SSNav></SSNav>
              <Container className = "subnavcont">
                <Navbar className = "subnav" bg="dark" variant="dark">
                    <Navbar.Brand id ="brandd" href="#info" onClick={() => this.changeRoute()}>About</Navbar.Brand>
                    <Nav className="mr-auto">
                      <Nav.Link href="#privacy" id="privacy" onClick={() => this.changeRoute()}>Privacy</Nav.Link>
                      <Nav.Link href="#changelog" onClick={() => this.changeRoute()}>Changelog</Nav.Link>
                      <Nav.Link href="#contact" id="contact" onClick={() => this.changeRoute()}>Contact Us</Nav.Link>
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