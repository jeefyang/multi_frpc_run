<template>
    <div :style="{ height: props.height }">
        <n-flex style="gap: 0" class="max-height">
            <div style="flex: 1">
                <n-button class="max-height" style="width: 100%" @click="dataStore.showClientList = true">{{ dataStore?.curClient?.name || "无" }}</n-button>
            </div>
            <!-- 添加 -->
            <n-button @click="addFn" class="max-height">
                <n-icon size="15">
                    <Add12Filled></Add12Filled>
                </n-icon>
            </n-button>
            <!-- 刷新 -->
            <n-button @click="refreshFn" class="max-height">
                <n-icon size="15">
                    <MdRefresh></MdRefresh>
                </n-icon>
            </n-button>
        </n-flex>
    </div>

    <n-modal title="客户端列表" v-model:show="dataStore.showClientList" preset="dialog" :mask-closable="true">
        <!-- 列表 -->
        <n-flex v-if="dataStore.clientList.length > 0" style="max-height: 60vh; overflow: auto">
            <n-tooltip trigger="hover" v-for="(item, index) in dataStore.clientList" :key="item.uuid">
                <template #trigger>
                    <n-card
                        :title="item.name"
                        @click="toClient(item)"
                        size="small"
                        :style="{
                            color: item.uuid === dataStore.curClient.uuid ? themeVars.primaryColor : undefined,
                            'border-color': item.uuid === dataStore.curClient.uuid ? themeVars.primaryColor : undefined
                        }"
                        :header-style="{ '--n-title-text-color': item.uuid === dataStore.curClient.uuid ? themeVars.primaryColor : undefined }"
                    >
                        <n-flex vertical>
                            <div>
                                <span>域名:</span>
                                <span>{{ item.domain }}</span>
                            </div>
                            <div>备注:{{ item.remark }}</div>
                        </n-flex>
                    </n-card>
                </template>
                {{ item.desc || "无" }}
            </n-tooltip>
        </n-flex>
        <n-result v-else status="404" title="暂无客户端" description="请添加新的客户端">
            <template #footer>
                <n-button @click="addFn">添加</n-button>
            </template>
        </n-result>
    </n-modal>
</template>
<script setup lang="ts">
import { Add12Filled } from "@vicons/fluent";
import { MdRefresh } from "@vicons/ionicons4";
import { useDataStore } from "../stores/data";
import pinia from "../stores";
import { jhttp } from "../apis";
import { onMounted, ref, watch } from "vue";
import { useThemeVars } from "naive-ui";

const themeVars = useThemeVars();

const props = defineProps({
    height: {
        type: String,
        default: "100px"
    }
});

const dataStore = useDataStore(pinia);

const addFn = () => {
    dataStore.showClientList = false;
    dataStore.contentStatus = "addClient";
};

const refreshFn = async () => {
    dataStore.loading = true;
    await getFrpcList();
    dataStore.loading = false;
};

const toClient = (item: ClientConfigType) => {
    dataStore.curClient = item;
    dataStore.contentStatus = "curClient";
    dataStore.showClientList = false;
    dataStore.refreshCount++;
};

const getFrpcList = async () => {
    if (!dataStore.getToken()) {
        return;
    }
    const res = await jhttp.getFrpcList();
    if (res.code == 200) {
        dataStore.clientList = res.data;
    }
};

watch(
    () => dataStore.refreshCount,
    async () => {
        refreshFn();
    }
);

onMounted(() => {
    getFrpcList();
});
</script>
<style lang="css" scoped>
.max-height {
    height: 100%;
}
</style>
