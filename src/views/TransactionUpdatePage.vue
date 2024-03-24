<template>
  <div class="centered" @keyup.enter="submit" v-if="!isLoading">
      <h3>Edit transaction</h3>
      <div class="form-group">
        <label for="descriptionInput">Description</label>
        <input
          id="descriptionInput"
          ref="descriptionInput"
          type="text"
          class="form-control"
          placeholder="Description of a transaction..."
          v-model="transaction.description"
        />
      </div>
      <div class="form-group">
        <label for="categorySelect">Category</label>
        <model-select
          id="categorySelect"
          class="inline"
          :options="categories"
          v-model="transaction.category.id"
          placeholder="Select category..."
        ></model-select>
      </div>
      <div class="form-group">
        <label for="amountInput">Amount</label>
        <input
          id="amountInput"
          type="text"
          class="form-control"
          placeholder="$$"
          v-model="transaction.amount"
        />
      </div>
      <div class="form-group">
        <label for="dateInput">Date</label>
        <input
          id="dateInput"
          type="date"
          class="form-control"
          v-model="transaction.creationDate"
        />
      </div>

      <input
        type="button"
        @click="updateTransaction"
        @keyup.enter="updateTransaction"
        class="btn violet modal-default-button"
        value="Edit"
      />
  </div>
  <spinner v-else></spinner>
</template>

<script>
import { ModelSelect } from "vue-search-select";
import transactionService from "@/services/transaction-service";
import categoryService from "@/services/category-service";
import LoadingSpinner from "../components/utils/LoadingSpinner";
import { Transaction } from "../models/transaction";
import moment from "moment";

export default {
  name: "TransactionUpdate",

  components: {
    spinner: LoadingSpinner,
    "model-select": ModelSelect,
  },

  data() {
    return {
      isLoading: false,
      transaction: new Transaction(),
      categories: [],
      today: moment().format("YYYY-MM-DD"),
    };
  },

  mounted() {
    this.isLoading = true;
    Promise.all(
      [
        transactionService.get(this.$route.params.id),
        categoryService.getAll()
      ])
      .then(responses => {
        this.transaction = responses[0];
        this.transaction.creationDate = this.transaction.creationDate.toISOString().slice(0,10)
        
        this.categories = responses[1].map(category => {
        return {
          value: category.id,
          text: category.name 
        }})
        this.isLoading = false;
        this.$nextTick(() => this.$refs.descriptionInput.focus());
        })
      .catch(error => this.$toasted.error(error));
  },

  methods: {
    submit() {
      this.updateTransaction();
    },

    updateTransaction() {
      this.isLoading = true;
      transactionService
        .update(this.transaction)
        .then(() => {
          this.isLoading = false;
          this.$toasted.success("Successfully edited transaction!");
        })
        .catch((error) => {
          this.isLoading = false;
          this.$toasted.error(error);
        });
    },
  }
};
</script>

<style scoped>
  .centered {
    width:  65%;
    margin-left: auto;
    margin-right: auto;
  }
</style>
