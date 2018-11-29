import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Command from './Command'
import SendCommand from './SendCommand'
import Header from './Header'
import Login from './Login'

class App extends Component {
  render() {
    return (
      <div className="center w85">
        <Header />
        <div className="ph3 pv1 background-gray">
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/login" />} />
            <Route exact path="/commands" component={Command} />
            <Route exact path="/sendCommand" component={SendCommand} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App
