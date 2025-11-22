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
};

declare namespace NodeJS {
    interface ProcessEnv extends env { }

}

interface ImportMetaEnv extends env { }