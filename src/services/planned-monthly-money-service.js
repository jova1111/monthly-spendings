import { PlannedMonthlyMoney } from '@/models/planned-monthly-money';
import axios from 'axios';
import {
  requestUrl
} from '../constants/const';

export default {
  getAll(startDate, endDate) {
    return new Promise((resolve, reject) => {
      axios.get(requestUrl() + '/planned-monthly-spendings', {
          params: {
            startDate,
            endDate
          }
        })
        .then(response => {
          let plannedMoneyList = [];
          for (let plannedMoney of response.data) {
            plannedMoneyList.push(new PlannedMonthlyMoney(plannedMoney));
          }
          resolve(plannedMoneyList);
        })
        .catch(error => {
          reject(error.response.data.message);
        });
    });
  },

  create(plannedMoney) {
    return new Promise((resolve, reject) => {
      axios.post(requestUrl() + '/planned-monthly-spendings', plannedMoney)
        .then(response => {
          resolve(new PlannedMonthlyMoney(response.data));
        })
        .catch(error => {
          reject(error.response.data.message);
        });
    });
  },

  edit(plannedMoney) {
    return new Promise((resolve, reject) => {
      axios.patch(requestUrl() + '/planned-monthly-spendings/' + plannedMoney.id, plannedMoney)
        .then(response => {
          resolve(new PlannedMonthlyMoney(response.data));
        })
        .catch(error => {
          reject(error.response.data.message);
        });
    });
  },
}
