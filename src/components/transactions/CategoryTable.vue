<template>
  <div>
    <table class="transactions">
      <tr class="table-header">
        <th>Category</th>
        <th>Money spent</th>
      </tr>
      <tr
        v-for="categorySpending in categorySpendings"
        v-bind:key="categorySpending.name"
        @click="showTransactionsForCategory(categorySpending.name)"
      >
        <td>{{ categorySpending.name }}</td>
        <td>{{ categorySpending.total | numberWithCommas }}</td>
      </tr>
    </table>
    <category-transactions
      v-if="showTransactionsModal"
      :categoryName="categoryName"
      :transactions="transactions"
      @close="showTransactionsModal = false"
    ></category-transactions>
  </div>
</template>

<script>
  import TransactionModal from './TransactionModal';

  export default {
    props: {
      transactions: Array
    },

    components: {
      'category-transactions': TransactionModal
    },

    computed: {
      categorySpendings: function() {
        let result = [];
        this.transactions.reduce(function(res, value) {
          let categoryName = value.category.name;

          if (!res[categoryName]) {
            res[categoryName] = {
              total: 0,
              name: categoryName
            };
            result.push(res[categoryName]);
          }
          res[categoryName].total += value.amount;
          return res;
        }, {});

        result.sort((a, b) => {
          return b.total - a.total;
        });

        return result;
      }
    },

    data() {
      return {
        categoryName: '',
        showTransactionsModal: false
      };
    },

    methods: {
      showTransactionsForCategory(categoryName) {
        this.categoryName = categoryName;
        this.showTransactionsModal = true;
      }
    }
  };
</script>
