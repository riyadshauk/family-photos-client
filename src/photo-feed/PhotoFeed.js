// @flow
import React, { Component, Fragment } from 'react';
import axios from 'axios';

import { apiRootURL } from '../helpers';
import Authentication from '../session-related/Authentication';
import styles from './PhotoFeed.css';

type Props = {};

type State = {
  photos: Array<any>, // @todo update Array<any> as I figure it out...
  photosListingList: Array<string>,
  photosList: Array<any>
};

/**
 * @todo front-end load photos here (see async best practices?)
 * @todo hook up to back-end, and load photos from my db / api here (after getting any photos up)
 */
class PhotoFeed extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      photos: [],
      photosListingList: [],
      photosList: []
    };
    this.getPhotos();
  }

  /**
   * @todo extract this to separate component (do EXIF stuff in here)
   */
  handleImage() {
    
  }

  /**
   * @todo set up req.query on backend to getAllPhotoNames, getSpecificPhoto
   * @todo use EXIF library to extract EXIF for each image (once loaded), then rotate each image, accordingly
   * @todo also, display the EXIF data for each image on front-end
   * @see https://github.com/gomfunkel/node-exif (@todo seperate these tasks out into an ExifExtractor component or something)
   */
  getPhotos() {
    console.log('getPhotos with token:', Authentication.getToken());
    axios.get(
      `${apiRootURL}/photos/demo?q=listing`,
      { headers: { 'Authorization': `Bearer ${Authentication.getToken()}` } }
    ).then((res) => {
      console.log('PhotoFeed getPhotos res:', res);
      const photoListingNamesList = res.data.listing.map((fileName, idx) =>
        <li key={idx}>{fileName}</li>
      );
      this.setState({ photosListingList: photoListingNamesList });

      res.data.listing.forEach((fileName) => {

        this.setState(prevState => ({
          photosList: [
            ...prevState.photosList, 
            <img className={styles.photos} onLoad={this.handleImage} onError={this.handleImage} src={`${apiRootURL}/photos/demo/${fileName}?token=${Authentication.getToken()}`}/>
          ]
        }));
      })
    });
  }
  render() {
    return (
      <Fragment>
        <h3>PhotoFeed</h3>
        <div>{ this.state.photosList }</div>
        <div>{ this.state.photosListingList }</div>
      </Fragment>
    );
  }
};
export default PhotoFeed;