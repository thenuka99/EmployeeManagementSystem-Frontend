import { AuthService } from "@/services/AuthService";
import { UserService } from "@/services/UserService";
import { NotificationHelper } from "@/helper/NotificationHelper";
import store from "..";
import router from "@/router";

// initial state
const state = () => ({
    userList: {
        users: [],
        isLoading: false,
        user: null,
        otherUser: null,
        token: "",        
        totalPages: 0,
    },
})

// getters
const getters = {
    getUserState: function (state) {
        return state.userList;
    }
}

// mutations
const mutations = {
    SET_LOADING: function (state, payload) {
        state.userList.isLoading = payload;
    },
    SET_USERS: function (state, payload) {
        state.userList.users = payload.users;
        state.userList.totalPages = payload.totalPages;
    },
    SET_LOGGED_USER: function (state, payload) {
        state.userList.user = payload.user;
    },
    SET_OTHER_USER: function (state, payload) {
        state.userList.user = payload.otherUser;
    },
    SET_TOKEN: function (state, payload) {
        state.userList.token = payload.token;
    },
}

// actions
const actions = {
    getAllUsers: async function ({ commit }, payload) {
        try {
            commit("SET_LOADING", true);
            let response = await UserService.getAllUsers(payload);
            console.log(response.data)
            if (response.data.status == 200) {
                console.log(response.data.data.docs)
            } else {
                NotificationHelper.errorhandler(response.data.msg)
            }
            commit("SET_USERS", { users: response.data.data.docs, totalPages: response.data.data.totalPages });
            commit("SET_LOADING", false);
        } catch (error) {
            NotificationHelper.errorhandler(error)
            commit("SET_LOADING", false);
        }
    },
    getAllUsersByTechnology: async function ({ commit }, payload) {
        try {
            commit("SET_LOADING", true);
            let response = await UserService.getAllUsersByTechnology(payload.id, payload.page);
            if (response.data.status == 200) {
                console.log(response.data.data.docs)
            } else {
                NotificationHelper.errorhandler(response.data.msg)
            }
            commit("SET_USERS", { users: response.data.data.docs, totalPages: response.data.data.totalPages });
            commit("SET_LOADING", false);
        } catch (error) {
            NotificationHelper.errorhandler(error)
            commit("SET_LOADING", false);
        }
    },
    getAllUsersByDesignation: async function ({ commit }, payload) {
        try {
            commit("SET_LOADING", true);
            let response = await UserService.getAllUsersByDesignation(payload.id, payload.page);
            if (response.data.status == 200) {
                console.log(response.data.data.docs)
            } else {
                NotificationHelper.errorhandler(response.data.msg)
            }
            commit("SET_USERS", { users: response.data.data.docs, totalPages: response.data.data.totalPages });
            commit("SET_LOADING", false);
        } catch (error) {
            NotificationHelper.errorhandler(error)
            commit("SET_LOADING", false);
        }
    },
    getAllUsersByName: async function ({ commit }, payload) {
        try {
            commit("SET_LOADING", true);
            let response = await UserService.getAllUsersByName(payload.id, payload.page);
            if (response.data.status == 200) {
                console.log(response.data.data.docs)
            } else {
                NotificationHelper.errorhandler(response.data.msg)
            }
            commit("SET_USERS", { users: response.data.data.docs, totalPages: response.data.data.totalPages });
            commit("SET_LOADING", false);
        } catch (error) {
            NotificationHelper.errorhandler(error)
            commit("SET_LOADING", false);
        }
    },
    getUsers: async function ({ commit }) {
        try {
            commit("SET_LOADING", true);
            let response = await UserService.getAllUsers();
            console.log(response)
            commit("SET_USERS", { users: response.data.data });
            commit("SET_LOADING", false);
        } catch (error) {
            NotificationHelper.errorhandler(error)
        }
    },
    deleteUser: async function ({ commit }, id) {
        try {
            commit("SET_LOADING", true);
            await UserService.deleteUser(id);
            NotificationHelper.notificationhandler("User deleted successfully!")
            commit("SET_LOADING", false);
            store.dispatch(this.logout)
        } catch (error) {
            NotificationHelper.errorhandler(error)
        }
    },
    updateUser: async function ({ commit }, user) {
        try {
            commit("SET_LOADING", true);
            await UserService.updateUser(user, user._id);
            let response = await UserService.getUser(user._id);
            commit("SET_LOGGED_USER", { user: response.data.data })
            NotificationHelper.notificationhandler("User updated successfully!")
            commit("SET_LOADING", false);
        } catch (error) {
            NotificationHelper.errorhandler(error)
        }
    },
    updateUserRole: async function ({ commit }, user) {
        try {
            commit("SET_LOADING", true);
            await UserService.updateUser(user, user._id);
            store.dispatch('getUsers')
            NotificationHelper.notificationhandler("UserRole change successfully!")
            commit("SET_LOADING", false);
        } catch (error) {
            NotificationHelper.errorhandler(error)
        }
    },
    signup: async function ({ commit }, user) {
        try {
            commit("SET_LOADING", true);
            const response = await AuthService.signup(user);
            console.log(response)
            if (response.data.status == 200) {
                NotificationHelper.notificationhandler("User registered successfully!")
                commit("SET_LOADING", false);
                return router.push("/signin");
            } else {
                NotificationHelper.errorhandler(response.data.msg)
            }
        } catch (error) {
            NotificationHelper.errorhandler(error)
        }
    },
    login: async function ({ commit }, user) {
        try {
            const response = await AuthService.login(user);
            if (response.data.status == 200) {
                commit("SET_TOKEN", { token: response.data.data })
                store.dispatch('getUser', { token: response.data.data })
            } else {
                NotificationHelper.errorhandler(response.data.msg)
                console.log(response.data.msg)
            }
        } catch (error) {
            this.errorhandler(error)
        }
    },
    logout: async function ({ commit }) {
        commit("SET_LOGGED_USER", { contact: null });
        commit("SET_TOKEN", { token: null });
    },
    getUser: async function ({ commit }, token) {
        try {
            let response = await AuthService.getUserDetails(token);
            commit("SET_LOGGED_USER", { user: response.data.data })
            NotificationHelper.notificationhandler("Successfully login in!")
            return router.push("/");
        } catch (error) {
            NotificationHelper.errorhandler(error)
        }
    },

}

export default {
    state,
    getters,
    actions,
    mutations
}