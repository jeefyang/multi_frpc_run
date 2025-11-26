<template>
    <div class="box" :style="{ height: props.height }">
        <!-- 空页面 -->
        <n-result style="margin-top: 30vh" v-if="dataStore.contentStatus == 'empty'" status="404" title="客户端未选中" description="请选择客户端">
            <template #footer>
                <n-button @click="dataStore.showClientList = true">选择</n-button>
            </template>
        </n-result>
        <!-- 添加客户端 -->
        <add-client v-if="dataStore.contentStatus == 'addClient'"></add-client>
        <client v-else-if="dataStore.contentStatus == 'curClient'"></client>
    </div>
</template>
<script setup lang="ts">
import { useDataStore } from "../stores/data";
import pinia from "../stores";
import AddClient from "./AddClient.vue";
import Client from "./Client.vue";

const props = defineProps<{
    height: string;
}>();

const dataStore = useDataStore(pinia);
</script>
<style lang="css" scoped>
.box {
    padding: 10px;
}
</style>
