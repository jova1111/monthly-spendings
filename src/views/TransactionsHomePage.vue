<template>
  <div v-if="!isLoading" class="container-fluid">
    <div></div>
    <div class="centered">
      <div id="selectYearContainer" class="form-group">
        <label for="yearSelect">Select year:</label>
        <select
          id="yearSelect"
          class="btn form-control select-year"
          v-model="selectedYear"
          v-on:change="onSelectedYearChange(selectedYear)"
        >
          <option v-for="activeYear of activeYears" :key="activeYear">
            {{ activeYear }}
          </option>
        </select>
      </div>
      <div class="table-responsive">
        <table class="table transactions">
          <tr class="table-header">
            <th>Month</th>
            <th class="money-spent">Total money spent</th>
          </tr>
          <tr
            v-for="filteredMonth of filteredMonths"
            :key="filteredMonth.month"
            @click="handleTableMonthClick(filteredMonth.index, selectedYear)"
          >
            <td>{{ filteredMonth.month }}</td>
            <td>
              {{ filteredMonth.moneySpent | numberWithCommas }}
              <span v-if="getMoneyPerMonthForMonth(filteredMonth.index) > 0"
                >(<span
                  class="red"
                  v-bind:class="{
                    green:
                      getMoneyPerMonthForMonth(filteredMonth.index) -
                        filteredMonth.moneySpent >
                      0,
                  }"
                  >{{
                    (getMoneyPerMonthForMonth(filteredMonth.index) -
                      filteredMonth.moneySpent)
                      | numberWithCommas
                  }}</span
                >)
              </span>
            </td>
          </tr>
          <tr>
            <td>Total spendings for a year:</td>
            <td>
              {{ yearlySpendings.spendings | numberWithCommas }}
              <span v-if="yearlySpendings.plannedMoney > 0">
                (<span
                  class="red"
                  v-bind:class="{
                    green:
                      yearlySpendings.plannedMoney - yearlySpendings.spendings >
                      0,
                  }"
                  >{{
                    (yearlySpendings.plannedMoney - yearlySpendings.spendings)
                      | numberWithCommas
                  }}</span
                >)
              </span>
            </td>
          </tr>
        </table>
      </div>
      <input
        type="button"
        class="action-button violet btn"
        value="New transaction"
        @click="showCreateTransactionModal = true"
        style="margin-top: 5px; margin-right: 10px"
      />
      <router-link
        style="margin-top: 5px"
        class="btn violet"
        to="/statistics"
        tag="button"
        >Statistics</router-link
      >
    </div>
    <transaction-form-modal
      v-if="showCreateTransactionModal"
      :categories="categories"
      @close="showCreateTransactionModal = false"
      @created="transactionCreated"
    />
  </div>
  <spinner v-else></spinner>
</template>

<script>
import userService from "@/services/user-service";
import transactionService from "@/services/transaction-service";
import categoryService from "@/services/category-service";
import plannedMonthlyMoneyService from "@/services/planned-monthly-money-service.js";
import { Transaction } from "@/models/transaction";
import commonData from "@/mixins/common-data";
import LoadingSpinner from "@/components/utils/LoadingSpinner";
import TransactionForm from "../components/transactions/TransactionForm";

