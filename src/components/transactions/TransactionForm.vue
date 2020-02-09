<template>
  <div v-if="!isLoading">
    <modal @close="$emit('close')">
      <template slot="header">
        <h3>New transaction</h3>
      </template>

      <template slot="body">
        <input
          @keyup.enter="addTransaction"
          v-autofocus
          class="form-control"
          type="text"
          v-model="category.name"
          placeholder="Name of category"
        />
      </template>

      <template slot="footer">
        <input
          type="button"
          @click="addCategory"
          class="btn violet modal-default-button"
          value="Create"
        />
      </template>
    </modal>
    <category-form-modal
      v-if="showNewCategoryModal"
      @created="addCategoryFromModal"
      @close="showNewCategoryModal = false"
    ></category-form-modal>
  </div>
  <spinner v-else></spinner>
</template>

<script>
  import { Transaction } from '@/models/transaction';
  import transactionService from '@/services/transaction-service';
  import categoryService from '@/services/category-service';
  import LoadingSpinner from '../utils/LoadingSpinner';
  import Modal from '../utils/Modal';

  export default {
    name: 'transaction-form',

    components: {
      'spinner': LoadingSpinner,
      'modal': Modal
    },

    props: {
      categories: Array
    },

    data() {
      return {
        transaction: new Transaction,
        isLoading: false,
        showNewCategoryModal: false
      };
    },

    methods: {
      addTransaction() {
        this.isLoading = true;
        categoryService
          .create(this.category.name)
          .then(createdCategory => {
            this.isLoading = false;
            this.$emit('created', createdCategory);
            this.$toasted.success("Successfully created category!");
          })
          .catch(error => {
            this.isLoading = false;
            this.$toasted.error(error);
          });
      }
    }
  };
</script>

