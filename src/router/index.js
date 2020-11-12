import Vue from "vue";
import VueRouter from "vue-router";
import Flash from "../utilities/flash";
import { store } from "../store/store";
import { routerHistory, writeHistory } from "vue-router-back-button";

const Login = () =>
    import ("../views/auth/Login.vue");
const NotFound = () =>
    import ("../views/NotFound.vue");

Vue.use(VueRouter);
Vue.use(routerHistory);
const router = new VueRouter({
    hashbang: false,
    history: true,
    linkActiveClass: "active",
    mode: "history",
    routes: [
        { path: "/", redirect: { name: "login" } },
        { path: "/login", component: Login, name: "login" },
        {
            path: "/not-found",
            component: NotFound,
            meta: { requiresAuth: true }
        },
        { path: "*", component: NotFound, meta: { requiresAuth: true } }
    ]
});

router.mode = "html5";
router.afterEach(writeHistory);
router.afterEach(() => (store.state.loader = false));
router.beforeEach((to, from, next) => {
    const home = to.path
        .split("/")
        .filter(Boolean)[0]
        .toUpperCase();
    const token = localStorage.getItem("api_token");
    const reRoute = path => {
        Flash.setError("You do not have access to that page!");
        return next({ name: path });
    };

    home === "PASSWORD" && token ? reRoute("home") : next();

    if (to.matched.some(route => route.meta.requiresAuth)) {
        token ? next() : reRoute("login");
    }

    if (to.matched.some(m => m.meta[home])) {
        store.getters.auth(home + "Access") ? next() : reRoute("home");
    }
    next();
});
export default router;