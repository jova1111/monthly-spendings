<template>
  <div @keyup.enter="editTransaction" v-if="!isLoading">
    <modal @close="$emit('close')">
      <template slot="header">
        <h3>Edit transaction</h3>
      </template>

      <template slot="body">
        <div class="form-group">
          <label for="descriptionInput">Description</label>
          <input
            id="descriptionInput"
            ref="descriptionInput"
            type="text"
            class="form-control"
            placeholder="Description of new transaction..."
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
            placeholder="Select item..."
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
      </template>

      <template slot="footer">
        <input
          type="button"
          @click="editTransaction"
          @keyup.enter="editTransaction"
          class="btn violet modal-default-button"
          value="Edit"
        />
      </template>
    </modal>
  </div>
  <spinner v-else></spinner>
</template>

<script>
  import { Transaction } from '@/models/transaction';
  import { ModelSelect } from 'vue-search-select';
  import transactionService from '@/services/transaction-service';
  import categoryService from '@/services/category-service';
  import LoadingSpinner from '../utils/LoadingSpinner';
  import Modal from '../utils/Modal';

  export default {
    name: 'transaction-form',

    components: {
      'spinner': LoadingSpinner,
      'modal': Modal,
      'model-select': ModelSelect
    },

    props: {
      transaction: Object,
      categories: Array
    },

    data() {
      return {
        isLoading: false,
        showNewCategoryModal: false
      };
    },

    mounted() {
      this.$refs.descriptionInput.focus();
    },

    methods: {
      editTransaction() {
        this.isLoading = true;
        transactionService.update(this.transaction)
          .then(response => {
            this.isLoading = false;
            this.$toasted.success("Successfully edited transaction!");
            this.$emit('edited');
          })
          .catch(error => {
            this.isLoading = false;
            this.$toasted.error(error);
          });
      }
    }
  };
</script>

