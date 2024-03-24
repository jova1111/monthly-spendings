import axios from 'axios';
import {
  Transaction
} from '../models/transaction';
import {
  requestUrl
} from '../constants/const';
import { updateLocale } from 'moment';

export default {
  create(transaction) {
    return new Promise((resolve, reject) => {
      axios.post(requestUrl() + '/transactions', transaction)
      .then(response => {
        resolve(new Transaction(response.data));
      })
      .catch(error => {
        reject(error.response.data.message);
      });
    });
  },

  delete(id) {
    return new Promise((resolve, reject) => {
      axios.delete(requestUrl() + '/transactions/' + id)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error.response.data.message);
      });
    });
  },

  getAll(startDate = null, endDate = null, groupBy = "", cached = false) {
    return new Promise((resolve, reject) => {
      axios.get(requestUrl() + '/transactions', {
        params: {
          startDate,
          endDate,
          groupBy,
          cached
        }
      })
      .then(response => {
        if (groupBy) {
          resolve(response.data);
          return;
        }
        let transactionList = [];
        for (let transaction of response.data) {
          transactionList.push(new Transaction(transaction));
        }
        resolve(transactionList);
      })
      .catch(error => {
        reject(error.response.data.message);
      });
    });
  },

  update(transaction) {
    return new Promise((resolve, reject) => {
      axios.patch(requestUrl() + '/transactions/' + transaction.id, transaction)
      .then(response => {
        resolve(new Transaction(response.data));
      })
      .catch(error => {
        reject(error.response.data.message);
      });
    });
  },

  get(id) {
    return new Promise((resolve, reject) => {
      axios.get(requestUrl() + '/transactions/' + id)
      .then(response => {
        resolve(new Transaction(response.data));
      })
      .catch(error => {
        reject(error.response.data.message);
      });
    });
  }
}
