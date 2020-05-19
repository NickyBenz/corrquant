import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { SecureRoute, Security, LoginCallback } from '@okta/okta-react';
import Home from './Components/Home';
import Protected from './Components/Protected';
 
class App extends Component {
  render() {
    return (
      <Router>
        <Security issuer='https://dev-974011.okta.com/oauth2/default'
                  clientId='0oacjq83jxXsJkgJt4x6'
                  redirectUri={'http://185.247.116.225' + '/implicit/callback'}
                  pkce={false}
                  responseType={null}
                  clientSecret = 'Atilla' >
          <Route path='/' exact={true} component={Home}/>
          <SecureRoute path='/protected' component={Protected}/>
          <Route path='/implicit/callback' component={LoginCallback} />
        </Security>
      </Router>
    );
  }
}
 
export default App;