import React, { Component } from 'react';
import { withOktaAuth  } from '@okta/okta-react';

export default withOktaAuth(class MainNavigation extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  async logout() {
    this.props.authService.logout('/');
  }

  render() {
    if (this.props.authState === undefined || this.props.authState.isPending) return <div>Loading...</div>;
    return this.props.authState.isAuthenticated ?
    <button type="button" onClick={this.logout}>Log Out</button>: null;
  }
});