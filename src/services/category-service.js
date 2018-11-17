import axios from 'axios'
import { requestUrl } from '../constants/const'

export default {
    getAll() {
        let parsedToken = JSON.parse(localStorage.getItem('AuthenticationToken'));
        return new Promise((resolve, reject) => {
            axios.get(requestUrl + '/transaction_categories', { headers: { 'Authorization': 'Bearer ' + parsedToken.value }})
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    create(name) {
        let parsedToken = JSON.parse(localStorage.getItem('AuthenticationToken'));
        return new Promise((resolve, reject) => {
            axios.post(requestUrl + '/transaction_categories', { name }, { headers: { 'Authorization': 'Bearer ' + parsedToken.value }})
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}