<template>
    <div>
        <table class="transactions">
            <tr class="table-header" @click="visible = !visible">
                <th class="transaction-date">Date</th>
                <th class="description">Description</th>
                <th class="description">Category</th>
                <th class="money-spent">Money spent</th>
            </tr>
            <tr id="new-transaction" v-if="showActionControls && visible">
                <td>New transaction</td>
                <td><input ref="descriptionInput" v-autofocus @keyup.enter="createTransaction" type="text" class="form-control" placeholder="Description of new transaction..." v-model="transaction.description"></td>
                <td>
                    <div class="category-container">
                        <model-select class="inline" :options="categoryValues"
                                    v-model="transaction.category.id"
                                    placeholder="Select item...">
                        </model-select>
                        <button id="show-modal" class="violet" @click="showNewCategoryModal = true">+</button>
                    </div>
                </td>
                <td><input @keyup.enter="createTransaction" type="text" class="form-control" placeholder="$$" v-model="transaction.moneyspent"></td>
            </tr>
            <tr v-for="transObj in sortedTransList" v-bind:key="transObj.id" v-if="visible">
                <td>{{ transObj.date | toLocalDate }}</td>
                <td>{{ transObj.description }}</td>
                <td>{{ transObj.category.name }}</td>
                <td>{{ transObj.moneyspent }}</td>
                <td v-if="showActionControls"><input type="button" class="violet" value="x" @click="deleteTransaction(transObj.id)"></td>
            </tr>
        </table>
        <category-form-modal v-if="showNewCategoryModal" @created="addCategoryFromModal" @close="showNewCategoryModal = false"></category-form-modal>
    </div>
</template>

<script>
    import transactionService from '../services/transaction-service';
    import LoadingSpinner from './LoadingSpinner';
    import CategoryForm from './CategoryForm';
    import { Transaction } from '../models/transaction';
    import { ModelSelect } from 'vue-search-select';

    export default {
        filters: {
            toLocalDate: function (value) {
                if (!value) return ''
                let date = new Date(value);
                return date.toLocaleDateString('en-GB');
            }
        },

        components: {
            'category-form-modal': CategoryForm,
            'spinner': LoadingSpinner,
            'model-select': ModelSelect
        },

        props: {
            'transactions': Array,
            'categories': Array,
            'showActionControls': Boolean
        },

        created() {
            this.transactionList = this.transactions;
            this.categoryList = this.categories;
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

            categoryValues: function() {
                console.log('before map', this.categories)
                let retVal = this.categories.map(category => {
                    return {
                        value: category.id,
                        text: category.name
                    }
                });
                console.log('after map', retVal)

                let noCategory = retVal.filter(el => el.text == 'No category');
                if(noCategory.length > 0)
                { 
                    this.transaction.category.id = noCategory[0].value;
                }

                return retVal;
                
            }
        },

        data() {
            return {
                transaction: new Transaction(),
                transactionList: [],
                isCurrentMonth: true,
                isLoaded: false,
                showNewCategoryModal: false,
                visible: true,
                processStartEventName: 'started-processing',
                processFinishEventName: 'finished-processing'
            }
        },

        methods: {
             createTransaction() {
                this.$refs.descriptionInput.focus();
                this.$emit(this.processStartEventName);
                transactionService.createTransaction(this.transaction)
                    .then(response =>
                    {
                        this.transaction.description='';
                        this.transaction.moneyspent='';
                        this.transactionList.push(response);
                        this.$emit('updated',  this.transactionList);
                        this.$emit(this.processFinishEventName);
                        this.$nextTick(() => {
                            this.$refs.descriptionInput.focus();
                        });
                    }).catch(error=>
                    {
                        alert(error);
                        this.$emit(this.processFinishEventName);
                    });
            },
            deleteTransaction(id) {
                if (!confirm('Are you sure you want to delete this transaction?')) {
                    return;
                }
                this.$emit(this.processStartEventName);
                transactionService.delete(id)
                    .then(response => {
                        this.transactionList = this.transactionList.filter(transaction => transaction.id != id);
                        this.$emit('updated', this.transactionList);
                        this.$emit(this.processFinishEventName);
                    })
                    .catch(error => {
                        alert(error);
                        this.$emit(this.processFinishEventName);
                    });
            },

            addCategoryFromModal(category) {
                this.categories.push(category);
                this.transaction.category.id = category.id;
                this.$refs.descriptionInput.focus();
                this.showNewCategoryModal = false;
            }
        }
    }
</script>

<style scoped>
    .transactions {
        font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;
    }

    .transactions td, .transactions th {
        border: 2px solid rgb(202, 202, 202);
        padding: 8px;
    }

    .transactions tr:nth-child(odd){background-color: rgb(240, 240, 255);}

    .transactions tr:nth-child(even){background-color: rgb(222, 222, 255);}

    .transactions tr:first-child {background-color: rgb(124, 124, 225)}

    .transactions tr:hover {background-color: rgb(190, 190, 255);}

    .table-header:hover {
        background-color: rgb(100, 100, 200) !important;
        cursor: pointer;
    }

    .table-header {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: rgb(124, 124, 225);
        color: white;
    }

    #new-transaction {
        width: 100%;
    }

    .small-form-control {
        display: inline;
        width: 200px;
    }

    .description {
        width: 70%;
        min-width: 250px;
    }

    .money-spent{
        text-align: center;
        width: 20%;
        min-width: 100px;
    }

    .violet {
        background-color: rgb(124, 124, 225);
        color: white;
        border-radius: 35%;
        border: 1px solid gray;
    }

    .category-container { 
        display: flex;
        justify-content: space-around;
    }

    #show-modal {
        margin: 5px;
    }

</style>