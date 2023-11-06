// Ваш код Vuex

import { createStore } from 'vuex';

export default createStore({
    state: {
        brokerData: JSON.parse(localStorage.getItem('brokerData')) || null,
        allBrokers: JSON.parse(localStorage.getItem('allBrokers')) || null,
    },
    mutations: {
        setBrokerData(state, data) {
            state.brokerData = data;
            localStorage.setItem('brokerData', JSON.stringify(data));
        },
        setAllBrokers(state, data) {
            state.allBrokers = data;
            localStorage.setItem('allBrokers', JSON.stringify(data));
        },
    },
    actions: {
        async fetchAllBrokers({ commit }) {
            try {
                const response = await fetch('http://localhost:3001/brokers');
                const data = await response.json();
                commit('setAllBrokers', data.brokers);
            } catch (error) {
                console.error('Ошибка при запросе к серверу:', error.message);
            }
        },
        async loadBrokerData({ commit, state }, brokerName) {
            try {
                if (!state.allBrokers) {
                    await this.dispatch('fetchAllBrokers');
                }

                if (Array.isArray(state.allBrokers)) {
                    const broker = state.allBrokers.find(b => b.name === brokerName);

                    if (broker) {
                        commit('setBrokerData', broker);
                        return true;
                    }
                }

                return false;
            } catch (error) {
                console.error('Ошибка при запросе к серверу:', error.message);
                return false;
            }
        },
    },
    modules: {},
});
