// @flow
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import LoginForm from './session-related/LoginForm';
import PrivateRoute from './session-related/PrivateRoute';
import AuthButton from './session-related/AuthButton';
import PhotoFeed from './photo-feed/PhotoFeed';
import Public from './Public';

////////////////////////////////////////////////////////////
// 1. Click the public page
// 2. Click the protected page
// 3. Log in
// 4. Click the back button, note the URL each time
// https://reacttraining.com/react-router/web/example/auth-workflow

const App = () => {
  return (
    <Router>
      <div>
        <AuthButton />
        <LoginForm />
        <ul>
          <li>
            <Link to="/public">Public Page</Link>
          </li>
          <li>
            <Link to="/photofeed">Protected Photo Feed</Link>
          </li>
        </ul>
        <Route path="/public" component={Public} />
        <PrivateRoute path="/photofeed" component={PhotoFeed} />
      </div>
    </Router>
  );
};

export default App;