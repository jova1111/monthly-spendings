<template>
  <div class="main-container">
    <span class="move-to-right">
      <label>Show daily spendings</label>
      <input
        id="dailySpendingsCheckbox"
        v-model="showDailySpendings"
        @change="showDailySpendingsChanged"
        type="checkbox"
      />
    </span>
    <div class="table-responsive">
      <table class="transactions table">
        <tr
          class="table-header"
          title="Click to hide table content."
          @click="visible = !visible"
        >
          <th class="transaction-date">Date</th>
          <th class="description">Description</th>
          <th class="category">Category</th>
          <th class="money-spent">Money spent</th>
          <th v-if="showActionControls" class="actions">Actions</th>
        </tr>
        <tr id="new-transaction" v-if="showNewTransactionForm && visible">
          <td>New transaction</td>
          <td>
            <input
              ref="descriptionInput"
              v-autofocus
              @keyup.enter="createTransaction"
              type="text"
              class="form-control"
              placeholder="Description of new transaction..."
              v-model="transaction.description"
            />
          </td>
          <td>
            <div class="category-container">
              <model-select
                class="inline"
                :options="categoryValues"
                v-model="transaction.category.id"
                placeholder="Select item..."
              ></model-select>
              <button
                id="show-modal"
                class="violet"
                @click="showNewCategoryModal = true"
              >
                +
              </button>
              <button id="show-modal" class="violet" @click="deleteCategory">
                x
              </button>
            </div>
          </td>
          <td>
            <input
              @keyup.enter="createTransaction"
              type="text"
              class="form-control"
              placeholder="$$"
              v-model="transaction.amount"
            />
          </td>
          <td>
            <div class="actions-container">
              <input
                class="action-button violet btn"
                @click="createTransaction"
                type="button"
                value="OK"
              />
              <input
                class="action-button btn btn-default"
                @click="resetTrasanctionForm"
                type="button"
                value="Cancel"
              />
            </div>
          </td>
        </tr>

        <template v-if="visible">
          <template
            class="transactions"
            style="width: 100%"
            v-for="(dailyTransactions, key) in dailyValues"
          >
            <tr
              v-for="dailyTransaction in dailyTransactions"
              v-bind:key="dailyTransaction.id"
            >
              <td>{{ dailyTransaction.creationDate | toLocalDate }}</td>
              <td>{{ dailyTransaction.description }}</td>
              <td>{{ dailyTransaction.category.name }}</td>
              <td>{{ dailyTransaction.amount | numberWithCommas }}</td>
              <td v-if="showActionControls">
                <div class="actions-container">
                  <input
                    type="button"
                    class="action-button violet btn"
                    value="Edit"
                    @click="showEditModal(dailyTransaction)"
                  />
                  <input
                    type="button"
                    class="action-button violet btn"
                    value="Delete"
                    @click="deleteTransaction(dailyTransaction.id)"
                  />
                </div>
              </td>
            </tr>
            <tr class="total-row" v-bind:key="key" v-if="showDailySpendings">
              <td colspan="3">Total:</td>
              <td>{{ dailyTransactions.sum | numberWithCommas }}</td>
            </tr>
          </template>
        </template>
      </table>
    </div>
    <category-form-modal
      v-if="showNewCategoryModal"
      @created="addCategoryFromModal"
      @close="showNewCategoryModal = false"
    ></category-form-modal>
    <transaction-form-modal
      v-if="showEditTransactionModal"
      :categories="categoryValues"
      :transaction="transactionToEdit"
      :isEditing="true"
      @edited="updateTransaction"
      @close="showEditTransactionModal = false"
    >
    </transaction-form-modal>
  </div>
</template>

<script>
import transactionService from "@/services/transaction-service";
import categoryService from "@/services/category-service";
import LoadingSpinner from "../utils/LoadingSpinner";
import CategoryForm from "./CategoryForm";
import TransactionForm from "./TransactionForm";
import { Transaction } from "@/models/transaction";
import { ModelSelect } from "vue-search-select";
import moment from "moment";

