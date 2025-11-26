<template>
    <n-modal title="修改" v-model:show="dataStore.showEditUser" preset="dialog" :mask-closable="false">
        <n-form ref="formRef" :model="model" label-placement="left" class="mt-10" label-width="auto">
            <n-form-item label="旧用户名" path="oldUser" :rule="[{ required: true, message: '请输入用户名' }]">
                <n-input v-model:value="model.oldUser" placeholder="请输入用户名" />
            </n-form-item>
            <n-form-item label="新用户名" path="user">
                <n-input v-model:value="model.user" placeholder="不输入默认不修改" />
            </n-form-item>
            <n-form-item label="旧密码" path="oldPassword" :rule="[{ required: true, message: '请输入密码' }]">
                <n-input type="password" v-model:value="model.oldPassword" placeholder="请输入密码" show-password-on="click" :input-props="{ autocomplete: 'off' }" />
            </n-form-item>
            <n-form-item label="新密码" path="password">
                <n-input type="password" v-model:value="model.password" placeholder="请输入新密码" show-password-on="click" :input-props="{ autocomplete: 'off' }" />
            </n-form-item>
            <n-form-item
                label="重复新密码"
                path="confirmPassword"
                :rule="[
                    {
                        required: !!model.password,
                        validator: () => model.confirmPassword == model.password,
                        message: '请和新的密码一样'
                    }
                ]"
            >
                <n-input type="password" v-model:value="model.confirmPassword" placeholder="请输入和新密码一样" show-password-on="click" :input-props="{ autocomplete: 'off' }" />
            </n-form-item>
        </n-form>
        <template #action>
            <n-button type="primary" @click="submit">登录</n-button>
        </template>
    </n-modal>
</template>
<script lang="ts" setup>
import type { FormInst } from "naive-ui";
import { useMessage } from "naive-ui";
import { computed, reactive, ref } from "vue";
import pinia from "../stores";
import { useDataStore } from "../stores/data";
import { jhttp } from "../apis";

const formRef = ref<FormInst | null>(null);
const message = useMessage();
const dataStore = useDataStore(pinia);

const model = reactive<EditUserType>({
    user: "",
    password: "",
    oldUser: "",
    oldPassword: "",
    confirmPassword: ""
});

const submit = async () => {
    await formRef.value!.validate();

    const res = await jhttp.editUser({ ...model });
    if (res.code != 200) {
        const message = useMessage();
        message.error(res.msg || "登录失败");
        return;
    }
    dataStore.setToken(res.data.token);
    dataStore.showEditUser = false;
    model.user = "";
    model.password = "";
    model.oldUser = "";
    model.oldPassword = "";
    model.confirmPassword = "";
};
</script>
<style lang="scss" scoped></style>
