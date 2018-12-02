<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div v-if="!isLoading" class="modal-container">

                    <div class="modal-header">
                        <slot name="header">
                            New category
                        </slot>
                    </div>

                    <div class="modal-body">
                        <slot name="body">
                            <input v-autofocus class="form-control" type="text" v-model="categoryName" placeholder="Name of category">
                        </slot>
                    </div>

                    <div class="modal-footer">
                        <slot name="footer">
                        <input type="button" @click="addCategory()" class="btn violet modal-default-button" value="Create">
                        <button class="btn modal-default-button" @click="$emit('close')">Cancel</button>
                        </slot>
                    </div>
                </div>
                <spinner v-else></spinner>
            </div>
        </div>
  </transition>
</template>

<script>
    import categoryService from '../services/category-service';
    import LoadingSpinner from './LoadingSpinner';

    export default {
        components: {
            'spinner': LoadingSpinner
        },
        name: 'category-form-modal',
        data() {
            return {
                categoryName: '',
                isLoading: false
            }
        },

        methods: {
            addCategory() {
                this.isLoading = true;
                categoryService.create(this.categoryName)
                    .then(createdCategory => {
                        this.isLoading = false;
                        this.$emit('created', createdCategory);
                    })
                    .catch(error => {
                        this.isLoading = false;
                        alert(error);
                    })
            }
        }
    }
</script>


<style scoped>
    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
        transition: opacity .3s ease;
    }

    .modal-wrapper {
        display: table-cell;
        vertical-align: middle;
    }

    .modal-container {
        width: 300px;
        margin: 0px auto;
        padding: 20px 30px;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
        transition: all .3s ease;
        font-family: Helvetica, Arial, sans-serif;
    }

    .modal-header h3 {
        margin-top: 0;
        color: #42b983;
    }

    .modal-body {
        margin: 20px 0;
    }

    .modal-default-button {
        float: right;
        margin-left: 10px;
    }

    /*
    * The following styles are auto-applied to elements with
    * transition="modal" when their visibility is toggled
    * by Vue.js.
    *
    * You can easily play with the modal transition by editing
    * these styles.
    */

    .modal-enter {
        opacity: 0;
    }

    .modal-leave-active {
        opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }

    .violet {
        background-color: rgb(124, 124, 225);
        color: white
    }
</style>