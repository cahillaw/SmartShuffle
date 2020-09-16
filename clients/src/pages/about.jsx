import React from 'react'
import Logo from '../images/smartshuflelogo.png'
import { Container, Row, Col, Navbar, Alert, Button, Nav, Form, FormControl } from 'react-bootstrap'
import './about.css'
import SSNav from '../components/ssNav'


class About extends React.Component {
    constructor (props) {
      super(props)
  
      this.state = {
      }
    }

    componentDidMount() {
    }

    render = () => {
      return (
          <div>
              <SSNav></SSNav>
              <Container>
                  <Col>
                    <Row className ="justify-content-md-center">
                        <Container id = "aboutinfo">
                        <Row>
                            <Col>
                            <h2 id = "abouttitle">About SmartShuffle.io</h2>
                            <p>SmartShuffle is a web application that allows Spotify users to create custom radio stations that let users better control how they shuffle music. Each station is built from individual playlists, each with a specific weight that allows users to control precisely how often they hear each song. SmartShuffle uses the Spotify play queue to listen to stations, adding songs to the end of the playback queue in the background for a seamless listening experience. </p>
                            <h3>The Story of SmartShuffle</h3>
                            <i>Changing the playlist is a relic of the past…</i>
                            <div id ="story">I created SmartShuffle as a way of dealing with the frustration of changing the playlist. I listen to a lot of music, so I end up getting sick of listening to my main playlist pretty quickly every day. The solution of course is to change the playlist - however I found myself changing it as often as every 5 songs. This solution added up to hours of lost productivity every day and quite frankly, didn’t even work very well. If only, I thought, there was some way to combine playlists so that I could hear songs from my main playlist most of the time, while also sprinkling in fresh songs from my past that I had not heard in months. I tried this in Spotify - I copy pasted my 2000 song “Starred” playlist into a new playlist, and then copy pasted in every song from my main playlist 50 times. I thought this would weigh new and old songs relatively equally, and give me a fresh playlist that I wouldn’t have to change off of every 20 minutes. I was wrong - Spotify’s shuffler ignores duplicates, so I was just listening to Starred. Another shuffling issue occured in my main playlist. I typically listen to it in order of recently added, as to hear the fresh songs I had recently discovered first. After a certain point, I would then start shuffling, however if I did I found myself skipping song after song. I wanted to hear all the songs on shuffle, however Spotify excluded the new tracks because I had just listened to them, making me switch off the playlist faster. I created SmartShuffle to solve both of these issues. Before SmartShuffle, I would start changing the playlist after an hour or two, but I can now listen to the same customized station for 6 - 8 hours daily before feeling the need to switch it up. Mission accomplished! </div>
                            </Col>
                        </Row>
                        </Container>
                    </Row>
                  </Col>
              </Container>
          </div>
      )
    }

  }
  
  export default About