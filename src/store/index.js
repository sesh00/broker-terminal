import { createStore } from 'vuex';

export default createStore({
    state: {
        brokerData: JSON.parse(localStorage.getItem('brokerData')) || null,
        allBrokers: JSON.parse(localStorage.getItem('allBrokers')) || null,
        stockData: JSON.parse(localStorage.getItem('stockData')) || null,

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

        updateStockData(state, newStockData) {
            state.stockData = newStockData;
            localStorage.setItem('stockData', JSON.stringify(newStockData));
        },
    },
    actions: {

        async loadStockData ({ commit, state }, data) {
            if (Array.isArray(state.stockData)) {
                commit('setStocksData', data);
            }
        },

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
