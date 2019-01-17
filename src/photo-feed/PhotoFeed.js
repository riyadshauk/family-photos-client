// @flow
import React, { Component } from 'react';
import axios from 'axios';

import { apiRootURL, logger } from '../helpers';
import Authentication from '../session-related/Authentication';
import styles from './PhotoFeed.css';
import LazyImage from './LazyImage';

type Props = {};

type State = {
  photosListing: Array<string>
};

class PhotoFeed extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      photosListing: []
    };
  }

  /**
   * @todo display the EXIF data for each image on front-end
   */
  getPhotos() {
    logger('getPhotos with token:', Authentication.getToken());
    axios.get(
      `${apiRootURL}/photos/demo?q=listing`,
      { headers: { 'Authorization': `Bearer ${Authentication.getToken()}` } }
    ).then((res) => {
      /**
       * @todo support .MOV etc down the road (look into streaming for that, ie)
       */
      const listing = res.data.listing.filter((filePath: string) => filePath.indexOf('.JPG') > 0 || filePath.indexOf('.jpg') > 0 ? true : false);
      this.setState({ photosListing: listing });
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
        <p>Some current Todos:</p>
        <li>
          Add upload functionality
        </li>
        <li>
          Add comment + like functionality
        </li>
        <li>
          Add some readable EXIF data for user
        </li>
        <li>
          Store (above) relevant data in db (and make more API endpoints)
        </li>
        <li>
          Load thumbnail or low-quality images first, then higher-res upon click
        </li>
        <li>
          Consider using PJPG
        </li>
        {this.state.photosListing.map((fileName, idx) => {
          return (
              <div className={styles.photoContainer} key={idx}>
                <LazyImage className={styles.photos} src={`${apiRootURL}/photos/demo/${fileName}?token=${Authentication.getToken()}`}/>
              </div>
            );
        })}
      </div>
    );
  }
};
export default PhotoFeed;