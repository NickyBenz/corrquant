import React, { Component } from 'react';
import { withOktaAuth } from '@okta/okta-react';
import Protected from './Protected';

export default withOktaAuth(class Home extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  async login() {
    this.props.authService.login('/');
  }

  async logout() {
    this.props.authService.logout('/');
  }

  render() {
    if (this.props.authState.isPending) return <div>Loading...</div>;
    return this.props.authState.isAuthenticated ?
      <Protected/> : this.props.authService.login('/');
  }
});