import React from 'react'

class Login extends React.Component {
    constructor (props) {
      super(props)
  
      this.state = {
      }
    }

    componentDidMount() {
        window.location.href = 'https://shuffle.cahillaw.me/login'
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