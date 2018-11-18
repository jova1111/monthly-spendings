import axios from 'axios'
import { Transaction } from '../models/transaction'
import { requestUrl } from '../constants/const'
import moment from 'moment'
export default 
{
    crateTransaction(transaction)
    {
        return new Promise((resolve, reject)=>
        {
            let parsedToken = JSON.parse(localStorage.getItem('AuthenticationToken'));
            axios.post(requestUrl() + '/transactions',transaction, 
            {
                headers: 
                {
                    Authorization: 'Bearer ' + parsedToken.value
                }
            })
            .then((response)=> 
            {
                let newTransObj = new Transaction(response.data);
                resolve(newTransObj);
            })
            .catch((error)=> 
            {
                reject(error);
            });
        })
    },
    
    delete(id) {
        return new Promise((resolve, reject) => {
            let parsedToken = JSON.parse(localStorage.getItem('AuthenticationToken'));
            axios.delete(requestUrl() + '/transactions/' + id, { headers: { Authorization: 'Bearer ' + parsedToken.value }})
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    getTransactionsForMonth(indexM, indexY)
    {
        return new Promise((resolve, reject)=>
        {
            let parsedToken = JSON.parse(localStorage.getItem('AuthenticationToken'));
            axios.get(requestUrl() + '/view/transactions',
            {
                params: 
                {
                    Year: indexY,
                    Month: indexM
                  },
                headers: 
                {
                    Authorization: 'Bearer ' + parsedToken.value
                }
            })
            .then((response)=> 
            {
                let transList = [];
                for(let transObj of response.data)
                {
                    transList.push(new Transaction(transObj));
                }
                resolve(transList);
            })
            .catch((error)=> 
            {
                reject(error);
            });
        })
    },

    getAllYears()
    {
        return new Promise((resolve, reject)=>
        {
            let parsedToken = JSON.parse(localStorage.getItem('AuthenticationToken'));
            axios.get(requestUrl() + '/transactions/getYears',
            {
                headers: 
                {
                    Authorization: 'Bearer ' + parsedToken.value
                }
            })
            .then((response)=> 
            {
                let yearList = [];

                yearList.push(response.data);
                resolve(yearList);
            })
            .catch((error)=> 
            {
                reject(error);
            });
        })
    },

    getTransactionsForYear(yearToSend)
    {
        return new Promise((resolve, reject)=>
        {
            let parsedToken = JSON.parse(localStorage.getItem('AuthenticationToken'));
            axios.get(requestUrl() + '/transactions',
            {
                params: 
                {
                    Year: yearToSend
                }
                ,              
                headers: 
                {
                    Authorization: 'Bearer ' + parsedToken.value
                }
            })
            .then((response)=> 
            {
                let transList = [];
                let spentPerMonth = 0;
                for (let i=1; i<13; i++)
                {
                    for (let transObj of response.data)
                    {
                        if (i == moment(transObj.created_at).format('M') && yearToSend == moment(transObj.created_at).format('YYYY'))
                        {
                            spentPerMonth += transObj.moneyspent;
                        }
                    }
                    transList.push(spentPerMonth);
                    spentPerMonth = 0;
                }
                resolve(transList);
            })
            .catch((error)=> 
            {
                reject(error);
            });
        })
    },
    getMoneyPerMonth(month, year) {
        return new Promise((resolve, reject) => {
            let parsedToken = JSON.parse(localStorage.getItem('AuthenticationToken'));
            axios.get(requestUrl() + '/transactions/money_per_month', { 
                params: { 
                    Year: year ,
                    Month: month
                },
                headers: { 
                        Authorization: 'Bearer ' + parsedToken.value }
                })
                .then(response => {
                    resolve(response.data.value);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    editMoneyPerMonth(value) {
        return new Promise((resolve, reject) => {
            let parsedToken = JSON.parse(localStorage.getItem('AuthenticationToken'));
            axios.put(requestUrl() + '/transactions/money_per_month', { value }, { headers: { Authorization: 'Bearer ' + parsedToken.value }})
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}