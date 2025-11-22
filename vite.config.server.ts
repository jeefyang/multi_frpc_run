import { defineConfig, loadEnv } from 'vite';

import { VitePluginNode } from "vite-plugin-node";
import fs from "node:fs";
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    

    (['./.env.local', `./.env.${mode}.local`]).forEach(k => {
        if (!fs.existsSync(k)) {
            fs.writeFileSync(k, '');
        }
    });


    //@ts-expect-error
    const env: NodeJS.ProcessEnv = loadEnv(mode, process.cwd(), ''); // 加载所有环境变量

    const port = parseInt(env.VITE_PORT);
    return {
        define: {
            'process.env': env // 将环境变量注入到全局
        },
        plugins: [
            ...VitePluginNode({
                adapter: 'express',
                appPath: './server/main.ts',
                tsCompiler: 'esbuild', // 使用 esbuild 编译 TypeScript[1](@ref)
            }),
        ],
        server: {
            host: "0.0.0.0",
            port: port
        },
    };

});
