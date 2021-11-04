<template>
  <div class="main-container" v-if="isLoaded">
    <label for="select-statistic-year">Statistics period:</label>
    <select
      id ="select-statistic-year"
      class="form-control center-middle"
      v-model="statisticsYear"
      v-on:change="changeStatisticsYear"
    >
      <option>All time</option>
      <option v-for="activeYear of activeYears" :key="activeYear">{{ activeYear }}</option>
    </select>

    <div class="general-statistics">
      <h4>Total spendings in this period: {{ totalSpendings }}</h4>
    </div>

    <div class="center-middle chart-container">
      <h2>Total monthly spendings</h2>
      <chart class="center-middle" :chart-data="spendingsGroupedByMonthChartData"></chart>
    </div>

    <div class="center-middle chart-container">
      <h2>Total monthly spendings by category</h2>
      <chart class="center-middle" :chart-data="spendingsGroupedByCategoryAndMonthChartData"></chart>
    </div>

    <category-table
      class="center-middle category-table"
      :transactions="allTransactionsForYear"
    ></category-table>
  </div>
  <spinner v-else></spinner>
</template>

<script>
  import transactionService from '@/services/transaction-service';
  import statisticService from '@/services/statistic-service';
  import userService from '@/services/user-service';
  import commonData from '@/mixins/common-data';
  import MonthlyDataChart from '@/components/statistics/MonthlyDataChart';
  import LoadingSpinner from '@/components/utils/LoadingSpinner';
  import CategoryTable from '@/components/transactions/CategoryTable';

  export default {
    components: {
      spinner: LoadingSpinner,
      chart: MonthlyDataChart,
      'category-table': CategoryTable
    },

    mixins: [ commonData ],

    computed: {
      totalSpendings: function() {
        return this.allTransactionsForYear.reduce((sum, transaction) => sum += transaction.amount, 0);
      },

      spendingsGroupedByCategoryAndMonthChartData: function() {
        let retVal = {};
        for (let categorySpendings of this.spendingsGroupedByCategoryAndMonth) {
          let categoryName = Object.keys(categorySpendings)[0];
          let monthlySpending = {};
          for (let i = 0; i < categorySpendings[categoryName].length; i++) {
            monthlySpending[categorySpendings[categoryName][i].month] = categorySpendings[categoryName][i].total;
          }
          retVal[categoryName] = monthlySpending;
        }
        return retVal;
      },

      spendingsGroupedByMonthChartData: function() {
        let retVal = {};
        for (let monthlySpending of this.spendingsGroupedByMonth) {
          retVal[monthlySpending.month] = monthlySpending.total;
        }
        return retVal = { 'User spendings': retVal };
      }
    },

    data() {
      return {
        spendingsGroupedByMonth: {},
        allTransactionsForYear: [],
        isLoaded: false,
        statisticsYear: 'All time',
        activeYears: [],
        spendingsGroupedByCategoryAndMonth: []
      }
    },

    mounted: function() {
      Promise.all([
        this.fetchData(),
        userService.getActiveYears()
      ])
        .then(responses => {
          this.spendingsGroupedByCategoryAndMonth = responses[0][0];
          this.allTransactionsForYear = responses[0][1];
          this.spendingsGroupedByMonth = responses[0][2];
          this.activeYears = responses[1];
          this.isLoaded = true;
        })
        .catch(error => {
          this.$toasted.error(error);
        });
    },

    methods: {
      fetchData(dataYear) {
        let firstDay = null;
        let lastDay = null;
        let year = null;
        if (dataYear) {
          year = dataYear;
          firstDay = new Date(year, 0, 1).toLocaleDateString('sr-RS');
          lastDay = new Date(parseInt(year) + 1, 0, 1).toLocaleDateString('sr-RS');
        }
        return Promise.all([
          statisticService.getSpendingsByCategory(year),
          transactionService.getAll(firstDay, lastDay, "", true),
          statisticService.getSpendingsByMonths(year)
        ]);
      },

      changeStatisticsYear($event) {
        let year = null;
        if (!isNaN($event.target.value)) {
          year = $event.target.value;
        }

        this.isLoaded = false;
        this.fetchData(year)
          .then(responses => {
            this.spendingsGroupedByCategoryAndMonth = responses[0];
            this.allTransactionsForYear = responses[1];
            this.spendingsGroupedByMonth = responses[2];
            this.isLoaded = true;
          })
          .catch(error => {
            this.$toasted.error(error);
          });
      }
    }
  };
</script>

<style scoped>
  .chart-container {
    margin-top: 50px;
    margin-left: auto;
    margin-right: auto;
    width: 85%;
  }

  .category-table {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 70%;
  }

  .main-container {
    margin-left: 50px;
    margin-right: 50px;
    margin-bottom: 50px;
  }

  .center-middle {
    margin-left: auto;
    margin-right: auto;
  }

  #select-statistic-year, #select-graph-mode {
    width: 30%;
    margin-bottom: 15px;
  }

  .general-statistics {
    margin-bottom: 20px;
  }

  @media only screen and (max-width: 768px) {
    #select-statistic-year {
      width: 150px;
      margin-bottom: 10px;
    }

    .main-container {
      margin-left: 5px;
      margin-right: 5px;
      margin-bottom: 5px;
    }

    h2 {
      font-size: 20px;
    }

    h4 {
      font-size: 15px;
    }

    .chart-container {
      margin-top: 20px;
      margin-left: auto;
      margin-right: auto;
      width: 85%;
    }
  }
</style>
