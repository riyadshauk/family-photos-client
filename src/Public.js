import React, { Fragment } from 'react';
const Public = () => {
  return (
    <Fragment>
      <h3>Public</h3>
      <p>
        There's nothing interesting here. Please log in with valid credentials to redirect to the PhotoFeed.
      </p>
      <p>
        Hint: Look into the <a href="https://github.com/riyadshauk/family-photos-server">server codebase</a> on GitHub for how to go about viewing a demo version of this <a href="https://github.com/riyadshauk/family-photos-client">front-end PhotoFeed</a>.
      </p>
    </Fragment>
  );
};
export default Public;