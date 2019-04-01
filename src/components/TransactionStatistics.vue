<template>
    <div v-if="isLoaded" class="container-fluid">
        <div class="centerOnMiddle">
            <div>
                <select class="select-year form-control move-to-right" v-model="selectedYear" v-on:change="getTransactionsForYear(selectedYear)">
                    <option v-for="singleYear of allYears" :key="singleYear"> {{singleYear}} </option>
                </select>
            </div>
            <table id="transactions">
                <tr>
                    <th>Month</th>
                    <th class="money-spent">Total Money spent</th>
                </tr>
                <tr v-for="filteredMonth of filteredMonths" :key="filteredMonth.month" @click="getTransactionsForMonth(filteredMonth.index, selectedYear)">
                    <td>{{ filteredMonth.month }}</td>
                    <td>{{ filteredMonth.moneySpent }}</td>
                </tr>
            </table>
            <router-link class="btn move-to-right violet" :to="'/statistics/' + selectedYear" tag="button">Statistics</router-link>
        </div>
    </div>
    <spinner v-else></spinner>
</template>

<script>
import transactionService from '../services/transaction-service'
import {Transaction} from '../models/transaction'
import moment from 'moment'
import VueRouter from 'vue-router'
import LoadingSpinner from './LoadingSpinner'

export default {
    components: {
        'spinner': LoadingSpinner
    },
    computed: {
        isLoaded: {
            set: function (newValue) {
                return false;
            },

            get: function() {
                return this.areTransactionsForYearLoaded && this.areAllYearsLoaded;
            }
        },
        filteredMonths: function() {
            let filteredMonthsList = [];
            let index = 0;
            for(index; index < 12; index++) {
                if(this.transactionList[index] != 0 || this.isCurrentMonth(this.monthNames[index])) {
                    
                    filteredMonthsList.push({
                        index: index + 1,
                        month: this.monthNames[index],
                        moneySpent: this.transactionList[index]    
                    });
                }
            }
            if((this.selectedYear == new Date().getFullYear())) {
                return filteredMonthsList.reverse();
            }
            return filteredMonthsList;
        }
    },
    name: 'TransactionStatistics',

    data()
    {
        return {
            selectedYear: 2018,
            allYears: [],
            singleYear: '',
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            transaction: new Transaction(),
            transactionList: [],
            areTransactionsForYearLoaded: false,
            areAllYearsLoaded: false
        }
    },
    mounted()
    {
        this.selectedYear = moment(Date.now()).format('YYYY');
        this.getTransactionsForYear(this.selectedYear);
        this.getAllYears();
    },
    methods: 
    {
        isCurrentYear(moneySpent) {
           return (this.selectedYear == moment(Date.now()).format('YYYY') && moneySpent != 0);
        },
        isCurrentMonth(currentMonthName) {
            return (currentMonthName == moment(Date.now()).format('MMMM') && this.selectedYear == new Date().getFullYear());
        },
        getTransactionsForYear(yearToSend) {
            transactionService.getTransactionsForYear(yearToSend)
                .then(response => {
                    this.transactionList = response;
                    this.areTransactionsForYearLoaded = true;
                }).catch(error => {
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
                .then(response =>
                {
                    if (response.length == 1 && response[0]<2000) {
                        this.$router.push({ name: 'TransactionView', params: { Month: moment(Date.now()).format('M'), Year: moment(Date.now()).format('YYYY') }});   
                    }
                    this.allYears=response[0];
                    this.areAllYearsLoaded = true;
                })
                .catch(error =>
                {
                    alert(error);
                });
        }
    }
}
</script>

<style scoped>
.move-to-right {
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

.violet {
    margin-top: 5px;
    background-color: rgb(124, 124, 225);
    color: white;
    border: 1px solid gray;
}

.select-year {
    width: 20%;
    position:relative;
    left: 90%;
    transform: translate(-50%, 0%);
    margin-bottom: 5px;
}
</style>
