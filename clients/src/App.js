import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

//pages 
import Home from './pages/home'
import NotFoundPage from './pages/404'
import LoginPage from './pages';
import RedirectPage from './pages/redirect';
class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  render = () => {
    return <Router>
      <Switch>
        <Route exact path = "/" component={LoginPage} />
        <Route path = "/redirect" component={RedirectPage} />
        <Route exact path = "/home" component={Home} />
        <Route exact path = "/404" component={NotFoundPage}/>
        <Redirect to ="/"/>
      </Switch>
    </Router>
  }
}

export default App