// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import autofocus from 'vue-autofocus-directive';
import interceptorsSetup from '@/utils/interceptors';

Vue.config.productionTip = false

Vue.directive('autofocus', autofocus);

interceptorsSetup();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
