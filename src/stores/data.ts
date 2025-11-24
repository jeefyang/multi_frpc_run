import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useDataStore = defineStore('data', () => {
    let token = localStorage.getItem('token') || "";
    const showLogin = ref(false);
    const setToken = (curToken: string) => {
        localStorage.setItem('token', curToken);
        token = curToken;
    };

    const clearToken = () => {
        localStorage.removeItem('token');
        token = "";
    };

    const getToken = () => {
        return token;
    };

    return {
        clearToken,
        setToken,
        getToken,
        showLogin
    };
});
