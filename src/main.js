// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import autofocus from 'vue-autofocus-directive';
import interceptorsSetup from '@/utils/interceptors';
import Toasted from 'vue-toasted';

Vue.config.productionTip = false
Vue.use(Toasted, { duration: 3000 });

Vue.directive('autofocus', autofocus);

interceptorsSetup();

// setup global filters
Vue.filter('numberWithCommas', function (value) {
  return value.toLocaleString('sr-RS');
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
