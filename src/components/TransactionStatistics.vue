<template>
    <div class="container-fluid">
        <div class="centerOnMiddle">
            <div>
                <select class="move-lo-left" v-model="selectedYear" v-on:change="getTransactionsForYear(selectedYear)">
                    <option v-for="singleYear of allYears" :key="singleYear"> {{singleYear}} </option>
                </select>
            </div>
                <table id="transactions">
                    <tr>
                        <th>Month</th>
                        <th class="money-spent">Total Money spent</th>
                    </tr>
                        <tr v-for="(month_name, index) of month_names" :key="month_name" v-if="isCurrentYear(transactionList[12-index])" @click="getTransactionsForMonth(12-index,selectedYear)">
                            <td>{{ month_names_reversed[index] }}</td>
                            <td>{{ transactionList[index-12] }}</td>
                        </tr>
                        <tr v-for="(month_name, index) of month_names" :key="month_name" v-if="isNotCurrentYear(transactionList[index])" @click="getTransactionsForMonth(index+1,selectedYear)">
                            <td>{{ month_name }}</td>
                            <td>{{ transactionList[index] }}</td>
                        </tr>
                </table>
        </div>
    </div>
</template>

<script>
import transactionService from '../services/transaction-service'
import {Transaction} from '../models/transaction'
import moment from 'moment'
import VueRouter from 'vue-router'

export default {
    name: 'TransactionView',
    props: ['Year','Month'],
    data()
    {
        return {
            selectedYear:2018,
            allYears: [],
            singleYear: '',
            yearToSend: '',
            monthToSend: '',
            month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            month_names_reversed: ['December', 'November', 'October', 'September', 'August', 'July', 'June', 'May', 'April', 'March', 'February', 'January'],
            transaction: new Transaction(),
            transactionList: []
        }
    },
    mounted()
    {
        this.selectedYear = moment(Date.now()).format('YYYY');
        this.getTransactionsForYear(selectedYear);
        this.getAllYears();
    },
    methods: 
    {
        isCurrentYear(value) {
           return (this.selectedYear == moment(Date.now()).format('YYYY') && value != 0);
        },
        isNotCurrentYear(value) {
           return (this.selectedYear != moment(Date.now()).format('YYYY') && value != 0);
        },
        getTransactionsForYear(yearToSend) {
            transactionService.getTransactionsForYear(yearToSend)
                .then(response=> {
                    this.transactionList = response;
                }).catch(error=> {
                    alert(error);
                });
        },
        getTransactionsForMonth(monthToSend, yearToSend)
        {
            this.$router.push({ name: 'TransactionView', params: {Month: monthToSend, Year: yearToSend }})
        },
        getAllYears()
        {
            transactionService.getAllYears()
                .then(response=>
                {
                    if (response.length == 1 && response[0]<2000) this.$router.push({ name: 'TransactionView', params: {Month: moment(Date.now()).format('M'), Year: moment(Date.now()).format('YYYY') }});
                    this.allYears=response[0];
                }).catch(error=>
                {
                    alert(error);
                    this.$router.push({ name: 'TransactionView', params: {Month: moment(Date.now()).format('M'), Year: moment(Date.now()).format('YYYY') }});
                });
        }
    }
}
</script>

<style scoped>
.move-lo-left{
    position:relative;
    left: 50%;
    transform: translate(-50%, 0%);
}
.money-spent
{
     text-align: center;
     width: 40%;
     min-width: 150px;
 }
.centerOnMiddle
{
    width: 50%;
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
