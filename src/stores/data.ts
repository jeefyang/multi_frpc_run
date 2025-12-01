import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useDataStore = defineStore('data', () => {

    /** token */
    let token = localStorage.getItem('token') || "";
    /** 弹出登录框 */
    const showLogin = ref(false);
    /** 弹出修改用户信息框 */
    const showEditUser = ref(false);
    /** 弹出客户端列表 */
    const showClientList = ref(false);
    /** 内容页状态 */
    const contentStatus = ref(<"empty" | "addClient" | "curClient">"empty");
    /** 客户端按键金刚 */
    const clientTabStatus = ref(<"main" | "list" | "config">"main");
    /** frp版本列表 */
    const clientVerList = ref(<ClientVerListType>{});
    /** frpc客户端列表 */
    const clientList = ref(<ClientConfigType[]>[]);
    /** 当前frpc客户端 */
    const curClient = ref(<ClientConfigType>{});
    // const curFrpcToml=ref(<>)
    /** 刷新计时器 */
    const refreshCount = ref(0);
    /** 是否正在刷新 */
    const loading = ref(false);
    /** 刷新提示词 */
    const loadingMsg = ref("");

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

    /** 判断frp版本列表是否为空 */
    const checkFrpVerList = () => {
        let count = 0;
        for (let p in clientVerList.value) {
            count++;
        }
        return !!count;
    };





    return {
        clearToken,
        setToken,
        getToken,
        showLogin,
        showEditUser,
        clientVerList,
        clientList,
        curClient,
        contentStatus,
        showClientList,
        checkFrpVerList,
        loading,
        loadingMsg,
        refreshCount,
        clientTabStatus
    };
});
