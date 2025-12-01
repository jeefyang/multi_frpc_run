<template>
    <n-flex vertical style="height: 100%; overflow: auto">
        <n-form ref="formRef" :model="model">
            <n-form-item label="服务端域名">
                <div>{{ dataStore.curClient.domain }}</div>
            </n-form-item>
            <n-form-item label="服务端端口">

            </n-form-item>

        </n-form>
        <div></div>
    </n-flex>
</template>
<script setup lang="ts">
import { onActivated, ref, onDeactivated, onMounted, watch, reactive } from "vue";
import { useDataStore } from "../stores/data";
import pinia from "../stores";
import type { FormInst } from "naive-ui";

const dataStore = useDataStore(pinia);
const oldClientUuid = ref("");
const tabStatus = ref(<typeof dataStore.clientTabStatus>"");
const isActive = ref(false);
const formRef = ref<FormInst | null>(null);

const desc = {
    serverAddr: "ServerAddr 指定要连接到的服务器的地址。",
    serverPort: "ServerPort 指定要连接到的服务器端口。",
    token: "Token 指定用于创建要发送到服务器的密钥的授权令牌。服务器必须具有匹配的令牌才能成功进行授权。",
    user: " 通常用于区分你与其他客户端",
    webServerAddr: "webServer 监听地址，默认为 127.0.0.1",
    webServerPort: "webServer 监听端口",
    webServerUser: "webServer用户名, 默认admin",
    webServerPW: "webServer密码, 默认admin",
    transportProtocol: "和 frps 之间的通信协议，可选值为 tcp, kcp, quic, websocket, wss。默认为 tcp",
    tls: "TLSEnable 指定在与服务器通信时是否应使用 TLS。,如果不是专业人士,请不要开,会搞疯自己",
    heartbeatInterval: "HeartBeatInterval 用于指定向服务器发送心跳包的间隔（以秒为单位）。不建议更改此值。默认情况下，此值为 30。",
    heartbeatTimeout: "HeartBeatTimeout 用于指定多久未收到心跳包后断开连接（以秒为单位）。不建议更改此值。默认情况下，此值为 90。",
    transportTcpMux: "TcpMux 切换 TCP 流多路复用。这允许来自客户端的多个请求共享单个 TCP 连接。如果此值为 true，则服务器必须启用 TCP 多路复用。默认情况下，此值为 true。",
    loglevel: 'LogLevel 指定最小的日志级别。有效值为"trace", "debug", "info", "warn"和"error"。默认情况下，此值为"info"',
    logdisablePrintColor: "当DisableLogColor设置为true且LogWay=='console'时禁用日志颜色",
    loginFailExit: "LoginFailExit 控制客户端在尝试登录失败后是否应退出。如果为 false，客户端将重试，直到登录成功。默认情况下，此值为 true。",
    crtContent: "crt证书内容,保存更新将覆写文件",
    crtUrl: "crt证书路径,将用于内容写入文件里,且代理时默认同步crt证书路径,指的当前客户端所在服务器的路径且位置相对于frpc程序,如不清楚客户端所在服务器的路径,请不要乱修改",
    keyContent: "key密钥内容,保存更新将覆写文件",
    keyUrl: "key密钥路径,将用于内容写入文件里,且代理时默认同步key密钥路径,指的当前客户端所在服务器的路径且位置相对于frpc程序,如不清楚客户端所在服务器的路径,请不要乱修改",

    autoRun: "pm2服务器是否自动启动,防止服务崩溃重启没有启动导致无法代理"
};

//@ts-expect-error
const model = reactive(<{ [x: keyof typeof model]: string }>{});

Object.keys(model).forEach((key) => {
    model[key] = "";
});

const refreshFn = async () => {
    console.log(`refresh ${tabStatus.value}`);
};

watch(
    () => dataStore.refreshCount,
    () => {
        if (!isActive.value) {
            return;
        }
        refreshFn();
    }
);

onDeactivated(() => {
    isActive.value = false;
});

onActivated(() => {
    isActive.value = true;
    if (oldClientUuid.value !== dataStore.curClient.uuid) {
        refreshFn();
        oldClientUuid.value = dataStore.curClient.uuid!;
    }
});

onMounted(() => {
    tabStatus.value = dataStore.clientTabStatus;
});
</script>
<style lang="css" scoped></style>
