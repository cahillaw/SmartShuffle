import React from 'react'
import { serverBase } from '../misc/constants'

class Login extends React.Component {
    constructor (props) {
      super(props)
  
      this.state = {
      }
    }

    componentDidMount() {
        window.location.href = serverBase + "/login"
    }

    render = () => {
      return (
          <div>
              Loading...
          </div>
      )
    }

  }
  
  export default Login