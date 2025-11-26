<template>
    <div>
        <div style="font-size: 32px; text-align: center; margin-bottom: 10px;margin-top: 20px;">添加新的客户端</div>
        <n-form ref="formRef" :model="model" style="height: 70vh">
            <n-form-item label="名称" path="name" :rule="[{ required: true, message: '请输入名称' }]">
                <n-input v-model:value="model.name" placeholder="请输入名称" />
            </n-form-item>
            <n-form-item label="域名" path="domain" :rule="[{ required: true, message: '请输入域名' }]">
                <n-input v-model:value="model.domain" placeholder="请输入域名" />
            </n-form-item>
            <n-form-item label="平台" path="platform" :rule="[{ required: true, message: '请选择平台' }]">
                <n-select v-model:value="model.platform" :options="platformList" placeholder="请选择平台" @update-value="(value) => selectPlatform(value)" />
            </n-form-item>
            <n-form-item label="版本" path="version" :rule="[{ required: true, message: '请选择版本' }]">
                <n-select v-model:value="model.version" :options="verList" placeholder="请选择版本" :disabled="verList.length == 0" />
            </n-form-item>
            <n-form-item label="描述" path="desc">
                <n-input type="textarea" v-model:value="model.desc" placeholder="请输入描述" />
            </n-form-item>
            <n-form-item label="备注" path="remark">
                <n-input v-model:value="model.remark" placeholder="请输入备注" />
            </n-form-item>
        </n-form>
        <n-button style="margin-left: 20px" type="primary" @click="sumbit">添加</n-button>
    </div>
</template>
<script setup lang="ts">
import { onActivated, onMounted, reactive, ref } from "vue";
import { useMessage, type FormInst } from "naive-ui";
import pinia from "../stores";
import { useDataStore } from "../stores/data";
import { jhttp } from "@/apis";

const dataStore = useDataStore(pinia);

const formRef = ref<FormInst | null>(null);
const model = reactive<Partial<FrpcConfigType>>({});

const message = useMessage();

/** 平台列表 */
const platformList = ref(<{ label: string; value: string }[]>[]);
/** 版本列表 */
const verList = ref(<{ label: string; value: string }[]>[]);

const sumbit = async () => {
    await formRef.value!.validate();
    dataStore.loadingMsg = "添加中,如果涉及下载,可能会很久,请耐心等待...";
    dataStore.loading = true;
    const res = await jhttp.addClient({ ...(model as Required<FrpcConfigType>) });
    dataStore.loading = false;
    if (res.code != 200) {
        message.error(res.msg || "添加失败");
    }
    // const res=await
};

const getFrpVerList = async () => {
    const res = await jhttp.getFrpVerList();
    if (res.code == 200) {
        dataStore.frpVerList = res.data;
    }
    if (dataStore.frpVerList) {
        for (let p in dataStore.frpVerList) {
            platformList.value.push({
                label: `${p} (已下载${dataStore.frpVerList[p]!.filter((item) => item.isDownloaded).length}/${dataStore.frpVerList[p]!.length})`,
                value: p
            });
        }
    }
};

const selectPlatform = (value: string) => {
    model.version = "";
    const list = dataStore.frpVerList[value];
    if (!list) {
        verList.value = [];
        return;
    }
    verList.value = list.map((item) => {
        return {
            label: `${item.version}${item.isDownloaded ? " (已下载)" : ""}`,
            value: item.version
        };
    });
};

onMounted(async () => {
    if (!dataStore.checkFrpVerList()) {
        getFrpVerList();
    }
});
</script>
<style lang="css" scoped></style>
