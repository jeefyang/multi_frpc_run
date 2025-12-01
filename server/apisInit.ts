
import { Main } from "./main";
import axios from "axios";
import path from 'path';
import fs, { ReadStream } from 'fs';
import { nanoid, customAlphabet } from "nanoid";
import request from "request";



export function ApiInit(this: Main) {
    const apiUrl = '/api';


    // 获取frp版本列表
    this.prefixProcessList[apiUrl + "/get/frp/ver/list"] = {
        isVerify: true
    };
    this.appGet(apiUrl + "/get/frp/ver/list", async (req, res) => {

        const { forceUpdate } = req.query;
        const data = await this.getFrpVerListData(forceUpdate);
        res.status(200).json({
            code: 200,
            msg: "操作成功",
            data: data
        } as JFetchResult);
    });

    this.prefixProcessList[apiUrl + "/get/frpc/list"] = {
        isVerify: true
    };
    // 获取frpc客户端列表
    this.appGet(apiUrl + "/get/frpc/list", async (req, res) => {

        const data = this.getFrpcConfigListData();
        res.status(200).json({
            code: 200,
            msg: "操作成功",
            data: data
        } as JFetchResult);
    });


    // 登录
    this.appPost(apiUrl + "/login", async (req, res) => {
        const { user, password } = req.body as LoginType;
        if (this.config.user != user || this.config.password != password) {
            res.status(401).json({
                code: 401,
                msg: "用户名或密码错误",
                data: null
            } as JFetchResult);
            return;
        }
        const token = nanoid(128);
        if (!this.config.tokenList) {
            this.config.tokenList = [];
        }
        this.config.tokenList.push(token);
        if (this.config.tokenList.length > parseInt(process.env.VITE_TOKEN_MAX || '1')) {
            this.config.tokenList = this.config.tokenList.slice(this.config.tokenList.length - parseInt(process.env.VITE_TOKEN_MAX || '1'));
        }
        this.updateConfig();
        res.status(200).json({
            code: 200,
            msg: "操作成功",
            data: {
                token: token
            }
        } as JFetchResult);
    });

    // 验证用户
    this.appPost(apiUrl + "/verify/user", async (req, res) => {
        const { token } = req.body as verifyUserType;
        if (!this.config.tokenList) {
            this.config.tokenList = [];
        }
        if (!this.config.tokenList.includes(token || "")) {
            res.status(401).json({
                code: 401,
                msg: "用户未登录",
                data: null
            });
        }
    });


    // 修改用户信息
    this.appPost(apiUrl + "/edit/user", async (req, res) => {
        const { user, password, oldUser, oldPassword } = req.body as EditUserType;
        if (this.config.user != oldUser || this.config.password != oldPassword) {
            res.status(500).json({
                code: 500,
                msg: "用户名或密码错误",
                data: null
            } as JFetchResult);
            return;
        }
        if (user) {
            this.config.user = user;
        }
        if (password) {
            this.config.password = password;
        }
        this.config.tokenList = [];
        const token = nanoid(128);
        this.config.tokenList.push(token);
        this.updateConfig();
        return res.status(200).json({
            code: 200,
            msg: "操作成功",
            data: {
                token: token
            }
        } as JFetchResult);
    });

    this.prefixProcessList[apiUrl + "/add/client"] = {
        isVerify: true
    };
    // 添加frpc客户端
    this.appPost(apiUrl + "/add/client", async (req, res) => {
        const body = req.body as ClientConfigType;
        if (!body.name || !body.domain || !body.platform || !body.version) {
            return res.status(200).json({
                code: 500,
                msg: "参数缺失",
                data: null
            });
        }
        let index = this.getFrpcConfigListData().findIndex(item => item.name == body.name);
        if (index != -1) {
            return res.status(200).json({
                code: 500,
                msg: "名称已存在",
                data: null
            });
        }
        index = this.getFrpcConfigListData().findIndex(item => item.domain == body.domain);
        if (index != -1) {
            return res.status(200).json({
                code: 500,
                msg: "域名已存在",
                data: null
            });
        }
        const frpVerList = await this.getFrpVerListData();
        const verList = frpVerList[body.platform];
        if (!verList || verList.length == 0) {
            return res.status(200).json({
                code: 500,
                msg: "平台不存在",
                data: null
            });
        }
        index = verList.findIndex(item => item.version == body.version);
        if (index == -1) {
            return res.status(200).json({
                code: 500,
                msg: "版本不存在",
                data: null
            });
        }
        const item = verList[index];
        if (!item.isDownloaded) {
            console.log(`正在下载 ${item.name}`);
            await this.downloadFrp(item.downLoadUrl, item.name, (p) => {
                console.log(`进度：[${"*".repeat(p / 2)}${"-".repeat(50 - p / 2)}] ${p}%`);
            });
            item.isDownloaded = true;
            this.updateFrpVerListData(frpVerList);
            console.log(`下载完成 ${item.name}`);
        }
        const nano = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 32);
        const uuid = nano(8);
        console.log(`开始解压 ${item.name}`);
        await this.extractFrp(item.name, uuid, (p) => {
            console.log(`进度：[${"*".repeat(p / 2)}${"-".repeat(50 - p / 2)}] ${p}%`);
        });
        console.log(`解压完成 ${item.name}`);
        const config: ClientConfigType = {
            ...body, uuid: uuid
        };
        const list = this.getFrpcConfigListData();
        list.push(config);
        this.updateFrpcConfigListData(list);
        fs.writeFileSync(path.join(this.frpcListDir, uuid, 'config.json'), JSON.stringify(config), 'utf-8');
        console.log(`添加新的客户端 ${body.name} 成功, uuid ${uuid}`);
        return res.status(200).json({
            code: 200,
            msg: "添加成功",
            data: config
        } as JFetchResult);
    });
}