export default {
  filters: {
    toLocalDate: function (value) {
      if (!value) return "";
      return moment(value).format("D.M.YYYY.");
    },
  },

  components: {
    "category-form-modal": CategoryForm,
    "transaction-form-modal": TransactionForm,
    spinner: LoadingSpinner,
    "model-select": ModelSelect,
  },

  props: {
    transactions: Array,
    categories: Array,
    showActionControls: Boolean,
  },

  created() {
    this.showDailySpendings =
      localStorage.getItem("showDailySpendings") == "true";
  },

  computed: {
    dailyValues: function () {
      let dailyValues = this.sortedTransactionsList.reduce(function (rv, x) {
        let dateWithoutTime = new Date(x["creationDate"]).toLocaleDateString(
          "en-GB"
        );
        (rv[dateWithoutTime] = rv[dateWithoutTime] || []).push(x);
        return rv;
      }, {});

      for (let key of Object.keys(dailyValues)) {
        let transactionsForDay = dailyValues[key];
        let dailySum = 0;
        for (let transaction of transactionsForDay) {
          dailySum += transaction.amount;
        }
        transactionsForDay.sum = dailySum;
      }
      return dailyValues;
    },

    categoryValues: function () {
      return this.categories.map((category) => {
        return {
          value: category.id,
          text: category.name,
        };
      });
    },

    sortedTransactionsList: function () {
      function compare(a, b) {
        if (a.creationDate > b.creationDate) return -1;
        if (a.creationDate < b.creationDate) return 1;
        return 0;
      }
      return this.allTransactions.sort(compare);
    },

    showNewTransactionForm: function () {
      if (this.allTransactions.length > 0) {
        let now = new Date();
        let creationDate = new Date(this.allTransactions[0].creationDate);
        return (
          now.getMonth() == creationDate.getMonth() && this.showActionControls
        );
      }
      return this.showActionControls;
    },
  },

  data() {
    return {
      transaction: new Transaction(),
      allTransactions: [],
      showNewCategoryModal: false,
      showEditTransactionModal: false,
      visible: true,
      processStartEventName: "started-processing",
      processFinishEventName: "finished-processing",
      updatedEventName: "updated",
      showDailySpendings: false,
      transactionToEdit: new Transaction(),
    };
  },

  mounted() {
    if (this.$refs.descriptionInput) {
      this.$refs.descriptionInput.focus();
    }
    this.allTransactions = this.transactions;
    if (this.categories) {
      this.transaction.category.id = this.categories[0].id;
    }
  },

  methods: {
    createTransaction() {
      this.transaction.creationDate = moment().format("YYYY-MM-DD HH:mm:ss");
      this.$emit(this.processStartEventName);
      transactionService
        .create(this.transaction)
        .then((response) => {
          this.transaction.description = "";
          this.transaction.amount = 0;
          this.allTransactions.push(response);
          this.$emit(this.updatedEventName, this.allTransactions);
          this.$emit(this.processFinishEventName);
          this.$nextTick(() => this.$refs.descriptionInput.focus());
          this.$toasted.success("Successfully created transaction!");
        })
        .catch((error) => {
          this.$toasted.error(error);
          this.$emit(this.processFinishEventName);
        });
    },

    deleteTransaction(id) {
      if (!confirm("Are you sure you want to delete this transaction?")) {
        return;
      }
      this.$emit(this.processStartEventName);
      transactionService
        .delete(id)
        .then((response) => {
          this.allTransactions = this.allTransactions.filter(
            (transaction) => transaction.id != id
          );
          this.$emit(this.updatedEventName, this.allTransactions);
          this.$emit(this.processFinishEventName);
          this.$toasted.success("Successfully deleted transaction!");
        })
        .catch((error) => {
          this.$toasted.error(error);
          this.$emit(this.processFinishEventName);
        });
    },

    addCategoryFromModal(category) {
      this.categories.push(category);
      this.$nextTick(() => {
        this.transaction.category.id = category.id;
      });
      this.$refs.descriptionInput.focus();
      this.showNewCategoryModal = false;
    },

    showDailySpendingsChanged() {
      localStorage.setItem("showDailySpendings", this.showDailySpendings);
    },

    deleteCategory() {
      if (this.transaction.category.id != -1) {
        if (!confirm("Are you sure you want to delete this category?")) {
          return;
        }
        this.$emit(this.processStartEventName);
        categoryService
          .delete(this.transaction.category.id)
          .then((response) => {
            let otherCategory = this.categories.find(
              (category) => category.name == "Other"
            );
            this.allTransactions
              .filter(
                (transaction) =>
                  transaction.category.id == this.transaction.category.id
              )
              .forEach((transaction) => {
                transaction.category.name = otherCategory.name;
                transaction.category.id = otherCategory.id;
              });
            this.$emit(
              this.updatedEventName,
              this.allTransactions,
              this.categories.filter(
                (category) => category.id != this.transaction.category.id
              )
            );
            this.$emit(this.processFinishEventName);
            this.transaction.category.id = this.categories[0].id;
            this.$toasted.success("Successfully deleted category!");
          })
          .catch((error) => {
            this.$toasted.error(error);
            this.$emit(this.processFinishEventName);
          });
      }
    },

    resetTrasanctionForm() {
      this.transaction.category.id = this.categories[0].id;
      this.transaction.description = "";
      this.transaction.amount = 0;
    },

    showEditModal(transaction) {
      this.transactionToEdit.id = transaction.id;
      this.transactionToEdit.amount = transaction.amount;
      this.transactionToEdit.category.id = transaction.category.id;
      this.transactionToEdit.description = transaction.description;
      this.transactionToEdit.creationDate = transaction.creationDate;
      this.showEditTransactionModal = true;
    },

    updateTransaction() {
      let transactionToUpdate = this.allTransactions.find(
        (transaction) => transaction.id == this.transactionToEdit.id
      );
      let transactionToUpdateDate = new Date(transactionToUpdate.creationDate);
      let updatedTransactionDate = new Date(
        this.transactionToEdit.creationDate
      );
      // if date updated to another month/year, remove transaction from the list
      if (
        transactionToUpdateDate.getMonth() !=
          updatedTransactionDate.getMonth() ||
        transactionToUpdateDate.getYear() != updatedTransactionDate.getYear()
      ) {
        this.allTransactions = this.allTransactions.filter(
          (transaction) => transaction.id != transactionToUpdate.id
        );
        this.showEditTransactionModal = false;
        this.$emit(this.updatedEventName, this.allTransactions);
        return;
      }
      transactionToUpdate.id = this.transactionToEdit.id;
      transactionToUpdate.description = this.transactionToEdit.description;
      transactionToUpdate.category.id = this.transactionToEdit.category.id;
      transactionToUpdate.category.name = this.categories.find(
        (category) => this.transactionToEdit.category.id == category.id
      ).name;
      transactionToUpdate.amount = Number(this.transactionToEdit.amount);
      transactionToUpdate.creationDate = this.transactionToEdit.creationDate;
      try {
        this.$refs.descriptionInput.focus();
      } catch (error) {
        // new category form is probably not visible, no problem
      }
      this.$emit(this.updatedEventName, this.allTransactions);
      this.showEditTransactionModal = false;
    },
  },
};
</script>

<style scoped>
.table-responsive {
  overflow-x: visible;
}

#new-transaction {
  width: 100%;
}

.actions-container {
  display: flex;
  justify-content: space-around;
}

.action-button {
  margin: 2px;
}

.small-form-control {
  display: inline;
  width: 200px;
}

.description {
  width: 40%;
  min-width: 250px;
}

.category {
  width: 30%;
}

.money-spent {
  text-align: center;
  width: 20%;
}

.actions {
  width: 10%;
}

.category-container {
  display: flex;
  justify-content: space-around;
}

#show-modal {
  margin: 5px;
}

.total-row {
  background-color: rgb(185, 185, 233) !important;
}

.invisible {
  visibility: hidden;
}

.move-to-right {
  margin-left: auto;
  margin-right: auto;
}

.main-container {
  display: flex;
  flex-direction: column;
}

@media only screen and (max-width: 768px) {
  .table-responsive {
    overflow-x: visible;
    overflow-y: auto;
  }

  .description {
    width: 80px;
    min-width: 0px;
  }
}
</style>
