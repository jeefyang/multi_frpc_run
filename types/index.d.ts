type JFetchResult = {
    code: number;
    data?: any;
    msg?: string;
    err?: any;
};

type FrpVerType = {
    platform: string;
    ver: string;
    downLoadUrl: string;
    isDownload?: boolean;
};

type FrpVerListType = { [x in string]: FrpVerType[] };

type FrpcConfigType = {
    /** 域名 */
    domain: string,
    /** 名称 */
    name: string;
    /** 描述 */
    desc: string;
    /** 备注 */
    remark: string;
    /** 唯一识别码,也是用来识别目录 */
    uuid: string;
};

type FrpcListType = FrpcConfigType[];