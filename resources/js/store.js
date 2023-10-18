import { createStore } from 'vuex';

const store = createStore({
    state() {
        return {
            dataCompartilhada: null
        };
    },
    mutations: {
        setData(state, payload) {
            state.dataCompartilhada = payload;
        }
    },
    actions: {
        setData({ commit }, payload) {
            commit('setData', payload);
        }
    }
});

export default store;
