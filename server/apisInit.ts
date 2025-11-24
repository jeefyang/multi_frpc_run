
import { Main } from "./main";
import axios from "axios";
import path from 'path';


export function ApiInit(this: Main) {
    const apiUrl = '/api';

    this.app.get(apiUrl + "/get/frpc/ver/list", async (req, res) => {

        const r = await axios.get("https://api.github.com/repos/fatedier/frp/releases?per_page=100&page=1");
        const j: GithubFrpRelasesReturnType = r.data;
        const list: FrpVerListType = {};
        for (let i = 0; i < j.length; i++) {
            const c = j[i];
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
                    downLoadUrl: url,
                    platform,
                    ver,
                    isDownload: false
                };
                if (!list[platform]) {
                    list[platform] = [];
                }
                list[platform].push(o);
            }
        }
        res.status(200).json({
            code: 200,
            msg: "操作成功",
            data: list
        } as JFetchResult);
    });
}