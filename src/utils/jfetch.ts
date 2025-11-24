
import pinia from "@/stores";
import { useDataStore } from "@/stores/data";

const dataStore = useDataStore(pinia);
export async function jfetch(methods: 'GET' | "POST", url: string, data?: any): Promise<JFetchResult> {
    const headers = new Headers({
        "Content-Type": "application/json",
        'token': dataStore.getToken(),
    });
    const list: { mehtod: "GET" | "POST", fn: () => Promise<Response>; }[] = [
        {
            mehtod: "GET",
            fn: () => {
                const param = new URLSearchParams(data || {});
                return fetch('api' + url + "?" + param, {
                    method: methods,
                    headers,
                });
            }
        },
        {
            mehtod: "POST",
            fn: () => {
                return fetch("api" + url, {
                    method: methods,
                    headers,
                    body: JSON.stringify(data || {})
                });
            }
        }
    ];
    const item = list.find(item => item.mehtod === methods);
    if (!item) {
        const msg = `暂不支持 ${methods} 请求`;
        console.warn(msg);
        return { code: -1, msg };

    }
    try {
        const res = await item.fn();
        if (res.status == 401) {
            dataStore.showLogin = true;
        }
        return res.json();
    }
    catch (e) {
        console.error(e);
        return { code: 666, msg: "请求异常", err: e };
    }


}