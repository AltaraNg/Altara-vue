window.$ = window.jQuery = require("jquery");
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store/store'
import '../src/assets/css/_mixins.scss'
import '../src/assets/css/_variables.scss'
import '../src/assets/css/app.scss'
import '../src/assets/css/bootstrap.min.css'
import '../src/assets/css/now-ui-kit.css'
import VeeValidate from "vee-validate";
import "./utilities/globalFunctions.js";

Vue.config.productionTip = false

Vue.use(VeeValidate, {
    events: "input|blur",
    classes: true,
    classNames: { invalid: "is-invalid" }
});
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')