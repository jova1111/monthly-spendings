<template>
    <div class="container-fluid">
        <div class="centerOnMiddle">
            <div>
                <table id="transactions">
                    <tr>
                        <th class="transaction-date">Date</th>
                        <th class="description">Description</th>
                        <th class="money-spent">Money spent</th>
                    </tr>
                    <tr v-for="transObj in transactionList" v-bind:key="transObj.id">
                        <td>{{transObj.date}}</td>
                        <td>{{transObj.description}}</td>
                        <td>{{transObj.moneyspent}}</td>
                    </tr>
                    <tr v-if="isCurrentMonth">
                        <td>New transaction</td>
                        <td><input @keyup.enter="createTransaction" type="text" class="form-control" placeholder="Description of new transaction" v-model="transaction.description"></td>
                        <td><input @keyup.enter="createTransaction" type="text" class="form-control" placeholder="$$" v-model="transaction.moneyspent"></td>
                    </tr> <button  v-if="isCurrentMonth" @click.prevent="createTransaction" class="btn btn-primary">Add transaction</button>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import transactionService from '../services/transaction-service'
import {Transaction} from '../models/transaction'
import moment from 'moment'
export default 
{
    name: 'TransactionView',
    data()
    {
        return{
            isCurrentMonth: false,
            transaction: new Transaction(),
            transactionList: []
        }
    },
    mounted()
    {
        this.getTransactionsForMonth();
    },
    methods: 
    {
        createTransaction()
        {
            transactionService.crateTransaction(this.transaction)
                .then(response=>
                {
                    this.transaction.data='';
                    this.transaction.moneyspent='';
                    this.transactionList.push(response);
                    alert('Created');
                }).catch(error=>
                {
                    alert(error);
                });
        },
        getTransactionsForMonth()
        {
            let monthToCheck = moment(Date.now()).format('M');
            let yearToCheck = moment(Date.now()).format('YYYY');
            let yearToSend = this.$route.params.Year;
            let monthToSend = this.$route.params.Month;
            this.isCurrentMonth=(monthToCheck == monthToSend && yearToCheck == yearToSend);
            transactionService.getTransactionsForMonth(monthToSend,yearToSend)
                .then(response=>
                {
                    this.transactionList = response;
                }).catch(error=>
                {
                    alert(error);
                });
        }
    }
}
</script>
<style scoped>
.transaction-date
{
    width: 120px;
    max-width: 150px;
}
.money-spent
{
     text-align: center;
     width: 20%;
     min-width: 100px;
 }
.description
{
    width: 80%;
    min-width: 250px;
}
.centerOnMiddle
{
    width: 60%;
    margin-left: auto;
    margin-right: auto;
    /*position: fixed;
    left: 50%;
    /* bring your own prefixes 
    transform: translate(-50%, 0%);*/
}
#transactions 
{
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
}

#transactions td, #transactions th 
{
    border: 2px solid rgb(202, 202, 202);
    padding: 8px;
}

#transactions tr:nth-child(odd){background-color: rgb(240, 240, 255);}
#transactions tr:nth-child(even){background-color: rgb(222, 222, 255);}

#transactions tr:hover {background-color: rgb(190, 190, 255);}

#transactions th 
{
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: rgb(124, 124, 225);
    color: white;
}
</style>
