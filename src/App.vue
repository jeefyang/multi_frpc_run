<script setup lang="ts">
import { darkTheme, useMessage } from "naive-ui";
import { Add12Filled } from "@vicons/fluent";
import { MdRefresh } from "@vicons/ionicons4";
import { onMounted } from "vue";

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
                <n-flex style="gap: 0;">
                    <div style="flex: 1">
                        <n-button style="width: 100%">123</n-button>
                    </div>
                     <n-button>
                            <n-icon size="15">
                                <Add12Filled></Add12Filled>
                            </n-icon>
                        </n-button>
                           <n-button>
                            <n-icon size="15">
                                <MdRefresh></MdRefresh>
                            </n-icon>
                        </n-button>
                </n-flex>

                <!-- <n-dropdown trigger="hover" placement="bottom-start">
                    <n-button> 找个地方休息 </n-button>
                </n-dropdown> -->
            </NNotificationProvider>
        </NMessageProvider>
    </n-config-provider>
</template>

<style scoped></style>
