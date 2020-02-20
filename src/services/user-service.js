import axios from 'axios';
import {
  requestUrl
} from '../constants/const';

const authenticationTokenKey = 'authenticationToken';

export default {
  saveToken(token) {
    let tokenToDate = {
      value: token.token,
      expireDate: token.expiresIn
    }
    localStorage.setItem(authenticationTokenKey, JSON.stringify(tokenToDate));
  },

  getToken() {
    return JSON.parse(localStorage.getItem(authenticationTokenKey));
  },

  login(user) {
    return new Promise((resolve, reject) => {
      axios.post(requestUrl() + '/login', user)
        .then(response => {
          this.saveToken(response.data);
          resolve(response.data);
        })
        .catch(error => {
          reject(error.response.data.message);
        });
    })
  },

  logout() {
    localStorage.removeItem(authenticationTokenKey);
  },

  register(user) {
    console.log(user);
    return new Promise((resolve, reject) => {
      axios.post(requestUrl() + '/register', user)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error.response.data.message);
        });
    })
  },

  isLoggedIn() {
    let savedToken = localStorage.getItem(authenticationTokenKey);
    if (!savedToken) {
      return false;
    }
    let parsedToken = JSON.parse(savedToken);
    if (parsedToken.expireDate * 1000 >= new Date().getTime()) {
      return true;
    }
    return false;
  },

  getActiveYears() {
    return new Promise((resolve, reject) => {
      axios.get(requestUrl() + '/users/me/active-years')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error.response.data.message);
        });
    })
  },
}
