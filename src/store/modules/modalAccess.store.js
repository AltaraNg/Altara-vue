const initialState = () => ({
    showSMSModal: false,
    showCustomerManagerModal: false,
    showMobileMessageModal: false,
    showPaystackModal: false,
    ShowCustomDirectDebitModal: false,
});

const state = initialState();

const getters = {
    showSMSModal: state => state.showSMSModal,
    showMobileMessageModal: state => state.showMobileMessageModal,
    showCustomerManagerModal: state => state.showCustomerManagerModal,
    showPaystackModal: state => state.showPaystackModal,
    ShowCustomDirectDebitModal: state => state.ShowCustomDirectDebitModal
};

const actions = {
    showPaystackModal: ({commit}, bool) => commit('SET_PAYSTACK_MODAL', bool),
    ShowCustomDirectDebitModal: ({commit}, bool) => commit('SET_CUSTOM_DIRECT_DEBIT_MODAL', bool),
    showSMSModal: ({commit}, bool) => commit('SET_SMS_MODAL', bool),
    showMobileMessageModal: ({commit}, bool) => commit('SET_MOBILE_MESSAGE_MODAL', bool),
    showCustomerManagerModal: ({commit}, bool) => commit('SET_CUSTOMER_MANAGER_MODAL', bool),
    addCustomerOptionsModalsToDom: ({commit}) => commit('ADD_CUSTOMER_OPTIONS_MODALS_TO_DOM'),
    removeCustomerOptionsModalsFromDom: ({commit}) => commit('REMOVE_CUSTOMER_OPTIONS_MODALS_FROM_DOM'),
    reset: ({commit}) => commit('RESET')
};

const mutations = {
    SET_PAYSTACK_MODAL: (state, data) => state.showPaystackModal = data,
    SET_CUSTOM_DIRECT_DEBIT_MODAL: (state, data) => state.ShowCustomDirectDebitModal = data,
    SET_SMS_MODAL: (state, data) => state.showSMSModal = data,
    SET_MOBILE_MESSAGE_MODAL: (state,data) => state.showMobileMessageModal= data,
    SET_CUSTOMER_MANAGER_MODAL: (state, data) => state.showCustomerManagerModal = data,
    ADD_CUSTOMER_OPTIONS_MODALS_TO_DOM: (state) => {
        state.showSMSModal = true;
        state.showMobileMessageModal = true;
        state.showCustomerManagerModal = true;
        state.showPaystackModal = true;
        state.ShowCustomDirectDebitModal = true
    },
    REMOVE_CUSTOMER_OPTIONS_MODALS_FROM_DOM: (state) => {
        state.showSMSModal = false;
        state.showMobileMessageModal = false;
        state.showCustomerManagerModal = false;
        state.showPaystackModal = false;
        state.ShowCustomDirectDebitModal = false;
    },
    RESET(state) {
        const newState = initialState();
        Object.keys(newState).forEach(key => {
            state[key] = newState[key]
        });
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
