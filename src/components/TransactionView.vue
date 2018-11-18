<template>
    <div v-if="isLoaded" class="container-fluid">
        <div class="centerOnMiddle">
            <div>
                <table class="transactions">
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
                            <select class="form-control smallFormControl" v-model="transaction.category.id">
                                <option :value="-1" selected>No category</option>
                                <option :value="category.id" v-bind:key="category.id" v-for="category in categories">{{ category.name }}</option> 
                            </select>
                            <button id="show-modal" @click="showNewCategoryModal = true">+</button>
                        </td>
                        <td><input @keyup.enter="createTransaction" type="text" class="form-control" placeholder="$$" v-model="transaction.moneyspent"></td>
                    </tr>
                    <tr v-for="transObj in sortedTransList" v-bind:key="transObj.id">
                        <td>{{ transObj.date | toLocalDate }}</td>
                        <td>{{transObj.description}}</td>
                        <td v-if="transObj.category">{{ transObj.category.name }}</td>
                        <td v-else>No category</td>
                        <td>{{transObj.moneyspent}}</td>
                        <td><input type="button" value="x" @click="deleteTransaction(transObj.id)"></td>
                    </tr>
                </table>
                <category-form-modal v-if="showNewCategoryModal" @created="addCategoryFromModal" @close="showNewCategoryModal = false"></category-form-modal>
                <br>
                <table class="transactions centerOnMiddle">
                    <tr>
                        <th>Category</th>
                        <th>Money spent</th>
                    </tr>
                    <tr v-for="categorySpending in categorySpendings" v-bind:key="categorySpending.name">
                        <td>{{ categorySpending.name }}</td>
                        <td>{{ categorySpending.total }}</td>
                    </tr>
                </table>
                <br>
                <table class="transactions centerOnMiddle">
                    <tr>
                        <th>Money to spend</th>
                        <th>Money spent</th>
                        <th>Money left</th>
                    </tr>
                    <tr>
                        <td @click="editingMoneyToSpend = true" v-if="!editingMoneyToSpend">{{ moneyToSpend }}</td>
                        <td v-else @keyup.enter="editMoneyToSpend"><input type="text" v-model="moneyToSpend" class="form-control smallFormControl"></td>
                        <td>{{ totalMoneySpent }}</td>
                        <td>{{ moneyLeft }}</td>
                    </tr>
                </table>
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
import LoadingSpinner from './LoadingSpinner'
 
export default 
{
    components: {
        'category-form-modal': CategoryForm,
        'spinner': LoadingSpinner
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
            areTransactionsLoaded: false,
            areCategoriesLoaded: false,
            isMoneyToSpendLoaded: false,
            moneyToSpend: 0,
            editingMoneyToSpend: 0
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
        },

        categorySpendings: function() {
            let result = [];
            this.transactionList.reduce(function (res, value) {
                let categoryName;
                if(!value.category) {
                    categoryName = "No category";
                } else {
                    categoryName = value.category.name;
                }
                if (!res[categoryName]) {
                    res[categoryName] = {
                        total: 0,
                        name: categoryName
                    };
                    result.push(res[categoryName]);
                }
                res[categoryName].total += value.moneyspent;
                return res;
            }, {});
            console.log('result', result)
            return result;
        },

        moneyLeft: function() {
            return this.moneyToSpend - this.totalMoneySpent >= 0 ? this.moneyToSpend - this.totalMoneySpent : 0
        },

        isLoaded: {
            set: function (newValue) {
                return false;
            },

            get: function() {
                return this.areTransactionsLoaded && this.areCategoriesLoaded && this.isMoneyToSpendLoaded;
            }
        }
    },
    filters: {
        toLocalDate: function (value) {
            if (!value) return ''
            let date = new Date(value);
            return date.toLocaleDateString('en-GB');
        }
    },
    mounted()
    {
        this.getTransactionsForMonth();
        this.getCategories();
        this.getMoneyToSpend();
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

        deleteTransaction(id) {
            if (!confirm('Are you sure you want to delete this transaction?')) {
                return;
            }
            transactionService.delete(id)
                .then(response => {
                    this.transactionList = this.transactionList.filter(transaction => transaction.id != id);
                })
                .catch(error => {
                    alert(error);
                });
        },

        getTransactionsForMonth()
        {
            let monthToCheck = moment(Date.now()).format('M');
            let yearToCheck = moment(Date.now()).format('YYYY');
            if (!this.$route.params.Year || !this.$route.params.Month) {
                this.yearToSend = localStorage.getItem('yearToSend');
                this.monthToSend = localStorage.getItem('monthToSend');
            } 
            else {
                this.yearToSend = this.$route.params.Year;
                this.monthToSend = this.$route.params.Month;
                localStorage.setItem('yearToSend', this.yearToSend);
                localStorage.setItem('monthToSend', this.monthToSend);
            }
            console.log("yearToSend: ",this.yearToSend, "   monthToSend: ",this.monthToSend);
            this.isCurrentMonth=(monthToCheck == this.monthToSend && yearToCheck == this.yearToSend);
            transactionService.getTransactionsForMonth(this.monthToSend,this.yearToSend)
                .then(response =>
                {
                    this.transactionList = response;
                    this.areTransactionsLoaded = true;
                }).catch(error=>
                {
                    alert(error);
                });
        },

        getCategories() {
            categoryService.getAll()
                .then(response => {
                    this.categories = response;
                    this.areCategoriesLoaded = true;
                })
                .catch(error => {
                    alert(error);
                    this.areCategoriesLoaded = true;
                });
        },

        addCategoryFromModal(category) {
            this.categories.push(category);
            this.showNewCategoryModal = false;
        },

        getMoneyToSpend() {
            transactionService.getMoneyPerMonth(this.monthToSend, this.yearToSend)
                .then(value => {
                    this.moneyToSpend = value;
                    this.isMoneyToSpendLoaded = true;
                })
                .catch(error => {
                    alert(error);
                })
        },

        editMoneyToSpend() {
            if(this.moneyToSpend == 0) {
                this.editingMoneyToSpend = false;
                return;
            }

            transactionService.editMoneyPerMonth(this.moneyToSpend)
                .then(succes => {
                    this.editingMoneyToSpend = false;
                })
                .catch(error => {
                    alert(error);
                });
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
.transactions 
{
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
}

.transactions td, .transactions th 
{
    border: 2px solid rgb(202, 202, 202);
    padding: 8px;
}

.transactions tr:nth-child(odd){background-color: rgb(240, 240, 255);}
.transactions tr:nth-child(even){background-color: rgb(222, 222, 255);}

.transactions tr:hover {background-color: rgb(190, 190, 255);}

.transactions th 
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

.hiddenField {
    background-color: white !important;
    border-left: 0px solid white !important;
    border-bottom: 0px solid white !important
}

.smallFormControl {
    display: inline;
    width: 200px;
}
</style>
