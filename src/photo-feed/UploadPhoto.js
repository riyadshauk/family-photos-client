// @flow
import React, { Component, Fragment } from "react";
import axios from 'axios';

import { apiRootURL, logger } from '../helpers';
import Authentication from '../session-related/Authentication';
import ErrorText from '../ErrorText';

type Props = {};

type State = {
  uploadResponseStatus: string,
  file: File,
};

class UploadPhoto extends Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = { uploadResponseStatus: '', file: null }; // @todo init file to some valid falsey value

    (this: any).handleSubmit = this.handleSubmit.bind(this);
    (this: any).onChange = this.onChange.bind(this);
    (this: any).uploadFile = this.uploadFile.bind(this);
  }

  onChange(e: Event) {
    logger('UploadPhoto onChange e:', e);
    this.setState({ file: e.target.files[0] });
  }

  uploadFile(file: File) {
    const fileName = this.state.file ? this.state.file.name : '';
    if (!fileName) {
      return new Promise((resolve, reject) => reject('Error: It seems no file has been selected for upload.'));
    }
    const url = `${apiRootURL}/upload?token=${Authentication.getToken()}&fileName=${fileName}`;
    const formData = new FormData();
    formData.append('photo', this.state.file); // Note: back-end expects form name === photo
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    return axios.post(url, formData, config);
  }

  handleSubmit(event: SyntheticInputEvent<>) {
    event.preventDefault();
    this.uploadFile(this.state.file)
    .then((res) => {
      logger('handleSubmit uploadFile complete, res:', res);
    })
    .catch((err) => {
      console.error(err);
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="file" onChange={this.onChange} />
          <input type="submit" value="Upload" />
        </form>
      </div>
    );
  }
}
export default UploadPhoto;