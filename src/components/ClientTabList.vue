<template>
    <n-flex vertical style="height: 100%">
        <div>{{ tabStatus }}</div>
        <div>{{ dataStore.curClient.name }}</div>
    </n-flex>
</template>
<script setup lang="ts">
import { onActivated, ref, onDeactivated, onMounted, watch } from "vue";
import { useDataStore } from "../stores/data";
import pinia from "../stores";

const dataStore = useDataStore(pinia);
const oldClientUuid = ref("");
const tabStatus = ref(<typeof dataStore.clientTabStatus>"");
const isActive = ref(false);

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