export default {
  name: "TransactionsHomePage",

  components: {
    spinner: LoadingSpinner,
    "transaction-form-modal": TransactionForm,
  },

  mixins: [commonData],

  computed: {
    filteredMonths: function () {
      let filteredMonthsList = [];
      for (let index = 0; index < 12; index++) {
        if (this.monthlySpendings[index + 1] || this.isCurrentMonth(index)) {
          filteredMonthsList.push({
            index: index + 1,
            month: this.monthNames[index],
            moneySpent: this.monthlySpendings[index + 1] || 0,
          });
        }
      }
      if (this.selectedYear == new Date().getFullYear()) {
        return filteredMonthsList.reverse();
      }
      return filteredMonthsList;
    },

    yearlySpendings: function () {
      let totalSpendingsForYear = 0;
      for (let key in this.monthlySpendings) {
        totalSpendingsForYear += this.monthlySpendings[key];
      }
      let totalPlannedMoney = this.plannedMonthlyMoneyList
        .map((moneyPerMonth) => moneyPerMonth.value)
        .reduce((sum, current) => (sum += current), 0);
      return {
        spendings: totalSpendingsForYear,
        plannedMoney: totalPlannedMoney,
      };
    },
  },

  data() {
    return {
      selectedYear: 2018,
      activeYears: [],
      singleYear: "",
      transaction: new Transaction(),
      monthlySpendings: [],
      plannedMonthlyMoneyList: [],
      isLoading: true,
      showCreateTransactionModal: false,
      categories: [],
    };
  },

  mounted() {
    var queryYear = this.$route.query.year;
    let currentYear = new Date().getUTCFullYear();
    let selectedYear = currentYear;
    if (queryYear && Number(queryYear)) {
      selectedYear = Number(queryYear);
    }
    let firstDay = new Date(selectedYear, 0, 1);
    let lastDay = new Date(selectedYear + 1, 0, 1);

    this.getData(firstDay, lastDay)
      .then((responses) => {
        this.monthlySpendings = responses[0];
        this.activeYears = responses[1].sort().reverse();
        // this prevents having empty year selector if user wasn't active in current year
        if (!this.activeYears.includes(selectedYear)) {
          this.activeYears.push(selectedYear);
        }
        this.plannedMonthlyMoneyList = responses[2];

        this.categories = responses[3].map((category) => {
          return {
            value: category.id,
            text: category.name,
          };
        });
        this.selectedYear = selectedYear;
        this.isLoading = false;
      })
      .catch((error) => {
        alert(error);
      });
  },

  methods: {
    getData(startDate, endDate) {
      return Promise.all([
        transactionService.getAll(startDate, endDate, "month"),
        userService.getActiveYears(),
        plannedMonthlyMoneyService.getAll(startDate, endDate),
        categoryService.getAll(),
      ]);
    },

    getMoneyPerMonthForMonth(month) {
      let moneyPerMonth = this.plannedMonthlyMoneyList.find(
        (moneyPerMonth) =>
          month == new Date(moneyPerMonth.creationDate).getMonth() + 1
      );
      return moneyPerMonth == undefined ? 0 : moneyPerMonth.value;
    },

    isCurrentYear(moneySpent) {
      return (
        this.selectedYear == new Date().getUTCFullYear() && moneySpent != 0
      );
    },

    isCurrentMonth(index) {
      return (
        index == new Date().getUTCMonth() &&
        this.selectedYear == new Date().getFullYear()
      );
    },

    handleTableMonthClick(month, year) {
      this.$router.push({
        name: "TransactionsPage",
        params: { month, year },
      });
    },

    onSelectedYearChange(year) {
      this.$router.replace({ query: { year } });
      let firstDay = new Date(year, 0, 1);
      let lastDay = new Date(year, 11, 31);

      this.isLoading = true;
      this.getData(firstDay, lastDay)
        .then((responses) => {
          this.monthlySpendings = responses[0];
          this.plannedMonthlyMoneyList = responses[2];
          this.isLoading = false;
        })
        .catch((error) => {
          this.$toasted.error(error);
        });
    },

    transactionCreated(createdTransaction) {
      let creationDate = new Date(createdTransaction.creationDate);

      // create new object and assign it to this.monthlySpendings to trigger automatic refresh (compute method)
      let newSpendings = { ...this.monthlySpendings };
      newSpendings[creationDate.getMonth() + 1] += Number(
        createdTransaction.amount
      );
      this.monthlySpendings = newSpendings;
      this.showCreateTransactionModal = false;
    },
  },
};
</script>

<style scoped>
.move-to-right {
  position: relative;
  left: 50%;
  transform: translate(-50%, 0%);
  width: 20%;
  position: relative;
  margin-bottom: 5px;
  border: 1px solid rgb(206, 206, 206);
}

.money-spent {
  text-align: center;
  width: 40%;
  min-width: 150px;
}

.centered {
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 30px;
}

#selectYearContainer {
  width: 40%;
  margin-left: auto;
  margin-right: auto;
}

@media only screen and (max-width: 768px) {
  .centered {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 30px;
  }

  .move-to-right {
    position: relative;
    left: 50%;
    transform: translate(-50%, 0%);
    width: 40%;
    position: relative;
    margin-bottom: 5px;
    border: 1px solid rgb(206, 206, 206);
  }
}
</style>
