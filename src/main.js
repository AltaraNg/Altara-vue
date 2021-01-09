window.$ = window.jQuery = require("jquery");
window.Popper = require("popper.js").default;
require("bootstrap");
import Vue from 'vue'
var VueTruncate = require("vue-truncate-filter");
import App from './App.vue'
import router from './router'
import VeeValidate from "vee-validate";
import VueSweetalert2 from "vue-sweetalert2";
import VuexRouterSync from "vuex-router-sync";
import _ from 'lodash';
import { store } from './store/store'
import '../src/assets/css/_mixins.scss'
import '../src/assets/css/_variables.scss'
import '../src/assets/css/app.scss'
// import '../src/assets/css/bootstrap.min.css'
// import '../src/assets/css/now-ui-kit.css'
import "./utilities/globalFunctions.js";


Vue.config.productionTip = false
Object.defineProperty(Vue.prototype, '$_', { value: _ });
VuexRouterSync.sync(store, router);
Vue.use(VeeValidate, {
    events: "input|blur",
    classes: true,
    classNames: { invalid: "is-invalid" }
});
Vue.use(VueTruncate);
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

const options = {
    confirmButtonColor: "#05314d",
    cancelButtonColor: "#05314d"
};

Vue.use(VueSweetalert2, options);