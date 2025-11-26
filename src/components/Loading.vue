<template>
    <n-modal v-model:show="dataStore.loading" :close-on-esc="false" :mask-closable="false">
        <n-card style="width: 60vw; min-height: 200px">
            <n-flex vertical align="center">
                <div class="loading"></div>
                <div style="text-align: center;">{{ dataStore.loadingMsg || defaultMsg }}</div>
            </n-flex>
        </n-card>
    </n-modal>
</template>
<script setup lang="ts">
import { watch } from "vue";
import pinia from "../stores";
import { useDataStore } from "../stores/data";

const dataStore = useDataStore(pinia);
const defaultMsg = "正在加载中...";

watch(
    () => dataStore.loading,
    (v) => {
        if (v) {
            return;
        }
        dataStore.loadingMsg = "";
    }
);
</script>
<style lang="css" scoped>
.loading {
    position: relative;
    width: 100px;
    height: 100px;
    border: 5px solid #63e2b7;
    border-top-color: rgba(100, 100, 100, 0.5);
    border-right-color: rgba(100, 100, 100, 0.5);
    border-bottom-color: rgba(100, 100, 100, 0.5);
    border-radius: 100%;
    margin-bottom: 10px;

    animation: circle infinite 0.75s linear;
}

@keyframes circle {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
