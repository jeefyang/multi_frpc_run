<template>
    <n-modal v-model:show="dataStore.showLogin" :close-on-esc="false" :mask-closable="false">
        <!-- 登录 -->
        <n-card style="width: 100%" title="请登录" :bordered="false" size="huge" role="dialog" aria-modal="true">
            <n-form ref="formRef" :model="model">
                <n-form-item label="用户" path="user" :rule="[{ required: true, message: '请输入用户名' }]">
                    <n-input v-model:value="model.user" placeholder="请输入用户名" />
                </n-form-item>
                <n-form-item label="密码" path="password" :rule="[{ required: true, message: '请输入密码' }]">
                    <n-input type="password" v-model:value="model.password" placeholder="请输入密码" show-password-on="click" :input-props="{ autocomplete: 'off' }" />
                </n-form-item>
            </n-form>
            <template #footer>
                <n-flex justify="end">
                    <n-button type="primary" @click="submit">登录</n-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>
<script setup lang="ts">
import { useDataStore } from "../stores/data";
import pinia from "../stores";
import { onMounted, reactive, ref } from "vue";
import { useMessage, type FormInst } from "naive-ui";
import { jhttp } from "../apis";

const dataStore = useDataStore(pinia);
const formRef = ref<FormInst | null>(null);
const message = useMessage();

const model = reactive<LoginType>({
    user: "",
    password: ""
});

const init = async () => {
    if (!dataStore.getToken()) {
        dataStore.showLogin = true;
        return;
    }
};

const submit = async () => {
    await formRef.value!.validate();

    const res = await jhttp.login({ ...model });
    if (res.code != 200) {
        message.error(res.msg || "登录失败");
        return;
    }
    dataStore.setToken(res.data.token);
    dataStore.showLogin = false;
    model.user = "";
    model.password = "";
    dataStore.refreshCount++;
};

onMounted(() => {
    init();
});
</script>
<style lang="css" scoped></style>
