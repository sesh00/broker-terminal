import { createStore } from 'vuex';

export default createStore({
    state: {
        brokerName: '', // Имя брокера по умолчанию пустое
    },
    mutations: {
        setBrokerName(state, name) {
            state.brokerName = name;
        },
    },
    actions: {
        updateBrokerName({ commit }, name) {
            commit('setBrokerName', name);
        },
    },
    modules: {},
});
