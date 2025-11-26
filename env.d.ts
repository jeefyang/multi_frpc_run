/// <reference types="vite/client" />


type env = {
    /** api基础路径 */
    VITE_API_BASE_URL: string,
    /** 当前环境 */
    VITE_NODE_ENV: string;
    /** 网页端的 Vue 目录 */
    VITE_VUE_DIR: string;
    /** 端口 */
    VITE_PORT: string;
    /** 初始用户 */
    VITE_INIT_USER: string;
    /** 初始密码 */
    VITE_INIT_PASSWORD: string;
    /** token 最大数量,相当于用户端同时在线数量 */
    VITE_TOKEN_MAX: string;
};

declare namespace NodeJS {
    interface ProcessEnv extends env { }

}

interface ImportMetaEnv extends env { }