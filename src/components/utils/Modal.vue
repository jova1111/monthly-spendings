<template>
  <transition name="modal">
    <div
      ref="modal"
      class="modal-mask"
      tabindex="0"
      @keyup.esc="$emit('close')"
    >
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header"> </slot>
          </div>

          <div class="modal-body">
            <slot name="body"> </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer"> </slot>
            <input
              type="button"
              value="Cancel"
              class="btn modal-default-button"
              @click="$emit('close')"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "modal",

  mounted() {
    this.$refs.modal.focus();
  },
};
</script>


<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  height: 80%;
  width: 80%;
}

.modal-container {
  width: 80%;
  height: 90%;
  margin: 0px auto;
  padding: 5px 10px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
  overflow: scroll;
  height: 55%;
}

.modal-default-button {
  float: right;
  margin-left: 10px;
}

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

@media only screen and (max-width: 768px) {
  .modal-container {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    height: 90%;
    margin: 0px auto;
    padding: 5px 10px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-wrapper {
    height: 90%;
    width: 90%;
  }

  .modal-body {
    margin: 5px 0;
    overflow: scroll;
    height: 60%;
  }

  .modal-header h3 {
    font-size: 15px;
  }
}
</style>
