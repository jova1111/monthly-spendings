<template>
  <div v-if="!isLoading">
    <modal @close="$emit('close')">
      <template slot="header">
        <h3>New category</h3>
      </template>

      <template slot="body">
        <input
          @keyup.enter="addCategory"
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
  </div>
  <spinner v-else></spinner>
</template>

<script>
  import { Category } from '@/models/category';
  import categoryService from '@/services/category-service';
  import LoadingSpinner from '../utils/LoadingSpinner';
  import Modal from '../utils/Modal';

  export default {
    name: 'category-form',

    components: {
      'spinner': LoadingSpinner,
      'modal': Modal
    },

    data() {
      return {
        category: new Category,
        isLoading: false
      };
    },

    methods: {
      addCategory() {
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

