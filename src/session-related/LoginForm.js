// @flow
import React, { Component, Fragment } from "react";
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import { encryptPassword, apiRootURL } from '../helpers';
import Authentication from './Authentication';
import ErrorText from '../ErrorText';

type Props = {
  history: any
};

type State = {
  email: string,
  password: string,
  loginResponseStatus: string,
};

class LoginForm extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {email: '', password: '', loginResponseStatus: '' };

    (this: any).handleEmailChange = this.handleEmailChange.bind(this);
    (this: any).handlePasswordChange = this.handlePasswordChange.bind(this);
    (this: any).handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(event: SyntheticInputEvent<>) {
    this.setState({email: event.target.value});
  }

  handlePasswordChange(event: SyntheticInputEvent<>) {
    this.setState({password: event.target.value});
  }

  handleSubmit(event: SyntheticInputEvent<>) {
    const email = this.state.email;
    const password = this.state.password;
    const encryptedPassword = encryptPassword(email, password);
    event.preventDefault();
    axios({
      method: 'post',
      url: `${apiRootURL}/login`,
      auth: {
        username: email,
        password: encryptedPassword,
      },
    })
    .then((res) => {
      const token = res.data ? res.data.token : '';
      const status = res.status;
      Authentication.signin(token, status);
      if (Authentication.isAuthenticated) {
        this.clearLoginState();
        this.props.history.push('/photofeed'); // we get props.history by wrapping LoginForm in withRouter
      }
    }).catch((err) => {
      const status = err.response.status;
      if (status === 401) {
        this.setState({ loginResponseStatus: '401 Unauthorized: Incorrect credentials provided.' });
      }
    });
  }

  clearLoginState() {
    this.setState({ email: '', password: '', loginResponseStatus: '' });
  }

  render() {
    if (Authentication.isAuthenticated) {
      return null; // don't render LoginForm
    }
    return (
      <Fragment>
        <form onSubmit={this.handleSubmit}>
          <label>
            Email:
            <input type="text" value={this.state.email} onChange={this.handleEmailChange} />
          </label>
          <label>
            Password:
            <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
          </label>
          <input type="submit" value="Log in" />
        </form>
        <ErrorText text={this.state.loginResponseStatus} />
      </Fragment>
    );
  }
}
export default withRouter(LoginForm); // gives us props.history