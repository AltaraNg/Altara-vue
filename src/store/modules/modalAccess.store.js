const initialState = () => ({
    showSMSModal: false,
    showCustomerManagerModal: false,
    showMobileMessageModal: false,
});

const state = initialState();

const getters = {
    showSMSModal: state => state.showSMSModal,
    showMobileMessageModal: state => state.showMobileMessageModal,
    showCustomerManagerModal: state => state.showCustomerManagerModal
};

const actions = {
    showSMSModal: ({commit}, bool) => commit('SET_SMS_MODAL', bool),
    showMobileMessageModal: ({commit}, bool) => commit('SET_MOBILE_MESSAGE_MODAL', bool),
    showCustomerManagerModal: ({commit}, bool) => commit('SET_CUSTOMER_MANAGER_MODAL', bool),
    addCustomerOptionsModalsToDom: ({commit}) => commit('ADD_CUSTOMER_OPTIONS_MODALS_TO_DOM'),
    removeCustomerOptionsModalsFromDom: ({commit}) => commit('REMOVE_CUSTOMER_OPTIONS_MODALS_FROM_DOM'),
    reset: ({commit}) => commit('RESET')
};

const mutations = {
    SET_SMS_MODAL: (state, data) => state.showSMSModal = data,
    SET_MOBILE_MESSAGE_MODAL: (state,data) => state.showMobileMessageModal= data,
    SET_CUSTOMER_MANAGER_MODAL: (state, data) => state.showCustomerManagerModal = data,
    ADD_CUSTOMER_OPTIONS_MODALS_TO_DOM: (state) => {
        state.showSMSModal = true;
        state.showMobileMessageModal = true;
        state.showCustomerManagerModal = true;
    },
    REMOVE_CUSTOMER_OPTIONS_MODALS_FROM_DOM: (state) => {
        state.showSMSModal = false;
        state.showMobileMessageModal = false;
        state.showCustomerManagerModal = false;
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