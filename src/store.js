import { createStore } from "vuex";

const store = createStore({
    state() {
        return {
            user:null
        }
    },
    mutations: {

    },
    getters:{
        user(state) {
            return state.user;
        }
    }
})

export default store;