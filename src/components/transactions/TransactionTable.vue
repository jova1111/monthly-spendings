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
        <tr class="table-header" @click="visible = !visible">
          <th class="transaction-date">Date</th>
          <th class="description">Description</th>
          <th class="description">Category</th>
          <th class="money-spent">Money spent</th>
        </tr>
        <tr id="new-transaction" v-if="showActionControls && visible">
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
              <button id="show-modal" class="violet" @click="showNewCategoryModal = true">+</button>
              <button id="show-modal" class="violet" @click="deleteCategory">x</button>
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
        </tr>

        <template v-if="visible">
          <template
            class="transactions"
            style="width:100%"
            v-for="(dailyTransactions, key) in dailyValues"
          >
            <tr v-for="dailyTransaction in dailyTransactions" v-bind:key="dailyTransaction.id">
              <td>{{ dailyTransaction.creationDate | toLocalDate }}</td>
              <td>{{ dailyTransaction.description }}</td>
              <td>{{ dailyTransaction.category.name }}</td>
              <td>{{ dailyTransaction.amount }}</td>
              <td v-if="showActionControls">
                <input
                  type="button"
                  class="violet"
                  value="x"
                  @click="deleteTransaction(dailyTransaction.id)"
                />
              </td>
            </tr>
            <tr class="total-row" v-bind:key="key" v-if="showDailySpendings">
              <td colspan="3">Total:</td>
              <td>{{ dailyTransactions.sum }}</td>
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
  </div>
</template>

<script>
  import transactionService from '@/services/transaction-service';
  import categoryService from '@/services/category-service';
  import LoadingSpinner from '../utils/LoadingSpinner';
  import CategoryForm from './CategoryForm';
  import { Transaction } from '@/models/transaction';
  import { ModelSelect } from 'vue-search-select';

  export default {
    filters: {
      toLocalDate: function(value) {
        if (!value) return '';
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
      transactions: Array,
      categories: Array,
      showActionControls: Boolean
    },

    created() {
      this.showDailySpendings = localStorage.getItem('showDailySpendings') == 'true';
    },

    computed: {
      dailyValues: function() {
        let dailyValues = this.sortedTransactionsList.reduce(function(rv, x) {
          let dateWithoutTime = new Date(x['creationDate']).toLocaleDateString('en-GB');
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

      categoryValues: function() {
        return this.categories.map(category => {
          return {
            value: category.id,
            text: category.name
          };
        });
      },

      sortedTransactionsList: function() {
        function compare(a, b) {
          if (a.creationDate > b.creationDate) return -1;
          if (a.creationDate < b.creationDate) return 1;
          return 0;
        }
        return this.allTransactions.sort(compare);
      }
    },

    data() {
      return {
        transaction: new Transaction(),
        allTransactions: [],
        showNewCategoryModal: false,
        visible: true,
        processStartEventName: 'started-processing',
        processFinishEventName: 'finished-processing',
        updatedEventName: 'updated',
        showDailySpendings: false
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
        this.$emit(this.processStartEventName);
        transactionService.create(this.transaction)
          .then(response => {
            this.transaction.description = '';
            this.transaction.amount = 0;
            this.allTransactions.push(response);
            this.$emit(this.updatedEventName, this.allTransactions);
            this.$emit(this.processFinishEventName);
            this.$refs.descriptionInput.focus();
            this.$toasted.success("Successfully created transaction!");
          })
          .catch(error => {
            this.$toasted.error(error);
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
            this.allTransactions = this.allTransactions.filter(
              transaction => transaction.id != id
            );
            this.$emit(this.updatedEventName, this.allTransactions);
            this.$emit(this.processFinishEventName);
            this.$toasted.success("Successfully deleted transaction!");
          })
          .catch(error => {
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
        localStorage.setItem('showDailySpendings', this.showDailySpendings);
      },

      deleteCategory() {
        if(this.transaction.category.id != -1) {
          if (!confirm('Are you sure you want to delete this category?')) {
            return;
          }
          this.$emit(this.processStartEventName);
          categoryService.delete(this.transaction.category.id)
            .then(response => {
              this.allTransactions
                .filter(transaction => transaction.category.id == this.transaction.category.id)
                .forEach(transaction => transaction.category.name = 'Other');
              this.transaction.category.id = this.categories[0].id;
              this.$emit(this.updatedEventName, this.allTransactions);
              this.$emit(this.processFinishEventName);
              this.$toasted.success("Successfully deleted category!");
            })
            .catch(error => {
              this.$toasted.error(error);
            });
        }
      }
    }
  };
</script>

<style scoped>
  .table-responsive {
    overflow-x: visible;
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

  .money-spent {
    text-align: center;
    width: 20%;
    min-width: 100px;
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
