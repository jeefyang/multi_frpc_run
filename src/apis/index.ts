import { jfetch } from "@/utils/jfetch";

export const jhttp = {

    /** 获取frp版本列表 */
    getFrpVerList: (data?: any) => jfetch("GET", "/get/frp/ver/list", data),
    /** 获取frpc客户端列表 */
    getFrpcList: (data?: any) => jfetch("GET", "/get/frpc/list", data),
    /** 登录 */
    login: (data: LoginType) => jfetch("POST", "/login", data),
    /** 验证用户登录信息 */
    verifyUser: (data: verifyUserType) => jfetch("POST", "/verify/user", data),
    /** 修改用户信息 */
    editUser: (data: EditUserType) => jfetch("POST", "/edit/user", data),
    /** 添加frpc客户端 */
    addClient: (data: ClientConfigType) => jfetch("POST", "/add/client", data)

};