<template>
    <div v-if="isLoaded" class="container-fluid">
        <div class="centerOnMiddle">
            <div>
                <table id="transactions">
                    <tr>
                        <th class="transaction-date">Date</th>
                        <th class="description">Description</th>
                        <th class="description">Category</th>
                        <th class="money-spent">Money spent</th>
                    </tr>
                    <tr id="new-transaction" v-if="isCurrentMonth">
                        <td>New transaction</td>
                        <td><input @keyup.enter="createTransaction" type="text" class="form-control" placeholder="Description of new transaction" v-model="transaction.description"></td>
                        <td>
                            <select v-model="transaction.category.id">
                                <option :value="-1" selected>No category</option>
                                <option :value="category.id" v-bind:key="category.id" v-for="category in categories">{{ category.name }}</option> 
                            </select>
                            <button id="show-modal" @click="showNewCategoryModal = true">+</button>
                        </td>
                        <td><input @keyup.enter="createTransaction" type="text" class="form-control" placeholder="$$" v-model="transaction.moneyspent"></td>
                    </tr>
                    <tr v-for="transObj in sortedTransList" v-bind:key="transObj.id">
                        <td>{{transObj.date}}</td>
                        <td>{{transObj.description}}</td>
                        <td v-if="transObj.category">{{ transObj.category.name }}</td>
                        <td v-else>No category</td>
                        <td>{{transObj.moneyspent}}</td>
                    </tr>
                    <tr>
                        <td>Money spent:</td>
                        <td colspan="3">{{ this.totalMoneySpent }}</td>
                    </tr>
                </table>
                <category-form-modal v-if="showNewCategoryModal" @created="addCategoryFromModal" @close="showNewCategoryModal = false"></category-form-modal>
            </div>
        </div>
    </div>
</template>
<script>
import transactionService from '../services/transaction-service'
import {Transaction} from '../models/transaction'
import VueRouter from 'vue-router'
import moment from 'moment'
import CategoryForm from './CategoryForm'
import categoryService from '../services/category-service'
 
export default 
{
    components: {
        'category-form-modal': CategoryForm
    },
    name: 'TransactionView',
    data()
    {
        return {
            yearToSend: 0,
            monthToSend: 0,
            isCurrentMonth: false,
            transaction: new Transaction(),
            transactionList: [],
            categories: [],
            showNewCategoryModal: false,
            isLoaded: false
        }
    },
    computed: {
        sortedTransList: function() {
            function compare(a, b) {
                if (a.id > b.id)
                    return -1;
                if (a.id < b.id)
                    return 1;
                return 0;
            }
            return this.transactionList.sort(compare);
        },

        totalMoneySpent: function() {
            return this.transactionList.map(transaction => transaction.moneyspent).reduce((a, b) => a + b, 0);
        }
    },
    mounted()
    {
        this.getTransactionsForMonth();
        this.getCategories();
        console.log("sortedTransList:",this.sortedTransList);
        console.log("transList:",this.transactionList);
    },
    
    methods: 
    {
        createTransaction()
        {
            transactionService.crateTransaction(this.transaction)
                .then(response =>
                {
                    this.transaction.description='';
                    this.transaction.moneyspent='';
                    this.transactionList.push(response);
                    this.$router.push({ name: 'TransactionView', params: {Month: this.monthToSend, Year: this.yearToSend }})
                }).catch(error=>
                {
                    alert(error);
                });
        },
        getTransactionsForMonth()
        {
            let monthToCheck = moment(Date.now()).format('M');
            let yearToCheck = moment(Date.now()).format('YYYY');
            this.yearToSend = this.$route.params.Year;
            this.monthToSend = this.$route.params.Month;
            console.log("yearToSend: ",this.yearToSend, "   monthToSend: ",this.monthToSend);
            this.isCurrentMonth=(monthToCheck == this.monthToSend && yearToCheck == this.yearToSend);
            transactionService.getTransactionsForMonth(this.monthToSend,this.yearToSend)
                .then(response=>
                {
                    this.transactionList = response;
                }).catch(error=>
                {
                    alert(error);
                });
        },

        getCategories() {
            categoryService.getAll()
                .then(response => {
                    this.categories = response;
                    this.isLoaded = true;
                })
                .catch(error => {
                    alert(error);
                    this.isLoaded = true;
                });
        },

        addCategoryFromModal(category) {
            this.categories.push(category);
            this.showNewCategoryModal = false;
        }
    }
}
</script>
<style scoped>
.transaction-date
{
    width: 160px;
    max-width: 200px;
}
.money-spent
{
     text-align: center;
     width: 20%;
     min-width: 100px;
 }
.description
{
    width: 70%;
    min-width: 250px;
}
.centerOnMiddle
{
    width: 80%;
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
#new-transaction {
    width: 100%;
}
</style>
