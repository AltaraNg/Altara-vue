import Vue from "vue";
import Vuex from "vuex";
import "es6-promise/auto";
import modules from "./modules";
import createLogger from "vuex/dist/logger";
import { get } from "../utilities/api";

const getYears = () => {
    let years = [],
        startYear = new Date().getFullYear();
    for (let i = 0; i < 6; i++) years.push(startYear--);
    return years;
};

const admin = [1, 2, 8, 9, 30, 40];

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== "production";
export const store = new Vuex.Store({
    modules, //all modules automatically imported. just follow the store modules naming convention
    plugins: debug ? [createLogger()] : [],
    strict: debug, //TODO: uncomment this later to be able to structure vuex for scaling
    state: {
        inHouse: null,
        years: getYears(),
        banks: null,
        states: null,
        uncontacted: null,
        branches: null,
        paymentMethods: null,
        lifestyleBranches: [8],
        /*note this is different from other number used in the array
            below, this one is the id of the lifestyle branches
            the others below are role id for users*/
        loader: true,
        ProfileAccess: [],
        ProfileEditAccess: [],
        typeaheadUsersList: null,
        api_token: localStorage.getItem("api_token"),
        authRole: parseInt(localStorage.getItem("role")),
        user_id: parseInt(localStorage.getItem("user_id")),

        /*object for access controls*/
        DSALead: [...admin, 15, 32],
        DSACaptain: [...admin, 15, 17, 29, 32, 46, 46],
        AdminAccess: [...admin],
        GeneralAccess: [...admin, 14, 15, 17, 18, 19, 21, 22, 29, 44, 45, 32, 46, 47],
        DSAAccess: [...admin, 14, 15, 17, 18, 19, 21, 22, 29, 44, 45, 32, 46, 47],
        DVALead: [...admin, 13, 16, 22, 32],
        DVAAccess: [...admin, 13, 16, 21, 22, 23, 26, 32, 34],
        HRMAccess: [...admin, 6, 7, 32],
        peoplesOps: [...admin, 6, 7],
        FSLLead: [...admin, 11, 32, 14],
        CreditChecker: [...admin, 34],
        supervisor: [...admin, 11, 14],
        FSLAccess: [...admin, 11, 14, 19, 32],
        LOGLead: [...admin, 11, 32],
        LOGAccess: [...admin, 11, 14, 32],
        CAGAccess: [...admin, 30],
        LogDirectDebit: [...admin, 22],
        AuditorAccess: [...admin, 30],
        EditPayment: [...admin, 8, 32, 14],
        ACCAccess: [...admin, 26, 31],
        ALTARAPAYAccess: [...admin, 33],
        CASHLOANAccess: [...admin, 42],
        BNPLAccess: [...admin],
        CreditCheckAccess: [...admin, 34, 16, 21, 22],
        CoordinatorAccess: [...admin, 32],
        CoordinatorOnlyAccess: [32],
        DVACaptain: [...admin, 22],

        months: [
            { id: "01", name: "January" },
            { id: "02", name: "February" },
            { id: "03", name: "March" },
            { id: "04", name: "April" },
            { id: "05", name: "May" },
            { id: "06", name: "June" },
            { id: "07", name: "July" },
            { id: "08", name: "August" },
            { id: "09", name: "September" },
            { id: "10", name: "October" },
            { id: "11", name: "November" },
            { id: "12", name: "December" },
        ],
    },
    getters: {
        getBanks: (state) => state.banks,
        getYears: (state) => state.years,
        getStates: (state) => state.states,
        getMonths: (state) => state.months,
        getUncontacted: (state) => state.uncontacted,
        getBranches: (state) => state.branches,
        getPaymentMethods: (state) => state.paymentMethods,
        getTypeaheadUsersList: (state) => state.typeaheadUsersList,
        auth: (state) => (role) => state[role].includes(state.authRole),
        getAuthUserDetails: (state) => ({
            userId: state.user_id,
            roleId: state.authRole,
            apiToken: state.api_token,
        }),
    },
    mutations: {
        mutateAuth: (state, inHouse) => {
            Vue.set(state, "authRole", parseInt(localStorage.getItem("role")));
            Vue.set(state, "api_token", localStorage.getItem("api_token"));
            Vue.set(state, "user_id", localStorage.getItem("user_id"));
            Vue.set(state, "inHouse", inHouse);
        },
        mutateBanks: (state, banks) => Vue.set(state, "banks", banks),
        mutateStates: (state, states) => Vue.set(state, "states", states),
        mutateProfileAccess: (state, payload) => state.ProfileAccess.push(payload),
        mutateBranches: (state, branches) => Vue.set(state, "branches", branches),
        mutateUncontacted: (state, uncontacted) => Vue.set(state, "uncontacted", uncontacted),
        mutatePaymentMethods: (state, paymentMethods) => Vue.set(state, "paymentMethods", paymentMethods),
        mutateTypeaheadUsersList: (state, typeaheadUsersList) => Vue.set(state, "typeaheadUsersList", typeaheadUsersList),

        TOGGLE_LOADER: (state, data) => Vue.set(state, "loader", data),
    },
    actions: {
        mutateAuth: ({ commit }, inHouse) => commit("mutateAuth", inHouse),
        mutateBanks: ({ commit }, banks) => commit("mutateBanks", banks),
        mutateStates: ({ commit }, states) => commit("mutateStates", states),
        mutateUncontacted: ({ commit }, uncontacted) => commit("mutateUncontacted", uncontacted),
        mutateBranches: ({ commit }, branches) => commit("mutateBranches", branches),
        mutateProfileAccess: ({ commit }, payload) => commit("mutateProfileAccess", payload),
        mutatePaymentMethods: ({ commit }, paymentMethods) => commit("mutatePaymentMethods", paymentMethods),
        mutateTypeaheadUsersList: ({ commit }, typeaheadUsersList) => commit("mutateTypeaheadUsersList", typeaheadUsersList),

        toggleLoader: ({ commit }, bool) => commit("TOGGLE_LOADER", bool),
        refreshUser: async ({ commit }) => {
            commit("TOGGLE_LOADER", true);
            await get("/api/auth/user").then(({ data }) => {
                if (data.data) {
                    commit("mutateAuth", data.data["user "].in_house);
                }
                commit("TOGGLE_LOADER", false);
            });
        },

        // TODO:: cleanup
    },
});
