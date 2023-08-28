window.$ = window.jQuery = require("jquery");
window.Popper = require("popper.js").default;
require("bootstrap");
import Vue from 'vue'
var VueTruncate = require("vue-truncate-filter");
import App from './App.vue'
import VueRouterMultiView from 'vue-router-multi-view'
import router from './router'
import VeeValidate from "vee-validate";
import VueSweetalert2 from "vue-sweetalert2";
import VuexRouterSync from "vuex-router-sync";
import _ from 'lodash';
import { store } from './store/store'
import '../src/assets/css/_mixins.scss'
import '../src/assets/css/_variables.scss'
import '../src/assets/css/app.scss'
import VModal from 'vue-js-modal'
// import '../src/assets/css/bootstrap.min.css'
// import '../src/assets/css/now-ui-kit.css'
import "./utilities/globalFunctions.js";
import 'sweetalert2/dist/sweetalert2.min.css';

import './utilities/CustomValidation'


Vue.config.productionTip = false
Object.defineProperty(Vue.prototype, '$_', { value: _ });
VuexRouterSync.sync(store, router);
Vue.use(VeeValidate, {
    useConstraintAttrs: false,
    events: "",
    classes: true,
    classNames: { invalid: "is-invalid" }
});
Vue.use(VueRouterMultiView);
Vue.use(VueTruncate);
Vue.use(VModal);
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