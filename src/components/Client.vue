<template>
    <n-flex style="height: 100%" vertical>
        <KeepAlive>
            <component v-if="dataStore.clientTabStatus == 'main'" :is="ClientTabMain"></component>
            <component v-else-if="dataStore.clientTabStatus == 'list'" :is="ClientTabList"></component>
            <component v-else-if="dataStore.clientTabStatus == 'config'" :is="ClientTabConfig"></component>
        </KeepAlive>
        <!-- 导航栏 -->
        <n-flex style="gap: 0">
            <n-flex v-for="item in tabList" :key="item.name" justify="center" style="flex: 1" @click="toTab(item)">
                <n-flex vertical :style="{ color: dataStore.clientTabStatus == item.value ? themeVars.primaryColor : '#fff' }">
                    <component :is="item.icon"></component>
                    <div>{{ item.name }}</div>
                </n-flex>
            </n-flex>
        </n-flex>
    </n-flex>
</template>
<script setup lang="ts">
import { Home, List, Options } from "@vicons/ionicons5";
import { useDataStore } from "../stores/data";
import pinia from "../stores";
import { useThemeVars } from "naive-ui";
import ClientTabConfig from "./ClientTabConfig.vue";
import ClientTabList from "./ClientTabList.vue";
import ClientTabMain from "./ClientTabMain.vue";

const themeVars = useThemeVars();

const dataStore = useDataStore(pinia);

const tabList: {
    name: string;
    icon: typeof Home | typeof List | typeof Options;
    value: typeof dataStore.clientTabStatus;
}[] = [
    { name: "主要", icon: Home, value: "main" },
    { name: "列表", icon: List, value: "list" },
    { name: "设置", icon: Options, value: "config" }
];

const toTab = (item: (typeof tabList)[number]) => {
    dataStore.clientTabStatus = item.value;
};
</script>
<style lang="css" scoped></style>
