// @flow
import { sha256 } from "js-sha256";
/**
 * Note: This is simply for the user's sanity, so they know that their password is not sent to the server in plain-text.
 * This, alone, does not prevent against a MiM attack (for that TLS should be implemented, eg properly implemented https).
 */
export const encryptPassword = (username: string, password: string) => {
  const salt = '123-riyads-special-salt';
  return sha256(username + password + salt);
};
export const localStorageTokenKey = 'family-photos-wapp-token';
export const apiRootURL = 'https://riyadshauk.com/photosapi';
// export const apiRootURL = 'http://localhost:8080';