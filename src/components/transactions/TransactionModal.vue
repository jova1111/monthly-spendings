<template>
  <modal @close="$emit('close')">
    <template slot="header">
      <h3>Transactions for category: {{ categoryName }}</h3>
    </template>

    <template slot="body">
       <transaction-table :transactions="filteredTransactions"
        :showActionControls="true"
        :showingInModal="true">
        </transaction-table>
    </template>
  </modal>
</template>

<script>
  import TransactionTable from './TransactionTable';
  import Modal from '../utils/Modal';

  export default {
    computed: {
      filteredTransactions() {
        return this.transactionList.filter(
          transaction => transaction.category.name == this.categoryName
        );
      }
    },

    components: {
      'transaction-table': TransactionTable,
      'modal': Modal
    },

    props: {
      categoryName: String,
      transactions: Array
    },

    data() {
      return {
        transactionList: []
      };
    },

    created() {
      this.transactionList = this.transactions;
    }
  };
</script>
