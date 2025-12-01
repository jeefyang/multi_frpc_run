type FrpPluginHTTPProxyOptionsType = {
    /** HTTP 代理用户名 */
    httpUser?: string
    /** HTTP 代理密码 */
    httpPassword?: string
}

type FrpPluginSocks5OptionsType = {
    /** 用户名 */
    username?: string
    /** 密码 */
    password?: string
}

type FrpPluginStaticFileOptionsType = {
    /** 静态文件所在本地路径 */
    localPath: string
    /** 去除用户 HTTP 请求 Path 的特定前缀 */
    stripPrefix?: string
    /** HTTP Basic Auth 用户名 */
    httpUser?: string
    /** HTTP Basic Auth 密码 */
    httpPassword?: string
}

type FrpPluginUnixDomainSocketOptionsType = {
    /** UNIX 域套接字的地址 */
    unixPath: string
}

type FrpPluginHTTP2HTTPSOptionsType = {
    /** 本地 HTTPS 服务地址 */
    localAddr: string
    /** 替换 Host header */
    hostHeaderRewrite?: string
    /** 对请求 Header 的操作配置 */
    requestHeaders?: FrpHeaderOperationsType
}

type FrpPluginHTTPS2HTTPOptionsType = {
    /** 本地 HTTPS 服务地址 */
    localAddr: string
    /** 替换 Host header */
    hostHeaderRewrite?: string
    /** 对请求 Header 的操作配置 */
    requestHeaders?: FrpHeaderOperationsType
    /** TLS 证书文件路径 */
    crtPath?: string
    /** TLS 密钥文件路径 */
    keyPath?: string
}

type FrpPluginHTTPS2HTTPSOptionsType = {
    /** 本地 HTTPS 服务地址 */
    localAddr: string
    /** 替换 Host header */
    hostHeaderRewrite?: string
    /** 对请求 Header 的操作配置 */
    requestHeaders?: FrpHeaderOperationsType
    /** TLS 证书文件路径 */
    crtPath?: string
    /** TLS 密钥文件路径 */
    keyPath?: string
}