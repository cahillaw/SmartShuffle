import React from 'react'
import './nowPlaying.css'
import { Spinner } from 'react-bootstrap'


class NowPlaying extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            aa: "",
            track: "",
            artist: "",
            album: "",
            loading: true
        }
      }

      componentDidMount () {
        this.getCurrentPlaybackInfo()
        setInterval(() => {
            this.getCurrentPlaybackInfo()
        }, 10000);
      }

      render = () => {
        return (
            <div id = "nowplaying">
                <strong id = "title">Now Playing</strong>
                <br></br>
                {this.state.loading ? <Spinner id="spinner" animation = "border"/> : <img id ="aa" src={this.state.aa} alt="album artwork"/>}
                <br></br>
                <strong id = "title">{this.state.track} - </strong> 
                <strong id = "title">{this.state.artist}</strong>
                <br></br>
                <strong id = "title">{this.state.album}</strong>
                <br></br>
            </div>
        )
      }

      getCurrentPlaybackInfo = () => {
        setTimeout(() => {
            var url = "https://api.spotify.com/v1/me/player/currently-playing"
            fetch(url, {
              method: 'get',
              headers: {
                'Authorization': this.props.access_token
              }
            })
            .then((response) => {
              if (response.status === 200) {
                response.json().then((data) => {
                  this.setState({
                    aa: data.item.album.images[0].url,
                    track: data.item.name,
                    artist: data.item.artists[0].name,
                    album: data.item.album.name,
                    loading: false
                  })
                })
              } else if (response.status === 401) {
                console.log("access token is bad, getting new one...")
                this.props.getAccessToken(this.queueSong)
              }
            })
          }, 0)
      }
}

export default NowPlaying