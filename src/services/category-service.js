import axios from 'axios';
import {
  requestUrl
} from '../constants/const';

export default {
  getAll() {
    return new Promise((resolve, reject) => {
      axios.get(requestUrl() + '/categories').then(response => {
          resolve(response.data);
        }).catch(error => {
          reject(error.response.data.message);
        });
    });
  },

  create(name) {
    return new Promise((resolve, reject) => {
      axios.post(requestUrl() + '/categories', {
          name
        })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error.response.data.message);
        });
    });
  },

  delete(id) {
    return new Promise((resolve, reject) => {
      axios.delete(requestUrl() + '/categories/' + id)
        .then(response => {
          resolve("Successfully deleted category.");
        })
        .catch(error => {
          reject(error.response.data.message);
        });
    });
  }
}
