<script setup lang="ts">
import { darkTheme, useMessage } from "naive-ui";
import Top from "./components/Top.vue";
import Login from "./components/Login.vue";
import EditUser from "./components/EditUser.vue";
import Content from "./components/Content.vue";
import Loading from "./components/Loading.vue";

import { onMounted } from "vue";
const topHeight = "30px";
const contentHeight = `calc(100vh - ${topHeight} - 20px)`;

onMounted(() => {
    // const message = useMessage();
    // message.info("欢迎来到 frp-manager");
});
</script>

<template>
    <n-config-provider :theme="darkTheme">
        <!-- 通用样式 -->
        <n-global-style />
        <!-- 通用信息提示 -->
        <NMessageProvider placement="top">
            <!-- 通用通知 -->
            <NNotificationProvider placement="bottom-right">
                <!-- 顶部 -->
                <Top :height="topHeight"></Top>
                <!-- 内容页 -->
                <Content :height="contentHeight"></Content>
                <!-- 登录 -->
                <Login></Login>
                <!-- 修改用户信息 -->
                <EditUser></EditUser>
                <!-- 刷新 -->
                <Loading></Loading>
            </NNotificationProvider>
        </NMessageProvider>
    </n-config-provider>
</template>

<style scoped></style>
