// @flow
import { sha256 } from 'js-sha256';
import process from 'process';
import axios from 'axios';
import Authentication from './session-related/Authentication';
import { fileURLToPath } from 'url';

const inProduction = true; // catch-all @todo get from env in better way

/**
 * Note: This is simply for the user's sanity, so they know that their password is not sent to the server in plain-text.
 * This, alone, does not prevent against a MiM attack (for that TLS should be implemented, eg properly implemented https).
 */
export const encryptPassword = (username: string, password: string) => {
  const salt = '123-riyads-special-salt';
  return sha256(username + password + salt);
};
export const localStorageTokenKey = 'family-photos-wapp-token';
// export const apiRootURL = process.env.STAGING_API_ROOT_URL || 'https://riyadshauk.com/photosapi';
export const apiRootURL = inProduction ? 'https://riyadshauk.com/photosapi' : 'http://localhost:8081';

export const errorLogger = (...args: any) => (process.env.NODE_ENV !== 'production' || !process.env.STAGING_API_ROOT_URL) && !inProduction ? console.error(args) : undefined;
export const logger = (...args: any) => (process.env.NODE_ENV !== 'production' || !process.env.STAGING_API_ROOT_URL) && !inProduction ? console.log(args) : undefined;


/**
 * @returns orientation in degrees from the vertical (0), clockwise
 * @param {number} orientation 1 is correct orientation, 6 rotated 270 deg, 3 rotated 180 deg
 */
export const getOrientationDegrees = (orientation: number) => {
  switch (orientation) {
    case 1:
      return 0;
    case 3:
      return 180;
    case 6:
      return 270;
    default:
      errorLogger('\n\nUNKNOWN ORIENTATION!\n\n');
  }
}

export const fetchEXIFData = (imageURL: string) => {
  return new Promise((resolve, reject) => {
    axios.get(
      imageURL,
      { headers: { 'Authorization': `Bearer ${Authentication.getToken()}` } }
    ).then((res) => {
      logger('fetchEXIFData res.data:', res.data);
      resolve(res.data);
    })
    .catch((err) => {
      errorLogger(err.stack);
      reject(err);
    });
  });
};

const extractImageOrientation = async (imageURL: string) => {
  return new Promise(async (resolve, reject) => {
    const exifData = await fetchEXIFData(imageURL + `&q=exif`);
    const orientation = exifData.image ? getOrientationDegrees(exifData.image.Orientation) : null;
    logger('exifData:', exifData);
    logger('orientation:', orientation);
    if (orientation || orientation === 0) {
      resolve(orientation);
    } else {
      reject(new Error('Orientation could not be determined.'));
    }
  });
};

const VIDEO = 'video';
const videoMIMEType = {
  'flv':    `${VIDEO}/flv`,
  'mp4':    `${VIDEO}/mp4`,
  'm4v':    function() { return this.mp4 },
  'm3u8':   `application/x-mpegURL`,
  'ts':     `${VIDEO}/MP2T`,
  '3gp':    `${VIDEO}/3gpp`,
  'mov':    function() { return this.mp4 }, // `${VIDEO}/quicktime`,
  'avi':    `${VIDEO}/x-msvideo`,
  'wmv':    `${VIDEO}/x-ms-wmv`,
}

const fileContainsValidExtension = (filePath: string, validExtensions: string[]) => {
  for (let i = 0; i < validExtensions.length; i++) {
    if (filePath.indexOf(`.${validExtensions[i]}`) > -1 || filePath.indexOf(`.${validExtensions[i].toUpperCase()}`) > -1) {
      return true;
    }
  }
  return false;
};

export const isValidExtension = (filePath: string) => {
  const validExtensions = ['jpg', 'jpeg', ...Object.keys(videoMIMEType)];
  return fileContainsValidExtension(filePath.substring(filePath.length - 5), validExtensions);
}

export const isJpeg = (filePath: string) => fileContainsValidExtension(filePath.substring(filePath.length - 5), ['jpg']);

export const isVideo = (filePath: string) => {
  const videoExtensions = Object.keys(videoMIMEType);
  return fileContainsValidExtension(filePath.substring(filePath.length - 5), videoExtensions);
};

export const getVideoMIMEType = (filePath: string): string => {
  const ending = filePath.substring(filePath.length - 5);
  const videoMIMETypes = Object.keys(videoMIMEType);
  for (let i = 0; i < videoMIMETypes.length; i++) {
    if (ending.includes(videoMIMETypes[i])) {
      logger('videoMIMEType[videoMIMETypes[i]]:', videoMIMEType[videoMIMETypes[i]]);
      return videoMIMEType[videoMIMETypes[i]];
      // return 'video/quicktime';
    }
  }
  return '';
};