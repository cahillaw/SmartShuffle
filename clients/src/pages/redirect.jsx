import React from 'react'
import { Redirect } from 'react-router-dom'

class RedirectPage extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        access_token: '0',
        refresh_token: ''
      }
    }

    componentDidMount () {
      var url = this.props.location.search
      var res = url.split("=", 3)
      var res2 = res[1].split("&")
      this.setState({
        access_token: res2[0],
        refresh_token: res[2]
      }) 
    }

    render = () => {
      if(this.state.access_token !== '0') {
        return <Redirect to={{
          pathname: '/home',
          state: {
            access_token: this.state.access_token,
            refresh_token: this.state.refresh_token
          }
        }} />
      }

      return (
        <div>
          <h1 id="title">Loading...</h1>
        </div>
      )
    }

}

export default RedirectPage