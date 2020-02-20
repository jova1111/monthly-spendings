import axios from 'axios';
import {
  requestUrl
} from '../constants/const';

export default {
  getSpendingsByCategory(year) {
    return new Promise((resolve, reject) => {
      axios.get(requestUrl() + '/statistics/spendings-by-category', {
          params: {
            year
          }
        }).then(response => {
          resolve(response.data);
        }).catch(error => {
          reject(error.response.data.message);
        });
    });
  },

  getOtherUsersSpendings(year) {
    return new Promise((resolve, reject) => {
      axios.get(requestUrl() + '/statistics/other-users-spendings', {
          params: {
            year
          }
        }).then(response => {
          resolve(response.data);
        }).catch(error => {
          reject(error.response.data.message);
        });
    });
  },

  getAverageByMonth(year) {
    return new Promise((resolve, reject) => {
      axios.get(requestUrl() + '/statistics/average-by-month', {
          params: {
            year
          }
        }).then(response => {
          resolve(response.data);
        }).catch(error => {
          reject(error.response.data.message);
        });
    });
  }
}
