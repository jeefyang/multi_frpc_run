type FrpLogType = {
    /** 日志输出文件路径，如果为 console，则会将日志打印在标准输出中 */
    to?: string;
    /** 日志级别，可选值为 trace, debug, info, warn, error，默认级别为 info */
    level?: "trace" | "debug" | "info" | "warn" | "error";
    /** 日志文件最多保留天数，默认为 3 天 */
    maxDays?: number;
    /** 禁用标准输出中的日志颜色 */
    disablePrintColor?: boolean;
};

type FrpWebServerType = {
    /** webServer 监听地址，默认为 127.0.0.1 */
    addr?: string;
    /** webServer 监听端口 */
    port?: number;
    /** HTTP BasicAuth 用户名 */
    user?: string;
    /** HTTP BasicAuth 密码 */
    password?: string;
    /** 静态资源目录，Dashboard 使用的资源默认打包在二进制文件中，通过指定此参数使用自定义的静态资源 */
    assetsDir?: string;
    /** 启动 Go HTTP pprof，用于应用调试 */
    pprofEnable?: boolean;
    /** Dashboard 启用 HTTPS 的 TLS 相关配置 */
    tls?: FrpTLSType;
};


type FrpTLSType = {
    /** TLS 证书文件路径 */
    certFile: string;
    /** TLS 密钥文件路径 */
    keyFile: string;
    /** CA 证书文件路径 */
    trustedCaFile?: string;
    /** TLS Server 名称 */
    serverName?: string;
};

type FrpQUICOptionsType = {
    /** 默认值为 10 秒 */
    keepalivePeriod?: number;
    /** 默认值为 30 秒 */
    maxIdleTimeout?: number;
    /** 默认值为 100000 */
    maxIncomingStreams?: number;
};

type FrpPortsRangeType = {
    /** 起始端口 */
    start?: number;
    /** 终止端口 */
    end?: number;
    /** 单一端口 */
    single?: number;
};

type FrpHeaderOperationsType = {
    /** 在 Header 中设置指定的 KV 值 */
    set?: { [propName: string]: string; };
};