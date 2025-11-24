import { jfetch } from "@/utils/jfetch";

export const jhttp = {

    getFrpcVerList: () => jfetch("GET", "/get/frpc/ver/list")


};