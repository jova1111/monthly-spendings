<template>
  <div>
    <div v-if="isPageLoaded" v-bind:class="{ hidden: isLoading }">
      <div class="centered">
        <transaction-table
          :categories="categories"
          :transactions="transactions"
          :showActionControls="isCurrentMonth"
          @started-processing="isLoading = true"
          @finished-processing="isLoading = false"
          @updated="handleTransactionTableUpdate">
        </transaction-table>
        <br>

        <category-table :transactions="transactions"></category-table>
        <br>

        <money-to-spend-table
          :transactions="transactions"
          :editable="isCurrentMonth"
          :money="moneyToSpend"
          @started-processing="isLoading = true"
          @finished-processing="isLoading = false">
        </money-to-spend-table>
      </div>
      <router-link
          style="margin-top: 5px"
          class="btn move-to-right violet"
          to="/statistics"
          tag="button"
        >Statistics</router-link>
    </div>
    <spinner v-if="!isPageLoaded || isLoading"></spinner>
  </div>
</template>

<script>
  import LoadingSpinner from '@/components/utils/LoadingSpinner';
  import TransactionTable from '@/components/transactions/TransactionTable';
  import CategoryTable from '@/components/transactions/CategoryTable';
  import MoneyToSpendTable from '@/components/transactions/MoneyToSpendTable';
  import categoryService from '@/services/category-service';
  import transactionService from '@/services/transaction-service';
  import plannedMonthlyMoneyService from '@/services/planned-monthly-money-service';
  import VueRouter from 'vue-router';

  export default
  {
    components: {
      'spinner': LoadingSpinner,
      'transaction-table': TransactionTable,
      'category-table': CategoryTable,
      'money-to-spend-table': MoneyToSpendTable
    },

    name: 'TransactionView',

    data()
    {
      return {
        moneyToSpend: null,
        isCurrentMonth: false,
        transactions: [],
        categories: [],
        isPageLoaded: false,
        isLoading: false
      }
    },

    mounted()
    {
      let date = new Date();
      let selectedYear = this.$route.params.year;
      let selectedMonth = this.$route.params.month;
      if (!selectedYear || !selectedMonth) {
          selectedYear = localStorage.getItem('selectedYear');
          selectedMonth = localStorage.getItem('selectedMonth');
      }
      else {
          localStorage.setItem('selectedYear', selectedYear);
          localStorage.setItem('selectedMonth', selectedMonth);
      }
      this.isCurrentMonth = (date.getUTCMonth() + 1 == selectedMonth && date.getUTCFullYear() == selectedYear);

      let firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
      let lastDayOfMonth =  new Date(selectedYear, selectedMonth, 0);
      Promise.all([
        transactionService.getAll(firstDayOfMonth, lastDayOfMonth),
        categoryService.getAll(),
        plannedMonthlyMoneyService.getAll(firstDayOfMonth, lastDayOfMonth)])
        .then(responses => {
          this.transactions = responses[0];
          this.categories = responses[1];
          this.moneyToSpend = responses[2][0];
          this.isPageLoaded = true;
        })
        .catch(error => {
          this.$toasted.error(error);
        });
    },

    methods:
    {
      handleTransactionTableUpdate(transactionList, categoryList = null) {
        this.transactions = transactionList;
        if (categoryList) {
          this.categories = categoryList;
        }
      }
    }
  }
</script>

<style scoped>
  .centered {
    width: 85%;
    margin-left: auto;
    margin-right: auto;
  }

  .hidden {
    display: hidden
  }
</style>
