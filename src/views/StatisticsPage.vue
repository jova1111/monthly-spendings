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
      <h4>Total spendings: {{ totalSpendings }}</h4>
      <h4>Other users average spendings<span v-if="statisticsYear!='All time'"> this year</span>: {{ otherUsersSpendings }}</h4>
    </div>

    <div class="center-middle chart-container">
      <label for="select-graph-mode">Graph data:</label>
      <select id="select-graph-mode" class="center-middle form-control" v-model="selectedGraphData" @change="changeGraphMode">
        <option :key="graphMode.value" v-for="graphMode in graphDataModes">{{ graphMode.selectOption }}</option>
      </select>
      <chart class="center-middle" :chart-data="chartData" :options="chartOptions"></chart>
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
  import LineChart from '@/components/statistics/LineChart';
  import LoadingSpinner from '@/components/utils/LoadingSpinner';
  import CategoryTable from '@/components/transactions/CategoryTable';

  export default {
    components: {
      spinner: LoadingSpinner,
      chart: LineChart,
      'category-table': CategoryTable
    },

    mixins: [ commonData ],

    computed: {
      totalSpendings: function() {
        return this.allTransactionsForYear.reduce((sum, transaction) => sum += transaction.amount, 0);
      }
    },

    data() {
      return {
        spendingsGroupedByCategory: [],
        allTransactionsForYear: [],
        isLoaded: false,
        chartData: {},
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false
        },
        graphDataModes: {
          QUARTALS: { value: "quartals", selectOption: "By quartals" },
          MONTHS: { value: "months", selectOption: "By months"}
        },
        selectedGraphData: '',
        statisticsYear: 'All time',
        activeYears: [],
        otherUsersSpendings: 0
      }
    },

    mounted: function() {
      this.selectedGraphData = this.graphDataModes.MONTHS.selectOption;

      Promise.all([
        this.fetchData(),
        userService.getActiveYears()
      ])
        .then(responses => {
          this.spendingsGroupedByCategory = responses[0][0];
          this.allTransactionsForYear = responses[0][1];
          this.otherUsersSpendings = responses[0][2];
          this.chartData = this.getGraphData(this.graphDataModes.MONTHS.value);
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
          firstDay = new Date(year, 0, 1);
          lastDay = new Date(year, 11, 31);
        }
        return Promise.all([
          statisticService.getSpendingsByCategory(year),
          transactionService.getAll(firstDay, lastDay),
          statisticService.getOtherUsersSpendings(year)
        ]);
      },

      getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      },

      getGraphData(graphMode) {
        let categoriesWithTotals = [];
        let data = [];
        let labels = [];
        if (graphMode == this.graphDataModes.QUARTALS.value) {
          labels = ['Q1', 'Q2', 'Q3', 'Q4'];
        } else {
          labels = this.monthNames;
        }

        Object.entries(this.spendingsGroupedByCategory).forEach(entry => {
          let categoryName = entry[0];
          let spendingsByMonth = entry[1]; // object where key is the month number and value is total spendings for that month

          if (graphMode == this.graphDataModes.QUARTALS.value) {
            data = [0, 0, 0, 0];
            Object.entries(spendingsByMonth).forEach(entry => {
              if (entry[0] < 4) {
                data[0] += entry[1];
              } else if (entry[0] >= 4 && entry[0] < 9) {
                data[1] += entry[1];
              } else if (entry[0] >= 4 && entry[0] < 9) {
                data[2] += entry[1];
              } else {
                data[3] += entry[1];
              }
            });
          } else {
            data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            Object.entries(spendingsByMonth).forEach(entry => {
              data[entry[0]-1] = entry[1];
            });
          }

          let randomColor = this.getRandomColor();
          categoriesWithTotals.push({
            label: categoryName,
            backgroundColor: randomColor,
            fill: false,
            borderWidth: 3,
            borderColor: randomColor,
            showLine: true,
            hidden: true,
            data
          });
        });
        if (categoriesWithTotals.length > 0) {
          categoriesWithTotals[0].hidden = false;
        }

        return {
          labels,
          datasets: categoriesWithTotals
        }
      },

      changeGraphMode() {
        if (this.selectedGraphData == this.graphDataModes.MONTHS.selectOption) {
          this.chartData = this.getGraphData(this.graphDataModes.MONTHS.value);
        } else if (this.selectedGraphData == this.graphDataModes.QUARTALS.selectOption) {
          this.chartData = this.getGraphData(this.graphDataModes.QUARTALS.value);
        }
      },

      changeStatisticsYear($event) {
        let year = null;
        if (!isNaN($event.target.value)) {
          year = $event.target.value;
        }

        this.isLoaded = false;
        this.fetchData(year)
          .then(responses => {
            this.spendingsGroupedByCategory = responses[0];
            this.chartData = this.getGraphData(this.graphDataModes.MONTHS.value);
            this.allTransactionsForYear = responses[1];
            this.otherUsersSpendings = responses[2];
            this.selectedGraphData = this.graphDataModes.MONTHS.selectOption;
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
    #select-statistic-year, #select-graph-mode {
    width: 100px;
    margin-bottom: 10px;
    }

    .main-container {
      margin-left: 5px;
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }
</style>
