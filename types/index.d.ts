type JFetchResult = {
    code: number;
    data?: any;
    msg?: string;
    err?: any;
};

type FrpVerType = {
    /** 文件名 */
    name: string;
    /** 平台 */
    platform: string;
    /** 版本 */
    version: string;
    /** 下载地址 */
    downLoadUrl: string;
    /** 是否已经下载 */
    isDownloaded?: boolean;
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
    /** 平台 */
    platform: string;
    /** 版本 */
    version: string;
    /** 唯一识别码,也是用来识别目录 */
    uuid?: string;
};

// type FrpcListType = FrpcConfigType[];


type LoginType = {
    user: string;
    password: string;
};

type EditUserType = {
    oldUser: string;
    oldPassword: string;
    user?: string;
    password?: string;
    confirmPassword?: string;
};

type verifyUserType = {
    token?: string;
};