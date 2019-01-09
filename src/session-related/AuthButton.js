// @flow
import React from 'react';
import {
  withRouter
} from 'react-router-dom';

import Authentication from './Authentication';

const AuthButton = withRouter(
  ({ history }) =>
      Authentication.isAuthenticated ? (
      <p>
        Welcome!{" "}
        <button
          onClick={() => {
            Authentication.signout();
            history.push("/");
          }}
        >
          Sign out
        </button>
      </p>
    ) : (
      <p>You are not logged in.</p>
    )
);
export default AuthButton;