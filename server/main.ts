import path from "path";
import fs from "fs";
import express from "express";
import cors from "cors";
import { ApiInit } from "./apisInit";

export class Main {

    /** 资源目录 */
    readonly resDir: string = './res';
    /** 配置 */
    config: Partial<ConfigType> = {};
    /** frp 版本列表文件夹 */
    readonly frpVerListDir: string = path.join(this.resDir, 'frpVerList');
    /** frpc客户端文件夹 */
    readonly frpcListDir: string = path.join(this.resDir, 'frpcList');


    readonly app = express();

    constructor() {
    }

    /** 初始化 */
    async init() {
        this.initConfig();
        this.setPlugin();
        this.setVue();
        ApiInit.bind(this)();
    }

    /** 初始化配置文件 */
    async initConfig() {

        // 初始化文件夹
        [this.frpVerListDir, this.frpcListDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });


        const f = path.join(this.resDir, 'config.json');

        if (!fs.existsSync(f)) {
            this.config.user = process.env.VITE_INIT_USER;
            this.config.password = process.env.VITE_INIT_PASSWORD;
            this.updateConfig();
        }
        else {
            const str = fs.readFileSync(f, "utf-8");
            const j: ConfigType = JSON.parse(str);
            for (let k in j) {
                //@ts-expect-error
                this.config[k] = j[k];
            }
        }
    }

    /** 更新配置文件 */
    updateConfig() {
        const f = path.join(this.resDir, 'config.json');
        fs.writeFileSync(f, JSON.stringify(this.config), "utf-8");
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