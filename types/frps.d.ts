type FrpsConfigType = {
    /** 鉴权配置 */
    auth?: FrpsAuthServerType
    /** 服务端监听地址，用于接收 frpc 的连接，默认监听 0.0.0.0 */
    bindAddr?: string
    /** 服务端监听端口，默认值为 7000 */
    bindPort?: number
    /** 服务端监听 KCP 协议端口，用于接收配置了使用 KCP 协议的 frpc 连接 */
    kcpBindPort?: number
    /** 服务端监听 QUIC 协议端口，用于接收配置了使用 QUIC 协议的 frpc 连接 */
    quicBindPort?: number
    /** 代理监听地址，可以使代理监听在不同的网卡地址，默认情况下同 bindAddr */
    proxyBindAddr?: string
    /** HTTP 类型代理监听的端口，启用后才能支持 HTTP 类型的代理 */
    vhostHTTPPort?: number
    /**HTTP 类型代理在服务端的 ResponseHeader 超时时间，默认为 60s */
    vhostHTTPTimeout?: number
    /** HTTPS 类型代理监听的端口，启用后才能支持 HTTPS 类型的代理 */
    vhostHTTPSPort?: number
    /** tcpmux 类型且复用器为 httpconnect 的代理监听的端口 */
    tcpmuxHTTPConnectPort?: number
    /** 对于 tcpmux 类型的代理是否透传 CONNECT 请求 */
    tcpmuxPassthrough?: boolean
    /** 二级域名后缀 */
    subDomainHost?: string
    /** 自定义 404 错误页面地址 */
    custom404Page?: string
    /** 服务端 Dashboard 配置 */
    webServer?: FrpWebServerType
    /** 是否提供 Prometheus 监控接口，需要同时启用了 webServer 后才会生效 */
    enablePrometheus?: boolean
    /** 日志配置 */
    log?: FrpLogType
    /** 网络层配置 */
    transport?: FrpsTransportType
    /** 服务端返回详细错误信息给客户端，默认为 true */
    detailedErrorsToClient?: boolean
    /** 限制单个客户端最大同时存在的代理数，默认无限制 */
    maxPortsPerClient?: number
    /** 用户建立连接后等待客户端响应的超时时间，单位秒，默认为 10 秒 */
    userConnTimeout?: number
    /** 代理 UDP 服务时支持的最大包长度，默认为 1500，服务端和客户端的值需要一致 */
    udpPacketSize?: number
    /** 打洞策略数据的保留时间，默认为 168 小时，即 7 天 */
    natholeAnalysisDataReserveHours?: number
    /** 允许代理绑定的服务端端口 */
    allowPorts?: FrpPortsRangeType[]
    /** 服务端 HTTP 插件配置 */
    httpPlugins?: FrpsHTTPPluginOptionsType[]
}

type FrpsAuthServerType = {
    /** 鉴权方式，可选值为 token 或 oidc，默认为 token */
    method?: "token" | "oidc"
    /** 鉴权信息附加范围，可选值为 HeartBeats 和 NewWorkConns */
    additionalScopes?: ("HeartBeats" | "NewWorkConns")[]
    /** 在 method 为 token 时生效，客户端需要设置一样的值才能鉴权通过 */
    token?: string
    /** oidc 鉴权配置 */
    oidc?: FrpsAuthOIDCServerType

}

type FrpsAuthOIDCServerType = {
    issuer?: string
    audience?: string
    skipExpiryCheck?: boolean
    skipIssuerCheck?: boolean
}

type FrpsTransportType = {
    /** tcp mux 的心跳检查间隔时间，单位秒 */
    tcpMuxKeepaliveInterval?: number
    /** 和客户端底层 TCP 连接的 keepalive 间隔时间，单位秒，配置为负数表示不启用 */
    tcpKeepalive?: number
    /** 允许客户端设置的最大连接池大小，如果客户端配置的值大于此值，会被强制修改为最大值，默认为 5 */
    maxPoolCount?: number
    /** 服务端和客户端心跳连接的超时时间，单位秒，默认为 90 秒 */
    heartbeatTimeout?: number
    /** QUIC 协议配置参数 */
    quic?: FrpQUICOptionsType
    /** 服务端 TLS 协议配置 */
    tls?: FrpsTLSServerType
}

type FrpsTLSServerType = {
    /** 是否只接受启用了 TLS 的客户端连接 */
    force?: boolean
} & FrpTLSType

type FrpsHTTPPluginOptionsType = {
    /** 插件名称 */
    name: string
    /** 插件接口的地址 */
    addr: string
    /** 插件接口的 Path */
    path: string
    /** 插件需要生效的操作列表，具体可选值请参考服务端插件的说明文档 */
    ops: string[]
    /** 当插件地址为 HTTPS 协议时，是否校验插件的 TLS 证书，默认为不校验 */
    tlsVerify?: boolean
}