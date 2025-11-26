import path from "path";
import fs from "fs";
import express from "express";
import cors from "cors";
import { ApiInit } from "./apisInit";
import axios from "axios";
import request from "request";
import zlib from "zlib";
import * as tar from "tar";
import progressStream from "progress-stream";

export class Main {

    /** 资源目录 */
    readonly resDir: string = './res';
    /** 配置 */
    config: Partial<ConfigType> = {};
    /** frp 版本列表文件夹 */
    readonly frpVerListDir: string = path.join(this.resDir, 'frpVerList');
    /** frpc客户端文件夹 */
    readonly frpcListDir: string = path.join(this.resDir, 'frpcList');
    /** frp版本列表历史记录文件 */
    readonly frpVerListHistoryJsonName: string = path.join(this.resDir, 'frpVerListHistory.json');
    /** 客户端列表缓存 */
    protected _frpcConfigListCache: FrpcConfigType[] | undefined = undefined;
    /** frp版本列表缓存 */
    protected _frpVerListCache: FrpVerListType | undefined = undefined;

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

        // 初始化配置
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

        // 初始化客户端配置列表
        this.getFrpcConfigListData("1");
    }

    /** 获取frpc客户端配置列表数据 */
    getFrpcConfigListData(forceUpdate?: any) {
        if (forceUpdate != "1") {
            if (this._frpcConfigListCache) {
                return this._frpcConfigListCache;
            }
        }
        const dirList = fs.readdirSync(this.frpcListDir);
        this._frpcConfigListCache = [];
        for (let i = 0; i < dirList.length; i++) {
            // 配置文件没有相当于当前客户端不存在
            const p = path.join(this.frpcListDir, dirList[i], 'config.json');
            if (!fs.existsSync(p)) {
                continue;
            }
            const str = fs.readFileSync(p, 'utf-8');
            const json: FrpcConfigType = JSON.parse(str);
            this._frpcConfigListCache.push(json);
        }
        return this._frpcConfigListCache;
    }

    /**  更新frpc客户端配置列表数据 */
    updateFrpcConfigListData(data: FrpcConfigType[]) {
        this._frpcConfigListCache = data;
    }

    /** 获取frp版本列表数据 */
    async getFrpVerListData(forceUpdate?: any) {
        if (forceUpdate != '1') {
            if (this._frpVerListCache) {
                return this._frpVerListCache;
            }
            if (fs.existsSync(this.frpVerListHistoryJsonName)) {
                const str = fs.readFileSync(this.frpVerListHistoryJsonName, 'utf-8');
                if (str) {
                    this._frpVerListCache = JSON.parse(str);
                }
            }
        }
        if (!this._frpVerListCache) {
            const r = await axios.get("https://api.github.com/repos/fatedier/frp/releases?per_page=100&page=1");
            let json: GithubFrpRelasesReturnType = r.data;

            this._frpVerListCache = {};
            for (let i = 0; i < json!.length; i++) {
                const c = json![i];
                for (let item of c.assets) {

                    let url = item.browser_download_url;
                    if (!url.includes('.tar.gz')) {
                        continue;
                    }
                    const name = path.basename(url);
                    const dir = path.basename(path.dirname(url));
                    const ver = dir.split("v")[1];
                    const platform = name.split(`frp_${ver}_`)[1].split('.tar.gz')[0];
                    const o: FrpVerType = {
                        name,
                        downLoadUrl: url,
                        platform,
                        version: ver,
                        isDownloaded: false
                    };
                    // 检测是否已经下载了
                    if (fs.existsSync(path.join(this.frpVerListDir, name))) {
                        o.isDownloaded = true;
                    }
                    if (!this._frpVerListCache[platform]) {
                        this._frpVerListCache[platform] = [];
                    }
                    this._frpVerListCache[platform].push(o);
                }
            }
            fs.writeFileSync(this.frpVerListHistoryJsonName, JSON.stringify(this._frpVerListCache), 'utf-8');
        }
        return this._frpVerListCache;
    }

    /** 更新frp版本列表数据 */
    updateFrpVerListData(data: FrpVerListType) {
        this._frpVerListCache = data;
        fs.writeFileSync(this.frpVerListHistoryJsonName, JSON.stringify(this._frpVerListCache), 'utf-8');
    }

    /** 下载frp */
    async downloadFrp(url: string, name: string, cb?: (percentage: number) => void) {
        return new Promise((resolve, reject) => {
            let fileStream = fs.createWriteStream(path.join(this.frpVerListDir, name));
            // 获取文件总大小
            request.head(url, (err, res) => {
                if (err) throw err;
                const totalSize = parseInt(res.headers["content-length"] as string);

                // 创建进度流
                const progStream = progressStream({
                    length: totalSize,
                    time: 1000 // 每秒更新一次进度
                });

                // 监听进度事件
                progStream.on("progress", (progress) => {

                    if (cb) {
                        const percentage = Math.round((progress.transferred / totalSize) * 100);
                        cb(percentage);
                    }

                });

                // 管道连接
                request(url)
                    .pipe(progStream)
                    .pipe(fileStream)
                    .on("finish", () => resolve(true));
            });
        });
    }

    /** 解压frp */
    async extractFrp(fileName: string, distDir: string, cb?: (percentage: number) => void) {
        // 创建文件夹
        const extractDist = path.join(this.frpcListDir, distDir);
        const dist = path.join(extractDist, 'frp');
        await new Promise((resolve, reject) => {
            const fileUrl = path.join(this.frpVerListDir, fileName);
            // 获取文件大小用于进度条
            const stats = fs.statSync(fileUrl);
            const totalSize = stats.size;

            // 创建可读流
            const readStream = fs.createReadStream(fileUrl);

            let readBytes = 0;

            if (!fs.existsSync(dist)) {
                fs.rmSync(dist, { recursive: true, force: true });
            }
            fs.mkdirSync(dist, { recursive: true });
            let timer: NodeJS.Timeout | undefined = undefined;

            if (cb) {
                timer = setTimeout(() => {
                    timer = undefined;
                }, 1000);
            }
            readStream
                .on('data', (chunk) => {
                    readBytes += chunk.length;
                    if (cb && !timer) {
                        cb(Math.round((readBytes / totalSize) * 100));
                        timer = setTimeout(() => {
                            timer = undefined;
                        }, 1000);
                    }
                })
                .pipe(
                    tar.extract({
                        cwd: extractDist,  // 输出目录
                    })
                )
                .on('close', () => {
                    resolve(true);
                })
                .on('error', (err) => {
                    reject(err);
                });
        });

        const renameFn = async (count: number) => {
            try {
                fs.renameSync(path.join(extractDist, fileName.split('.tar.gz')[0]), dist);
                return;
            }
            catch (e) {
                if (count == 0) {
                    throw e;
                }
                else {
                    console.log(`重命名 ${fileName.split('.tar.gz')[0]}->frp 失败 解压文件夹还未释放,正准备重试,还剩下${count}次重试`);
                    await new Promise(r => setTimeout(r, 3000));
                    console.log(`删除${dist},准备重新重命名`);
                    fs.rmSync(dist, { recursive: true, force: true });
                    await renameFn(count - 1);
                }
            }
        };
        console.log('开始重命名文件夹');
        await renameFn(10);
        return;
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

    protected _verifyToken(res: express.Response, token?: string) {
        if (!this.config.tokenList) {
            this.config.tokenList = [];
        }
        if (!token || typeof token != 'string' || !this.config.tokenList?.includes(token)) {
            res.status(401).json({
                code: 401,
                msg: "用户未登录",
                data: null
            } as JFetchResult);
            return false;
        }
        return true;
    }


    async myGet(o: { isVerify?: boolean; }, ...args: Parameters<typeof this.app.get>) {
        try {
            this.app.get(args[0], async (req, res, next) => {
                const { token } = req.headers;
                if (o.isVerify) {
                    if (!this._verifyToken(res, token as string)) {
                        return;
                    }
                }
                next();
            });
            return this.app.get(...args);
        }
        catch (e) {
            console.log(`get请求捕捉到错误:${args[0]}`);
            console.error(e);
        }
    }

    async myPost(o: { isVerify?: boolean; }, ...args: Parameters<typeof this.app.post>) {
        try {
            this.app.post(args[0], async (req, res, next) => {
                const { token } = req.headers;
                if (o.isVerify) {
                    if (!this._verifyToken(res, token as string)) {
                        return;
                    }
                }
                next();
            });
            return this.app.post(...args);
        }
        catch (e) {
            console.log(`post请求捕捉到错误:${args[0]}`);
            console.error(e);
        }
    }







}

const main = new Main();
main.init();

export const viteNodeApp = main.app;