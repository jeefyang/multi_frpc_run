import path from "path";
import fs from "fs";
import express from "express";
import cors from "cors";

export class Main {


    readonly app = express();

    constructor() {
    }

    async init() {
        this.setPlugin();
        this.setVue();
    }

    /**
     * 设置插件
     */
    setPlugin() {
        this.app.use(cors());
        this.app.use(express.json());

    }



    /** 设置vue路由 */
    async setVue() {
        // 开发模式下,直接去读取 vite 的配置文件
        if (process.env.NODE_ENV == 'development') {
            const { createServer } = await import('vite');
            const vite = await createServer({
                root: path.resolve(path.join(process.env.VITE_VUE_DIR!)),
                server: { middlewareMode: true },
                configFile: path.resolve('./vite.config.ts'),
            });
            this.app.use(vite.middlewares);
        }
        // 生产环境返回前端 HTML
        else {
            // 默认index.html
            this.app.get('/', (req, res) => {
                res.sendFile(path.resolve(path.join(process.env.VITE_VUE_DIR!, 'index.html')));
            });
            // 其他路径
            this.app.get("/{*splat}", (req, res) => {
                const splat: string[] = (<any>req.params).splat;
                res.sendFile(path.resolve(path.join(process.env.VITE_VUE_DIR!, splat.join('/'))), (e) => {
                    // 如果找不到文件,则返回 index.html
                    e && res.sendFile(path.resolve(path.join(process.env.VITE_VUE_DIR!, 'index.html')));
                });
            });
        }
    }






}

const main = new Main();
main.init();

export const viteNodeApp = main.app;