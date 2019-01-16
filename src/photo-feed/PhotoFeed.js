// @flow
import React, { Component, Fragment } from 'react';
import axios from 'axios';

import { apiRootURL, logger } from '../helpers';
import Authentication from '../session-related/Authentication';
import styles from './PhotoFeed.css';
import LazyImage from './LazyImage';

type Props = {};

type State = {
  photosListing: Array<string>
};

/**
 * @todo front-end load photos here (see async best practices?)
 * @todo hook up to back-end, and load photos from my db / api here (after getting any photos up)
 */
class PhotoFeed extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      photosListing: []
    };
  }

  /**
   * @todo extract this to separate component (do EXIF stuff in here)
   */
  handleImage(blah: any) {
    logger('handleImage fired! with blah:', blah, 'typeof blah:', typeof blah);
    // @todo
  }

  /**
   * @todo set up req.query on backend to getAllPhotoNames, getSpecificPhoto
   * @todo use EXIF library to extract EXIF for each image (once loaded), then rotate each image, accordingly
   * @todo also, display the EXIF data for each image on front-end
   * @see https://github.com/gomfunkel/node-exif (@todo seperate these tasks out into an ExifExtractor component or something)
   */
  getPhotos() {
    logger('getPhotos with token:', Authentication.getToken());
    axios.get(
      `${apiRootURL}/photos/demo?q=listing`,
      { headers: { 'Authorization': `Bearer ${Authentication.getToken()}` } }
    ).then((res) => {
      this.setState({ photosListing: res.data.listing });
    });
  }

  componentDidMount() {
    this.getPhotos();
  }

  render() {
    logger('this.state.photosListing:', this.state.photosListing);
    return (
      <div className="photofeed">
        <h3>PhotoFeed</h3>
        {this.state.photosListing.map((fileName, idx) => {
          return (
              <Fragment key={idx}>
                <LazyImage className={styles.photos} onLoad={this.handleImage} onError={this.handleImage} src={`${apiRootURL}/photos/demo/${fileName}?token=${Authentication.getToken()}`}/>
              </Fragment>
            );
        })}
      </div>
    );
  }
};
export default PhotoFeed;