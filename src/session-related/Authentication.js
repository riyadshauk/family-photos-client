// @flow
import { localStorageTokenKey } from '../helpers';
/**
 * @todo add authentication JS logic from my previous codebase (currently coupled inside photoserver) ~ .5-1 hr to get working iA
 */
export default class Authentication {
  static isAuthenticated = false;
  static signin(token: string, status: number) {
    if (status === 200) {
      localStorage.setItem(localStorageTokenKey, token);
      this.isAuthenticated = true;
    } else {
      console.error('Signin attempt unsuccessful!');
    }
  }
  static signout() {
    localStorage.setItem(localStorageTokenKey, '');
    this.isAuthenticated = false;
  }
  static getToken() {
    return localStorage.getItem(localStorageTokenKey) || '';
  }
}

/**
 * @todo Rely instead on Authentication (not fakeAuth)
 */
export const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb: Function) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb: Function) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};