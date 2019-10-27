<template>
    <div>
        <table class="transactions">
            <tr class="table-header">
                <th>Money to spend</th>
                <th>Money spent</th>
                <th>Money left</th>
            </tr>
            <tr>
                <td style="cursor:pointer" @click="editable ? editing = true : editing = false" v-if="!editing"><a>{{ moneyToSpend }}</a></td>
                <td v-else @keyup.esc="returnOldMoneyToSpend" @keyup.enter="editMoneyToSpend"><input v-autofocus type="text" v-model="moneyToSpend" placeholder="Enter value..." class="form-control small-form-control"></td>
                <td>{{ totalMoneySpent }}</td> 
                <td>{{ moneyToSpend - totalMoneySpent }}</td>
            </tr>
        </table>
    </div>
</template>

<script>
    import transactionService from '../services/transaction-service';

    export default {
        props: {
            'transactions': Array,
            'money': Array,
            'editable': Boolean
        },
        
        computed: {
            totalMoneySpent: function() {
                return this.transactions.map(transaction => transaction.moneyspent).reduce((a, b) => a + b, 0);
            }
        },

        data() {
            return {
                editing: false,
                moneyToSpend: 0,
                processStartEventName: 'started-processing',
                processFinishEventName: 'finished-processing'
            }
        },

        created() {
            if (this.money.length > 0) {
                 this.moneyToSpend = this.money[0].value;
            }
        },

        methods: {
            editMoneyToSpend() {
                this.$emit(this.processStartEventName);

                transactionService.editMoneyPerMonth(this.moneyToSpend)
                    .then(succes => {
                        this.editing = false;
                        this.$emit(this.processFinishEventName);
                    })
                    .catch(error => {
                        alert(error);
                        this.$emit(this.processFinishEventName);
                    });
            },

            returnOldMoneyToSpend() {
                this.moneyToSpend = this.money;
                this.editing = false;                                                                                   
            }
        }
    }
</script>

<style scoped>
    .transactions {
        font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 2em;
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

    .small-form-control {
        display: inline;
        width: 200px;
    }
</style>

