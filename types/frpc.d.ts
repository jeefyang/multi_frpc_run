type FrpcConfigProxyType = (FrpProxyTCPType | FrpProxyHTTPType | FrpProxyHTTPSType | FrpProxySTCPType | FrpProxySUDPType | FrpProxyUDPType | FrpProxyXTCPType)

type FrpcConfigType = {
    /** 代理配置，不同的代理类型对应不同的配置，例如 TCPProxyConfig 或 HTTPProxyConfig */
    proxies?: FrpcConfigProxyType[]
    /** 访问者配置，不同的访问者类型对应不同的配置，例如 STCPVisitorConfig */
    visitor?: (FrpVisitorSTCPType | FrpVisitorSUDPType | FrpVisitorXTCPType)[]
} & FrpcCommonType

/** 客户端通用配置 */
type FrpcCommonType = {
    /** 客户端鉴权配置 */
    auth: FrpcAuthClientType
    /** 用户名，设置此参数后，代理名称会被修改为 {user}.{proxyName}，避免代理名称和其他用户冲突 */
    user?: string
    /** 连接服务端的地址 */
    serverAddr?: string
    /** 连接服务端的端口，默认为 7000 */
    serverPort?: number
    /** xtcp 打洞所需的 stun 服务器地址，默认为 stun.easyvoip.com:3478 */
    natHoleStunServer?: string
    /** 使用 DNS 服务器地址，默认使用系统配置的 DNS 服务器，指定此参数可以强制替换为自定义的 DNS 服务器地址 */
    dnsServer?: string
    /** 第一次登陆失败后是否退出，默认为 true */
    loginFailExit?: boolean
    /** 指定启用部分代理，当配置了较多代理，但是只希望启用其中部分时可以通过此参数指定，默认为全部启用 */
    start?: string[]
    /** 日志配置 */
    log?: FrpLogType
    /** 客户端 AdminServer 配置 */
    webServer?: FrpWebServerType
    /** 客户端网络层配置 */
    transport?: FrpcTransportType
    /** 代理 UDP 服务时支持的最大包长度，默认为 1500，服务端和客户端需要保持配置一致 */
    udpPacketSize?: number
    /** 附加元数据，会传递给服务端插件，提供附加能力 */
    metadatas?: { [propName: string]: string }
    /** 指定额外的配置文件目录，其中的 proxy 和 visitor 配置会被读取加载 */
    includes?: string[]

}

type FrpcTransportType = {
    /** 和 frps 之间的通信协议，可选值为 tcp, kcp, quic, websocket, wss。默认为 tcp */
    protocol?: "tcp" | "kcp" | "quic" | "websocket" | "wss"
    /** 连接服务端的超时时间，默认为 10s */
    dialServerTimeout?: number
    /** 和服务端底层 TCP 连接的 keepalive 间隔时间，单位秒 */
    dialServerKeepalive?: number
    /** 连接服务端时所绑定的本地 IP */
    connectServerLocalIP?: string
    /** 连接服务端使用的代理地址，格式为 {protocol}://user:passwd@192.168.1.128:8080 protocol 目前支持 http、socks5、ntlm */
    proxyURL?: string
    /** 连接池大小 */
    poolCount?: number
    /** TCP 多路复用，默认启用 */
    tcpMux?: boolean
    /** tcp_mux 的心跳检查间隔时间 */
    tcpMuxKeepaliveInterval?: number
    /** QUIC 协议配置参数 */
    quic?: FrpQUICOptionsType
    /** 向服务端发送心跳包的间隔时间，默认为 30s。建议启用 tcp_mux_keepalive_interval，将此值设置为 -1 */
    heartbeatInterval?: number
    /** 和服务端心跳的超时时间，默认为 90s */
    heartbeatTimeout?: number
    /** 客户端 TLS 协议配置 */
    tls?: FrpcTLSClientType
}

type FrpcTLSClientType = {
    /** 是否和服务端之间启用 TLS 连接，默认启用 */
    enable?: boolean
    /** 启用 TLS 连接时，不发送 0x17 特殊字节。默认为 true。当配置为 true 时，无法和 vhostHTTPSPort 端口复用 */
    disableCustomTLSFirstByte?: boolean
} & FrpTLSType

/** 客户端鉴权配置 */
type FrpcAuthClientType = {
    /** 鉴权方式，可选值为 token 或 oidc，默认为 token */
    method?: "token" | "oidc"
    /** 鉴权信息附加范围，可选值为 HeartBeats 和 NewWorkConns */
    additionalScopes?: ("HeartBeats" | "NewWorkConns")[]
    /** 在 method 为 token 时生效，客户端需要设置一样的值才能鉴权通过 */
    token?: string
    /** oidc 鉴权配置 */
    oidc?: FrpcAuthOIDCClientType
}

/** oidc 鉴权配置 */
type FrpcAuthOIDCClientType = {
    clientID?: string
    clientSecret?: string
    audience?: string
    scope?: string
    tokenEndpointURL?: string
    additionalEndpointParams?: { [propName: string]: string }
}