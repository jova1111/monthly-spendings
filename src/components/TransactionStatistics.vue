<template>
    <div class="container-fluid">
        
        <div class="centerOnMiddle">
            
                <select class="moveToLeft" v-model="selectedYear" v-on:change="getTransactionsForYear(selectedYear)">
                    <option v-for="singleYear of allYears" :key="singleYear"> {{singleYear}} </option>
                </select>
            <div>
                <table id="transactions">
                    <tr>
                        <th>Month</th>
                        <th class="money-spent">Total Money spent</th>
                    </tr>
                    <tr v-for="(month_name, index) of month_names" :key="month_name" v-if="transactionList[index] != 0" @click="getTransactionsForMonth(index+1,selectedYear)">
                        <td>{{ month_name }}</td>
                        <td>{{ transactionList[index] }}</td>
                    </tr>
                </table>
            </div>
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
            transaction: new Transaction(),
            transactionList: []
        }
    },
    mounted()
    {
        this.getTransactionsForYear(moment(Date.now()).format('YYYY'));
        this.getAllYears();
    },
    methods: 
    {
        getTransactionsForYear(yearToSend)
        {
            transactionService.getTransactionsForYear(yearToSend)
                .then(response=>{
                    console.log('trans list after response',response);
                    this.transactionList = response;
                }).catch(error=>{
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
.dropbtn 
{
    background-color: #4CAF50;
    color: white;
    padding: 16px;
    font-size: 16px;
    border: none;
}
.dropdown
{
    position: relative;
    display: inline-block;
}
.dropdown-content 
{
    display: none;
    position: absolute;
    background-color: #f1f1f1;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
}
.dropdown-content a 
{
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
}
.dropdown-content a:hover {background-color: #ddd;}
.dropdown:hover .dropdown-content {display: block;}
.dropdown:hover .dropbtn {background-color: #3e8e41;}
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

.moveToLeft{
    margin-left:0%;
}

#transactions th 
{
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: rgb(124, 124, 225);
    color: white;
}
</style>
