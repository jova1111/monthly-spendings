<template>
  <div @keyup.enter="editTransaction" v-if="!isLoading">
    <modal @close="$emit('close')">
      <template slot="header">
        <h3 v-if="isEditing">Edit transaction</h3>
        <h3 v-else>Create transaction</h3>
      </template>

      <template slot="body">
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
        <div>
          <label for="amountInput">Amount</label>
          <input
            id="amountInput"
            type="text"
            class="form-control"
            placeholder="$$"
            v-model="transaction.amount"
          />
        </div>
        <div>
          <label for="dateInput">Date</label>
          <input
            id="dateInput"
            type="date"
            class="form-control"
            v-model="transaction.creationDate"
          />
        </div>
      </template>

      <template slot="footer">
        <input
          v-if="isEditing"
          type="button"
          @click="editTransaction"
          @keyup.enter="editTransaction"
          class="btn violet modal-default-button"
          value="Edit"
        />
        <input
          v-else
          type="button"
          @click="createTransaction"
          @keyup.enter="createTransaction"
          class="btn violet modal-default-button"
          value="Create"
        />
      </template>
    </modal>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import { ModelSelect } from "vue-search-select";
import transactionService from "@/services/transaction-service";
import LoadingSpinner from "../utils/LoadingSpinner";
import Modal from "../utils/Modal";
import { Transaction } from "../../models/transaction";
import moment from "moment";

export default {
  name: "transaction-form",

  components: {
    spinner: LoadingSpinner,
    modal: Modal,
    "model-select": ModelSelect,
  },

  props: {
    transaction: {
      type: Transaction,
      default: () => {
        let transaction = new Transaction();
        transaction.creationDate = moment().format("YYYY-MM-DD");
        return transaction;
      },
    },
    categories: Array,
    isEditing: Boolean,
  },

  data() {
    return {
      isLoading: false,
    };
  },

  mounted() {
    this.$refs.descriptionInput.focus();
    if (!this.isEditing) {
      this.transaction.category = { id: this.categories[0].value };
    } else {
      this.transaction.creationDate = moment(
        this.transaction.creationDate
      ).format("YYYY-MM-DD");
    }
  },

  methods: {
    editTransaction() {
      this.isLoading = true;
      transactionService
        .update(this.transaction)
        .then(() => {
          this.isLoading = false;
          this.$toasted.success("Successfully edited transaction!");
          this.$emit("edited");
        })
        .catch((error) => {
          this.isLoading = false;
          this.$toasted.error(error);
        });
    },

    createTransaction() {
      this.isLoading = true;
      transactionService
        .create(this.transaction)
        .then(() => {
          this.isLoading = false;
          this.$toasted.success("Successfully created transaction!");
          this.$emit("created", this.transaction);
        })
        .catch((error) => {
          this.isLoading = false;
          this.$toasted.error(error);
        });
    },
  },
};
</script>

