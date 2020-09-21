<p align="center">
<img src="https://raw.githubusercontent.com/panjf2000/logos/master/gnet/logo.png" alt="gnet" />
<br />
<a title="Build Status" target="_blank" href="https://travis-ci.com/panjf2000/gnet"><img src="https://img.shields.io/travis/com/panjf2000/gnet?style=flat-square&logo=travis" /></a>
<a title="Codecov" target="_blank" href="https://codecov.io/gh/panjf2000/gnet"><img src="https://img.shields.io/codecov/c/github/panjf2000/gnet?style=flat-square&logo=codecov" /></a>
<a title="Supported Platforms" target="_blank" href="https://github.com/FJSDS/gnet"><img src="https://img.shields.io/badge/platform-Linux%20%7C%20FreeBSD%20%7C%20DragonFly%20%7C%20Darwin%20%7C%20Windows-549688?style=flat-square&logo=launchpad" /></a>
<a title="Require Go Version" target="_blank" href="https://github.com/FJSDS/gnet"><img src="https://img.shields.io/badge/go-%3E%3D1.9-30dff3?style=flat-square&logo=go" /></a>
<a title="On XS" target="_blank" href="https://xscode.com/panjf2000/gnet"><img src="https://img.shields.io/badge/Available%20on-xs%3Acode-4b5cc4?style=flat-square&logo=cash-app" /></a>
<br />
<a title="Chat Room" target="_blank" href="https://gitter.im/gnet-io/gnet?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/gnet-io/gnet.svg" /></a>
<a title="Go Report Card" target="_blank" href="https://goreportcard.com/report/github.com/FJSDS/gnet"><img src="https://goreportcard.com/badge/github.com/FJSDS/gnet?style=flat-square" /></a>
<a title="Doc for gnet" target="_blank" href="https://pkg.go.dev/github.com/FJSDS/gnet?tab=doc"><img src="https://img.shields.io/badge/go.dev-doc-007d9c?style=flat-square&logo=read-the-docs" /></a>
<a title="gnet on Sourcegraph" target="_blank" href="https://sourcegraph.com/github.com/FJSDS/gnet?badge"><img src="https://sourcegraph.com/github.com/FJSDS/gnet/-/badge.svg?style=flat-square" /></a>
<a title="Mentioned in Awesome Go" target="_blank" href="https://github.com/avelino/awesome-go#networking"><img src="https://awesome.re/mentioned-badge-flat.svg" /></a>
<a title="Release" target="_blank" href="https://github.com/FJSDS/gnet/releases"><img src="https://img.shields.io/github/v/release/panjf2000/gnet.svg?color=161823&style=flat-square&logo=smartthings" /></a>
<a title="Tag" target="_blank" href="https://github.com/FJSDS/gnet/tags"><img src="https://img.shields.io/github/v/tag/panjf2000/gnet?color=%23ff8936&logo=fitbit&style=flat-square" /></a>
</p>

[英文](README.md) | 🇨🇳中文

# 📖 简介

`gnet` 是一个基于事件驱动的高性能和轻量级网络框架。它直接使用 [epoll](https://en.wikipedia.org/wiki/Epoll) 和 [kqueue](https://en.wikipedia.org/wiki/Kqueue) 系统调用而非标准 Go 网络包：[net](https://golang.org/pkg/net/) 来构建网络应用，它的工作原理类似两个开源的网络库：[netty](https://github.com/netty/netty) 和 [libuv](https://github.com/libuv/libuv)，这也使得 `gnet` 达到了一个远超 Go [net](https://golang.org/pkg/net/) 的性能表现。

`gnet` 设计开发的初衷不是为了取代 Go 的标准网络库：[net](https://golang.org/pkg/net/)，而是为了创造出一个类似于 [Redis](http://redis.io)、[Haproxy](http://www.haproxy.org) 能高效处理网络包的 Go 语言网络服务器框架。

`gnet` 的卖点在于它是一个高性能、轻量级、非阻塞的纯 Go 实现的传输层（TCP/UDP/Unix Domain Socket）网络框架，开发者可以使用 `gnet` 来实现自己的应用层网络协议(HTTP、RPC、Redis、WebSocket 等等)，从而构建出自己的应用层网络应用：比如在 `gnet` 上实现 HTTP 协议就可以创建出一个 HTTP 服务器 或者 Web 开发框架，实现 Redis 协议就可以创建出自己的 Redis 服务器等等。

**`gnet` 衍生自另一个项目：`evio`，但拥有更丰富的功能特性，且性能远胜之。**

# 🚀 功能

- [x] [高性能](#-性能测试) 的基于多线程/Go程网络模型的 event-loop 事件驱动
- [x] 内置 goroutine 池，由开源库 [ants](https://github.com/panjf2000/ants) 提供支持
- [x] 内置 bytes 内存池，由开源库 [bytebufferpool](https://github.com/valyala/bytebufferpool) 提供支持
- [x] 整个生命周期是无锁的
- [x] 简单易用的 APIs
- [x] 基于 Ring-Buffer 的高效且可重用的内存 buffer
- [x] 支持多种网络协议/IPC 机制：`TCP`、`UDP` 和 `Unix Domain Socket`
- [x] 支持多种负载均衡算法：`Round-Robin(轮询)`、`Source-Addr-Hash(源地址哈希)` 和 `Least-Connections(最少连接数)`
- [x] 支持两种事件驱动机制：**Linux** 里的 `epoll` 以及 **FreeBSD/DragonFly/Darwin** 里的 `kqueue`
- [x] 支持异步写操作
- [x] 灵活的事件定时器
- [x] SO_REUSEPORT 端口重用
- [x] 内置多种编解码器，支持对 TCP 数据流分包：LineBasedFrameCodec, DelimiterBasedFrameCodec, FixedLengthFrameCodec 和 LengthFieldBasedFrameCodec，参考自 [netty codec](https://netty.io/4.1/api/io/netty/handler/codec/package-summary.html)，而且支持自定制编解码器
- [x] 支持 Windows 平台，基于 ~~IOCP 事件驱动机制~~ Go 标准网络库
- [ ] 实现 `gnet` 客户端

# 📊 性能测试

## TechEmpower 性能测试

```powershell
# 硬件环境
CPU: 28 HT Cores Intel(R) Xeon(R) Gold 5120 CPU @ 2.20GHz
Mem: 32GB RAM
OS : Ubuntu 18.04.3 4.15.0-88-generic #88-Ubuntu
Net: Switched 10-gigabit ethernet
Go : go1.14.x linux/amd64
```

![All language](https://raw.githubusercontent.com/panjf2000/illustrations/master/benchmark/techempower-all.jpg)

这是包含全部编程语言框架的性能排名***前 50*** 的结果，总榜单包含了全世界共计 ***422 个框架***，其中 `gnet` 排名***第二***。


![Golang](https://raw.githubusercontent.com/panjf2000/illustrations/master/benchmark/techempower-go.png)

这是 Go 语言分类下的全部排名，`gnet` 超越了其他所有框架，位列第一，是***最快***的 Go 网络框架。

完整的排行可以通过 [TechEmpower Plaintext Benchmark](https://www.techempower.com/benchmarks/#section=test&runid=53c6220a-e110-466c-a333-2e879fea21ad&hw=ph&test=plaintext) 查看。

## 同类型的网络库性能对比

## Linux (epoll)

### 系统参数

```powershell
# Machine information
        OS : Ubuntu 18.04/x86_64
       CPU : 8 Virtual CPUs
    Memory : 16.0 GiB

# Go version and configurations
Go Version : go1.12.9 linux/amd64
GOMAXPROCS=8
```

#### Echo Server

![](https://github.com/FJSDS/gnet_benchmarks/raw/master/results/echo_linux.png)

#### HTTP Server

![](https://github.com/FJSDS/gnet_benchmarks/raw/master/results/http_linux.png)

## FreeBSD (kqueue)

### 系统参数

```powershell
# Machine information
        OS : macOS Mojave 10.14.6/x86_64
       CPU : 4 CPUs
    Memory : 8.0 GiB

# Go version and configurations
Go Version : go version go1.12.9 darwin/amd64
GOMAXPROCS=4
```

#### Echo Server

![](https://github.com/FJSDS/gnet_benchmarks/raw/master/results/echo_mac.png)

#### HTTP Server

![](https://github.com/FJSDS/gnet_benchmarks/raw/master/results/http_mac.png)

# 🏛 官网

关于 `gnet` 的架构设计、使用方法以及其他更多的信息和细节，请访问[官网](https://gnet.host/blog/presenting-gnet-cn/)。

# ⚠️ 证书

`gnet` 的源码允许用户在遵循 [MIT 开源证书](/LICENSE) 规则的前提下使用。

# 👏 贡献者

请在提 PR 之前仔细阅读 [Contributing Guidelines](CONTRIBUTING.md)，感谢那些为 `gnet` 贡献过代码的开发者！

[![](https://opencollective.com/gnet/contributors.svg?width=890&button=false)](https://github.com/FJSDS/gnet/graphs/contributors)

# ⚓ 相关文章

- [A Million WebSockets and Go](https://www.freecodecamp.org/news/million-websockets-and-go-cc58418460bb/)
- [Going Infinite, handling 1M websockets connections in Go](https://speakerdeck.com/eranyanay/going-infinite-handling-1m-websockets-connections-in-go)
- [Go netpoll I/O 多路复用构建原生网络模型之源码深度解析](https://taohuawu.club/go-netpoll-io-multiplexing-reactor)
- [gnet: 一个轻量级且高性能的 Golang 网络库](https://taohuawu.club/go-event-loop-networking-library-gnet)
- [最快的 Go 网络框架 gnet 来啦！](https://taohuawu.club/releasing-gnet-v1-with-techempower)
- [字节跳动在 Go 网络库上的实践](https://taohuawu.club/bytedance-network-library-practices)

# 🎡 用户案例

欢迎在这里添加你的案例~~

<!--
<a href="https://github.com/FJSDS/gnet" target="_blank"><img src="https://raw.githubusercontent.com/panjf2000/logos/master/gnet/logo.png" width="150" align="middle"/></a>&nbsp;&nbsp;
<a href="https://www.tencent.com"><img src="https://www.tencent.com/img/index/tencent_logo.png" width="250" align="middle"/></a>&nbsp;&nbsp;
-->

# 💰 支持

如果有意向，可以通过每个月定量的少许捐赠来支持这个项目。

<a href="https://opencollective.com/gnet#backers" target="_blank"><img src="https://opencollective.com/gnet/backers.svg"></a>

# 💎 赞助

每月定量捐赠 10 刀即可成为本项目的赞助者，届时您的 logo 或者 link 可以展示在本项目的 README 上。

<a href="https://opencollective.com/gnet#sponsors" target="_blank"><img src="https://opencollective.com/gnet/sponsors.svg"></a>

# ☕️ 打赏

> 当您通过以下方式进行捐赠时，请务必留下姓名、Github账号或其他社交媒体账号，以便我将其添加到捐赠者名单中，以表谢意。

<img src="https://raw.githubusercontent.com/panjf2000/illustrations/master/payments/WeChatPay.JPG" width="250" align="middle"/>&nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/panjf2000/illustrations/master/payments/AliPay.JPG" width="250" align="middle"/>&nbsp;&nbsp;
<a href="https://www.paypal.me/R136a1X" target="_blank"><img src="https://raw.githubusercontent.com/panjf2000/illustrations/master/payments/PayPal.JPG" width="250" align="middle"/></a>&nbsp;&nbsp;

# 💴 捐赠者名单

<a target="_blank" href="https://github.com/patrick-othmer"><img src="https://avatars1.githubusercontent.com/u/8964313" width="100" alt="Patrick Othmer" /></a>&nbsp;<a target="_blank" href="https://github.com/FJSDS/gnet"><img src="https://avatars2.githubusercontent.com/u/50285334" width="100" alt="Jimmy" /></a>&nbsp;<a target="_blank" href="https://github.com/cafra"><img src="https://avatars0.githubusercontent.com/u/13758306" width="100" alt="ChenZhen" /></a>&nbsp;<a target="_blank" href="https://github.com/yangwenmai"><img src="https://avatars0.githubusercontent.com/u/1710912" width="100" alt="Mai Yang" /></a>&nbsp;<a target="_blank" href="https://github.com/BeijingWks"><img src="https://avatars3.githubusercontent.com/u/33656339" width="100" alt="王开帅" /></a>

# 💵 付费支持

<p align="center">
	<a title="XS:CODE" target="_blank" href="https://xscode.com/panjf2000/gnet"><img src="https://raw.githubusercontent.com/panjf2000/illustrations/master/go/gnet-banner.png" /></a>
</p>

如果你需要一个深度定制的 `gnet` 版本且想要作者协助开发、或者是需要花费时间精力的 bug 修复/快速方案/咨询等，可以到[这里](https://xscode.com/panjf2000/gnet)申请付费支持。

# 🔑 JetBrains 开源证书支持

`gnet` 项目一直以来都是在 JetBrains 公司旗下的 GoLand 集成开发环境中进行开发，基于 **free JetBrains Open Source license(s)** 正版免费授权，在此表达我的谢意。

<a href="https://www.jetbrains.com/?from=gnet" target="_blank"><img src="https://raw.githubusercontent.com/panjf2000/illustrations/master/jetbrains/jetbrains-variant-4.png" width="250" align="middle"/></a>

# 🔋 赞助商

<p>
	<h3>本项目由以下机构赞助：</h3>
	<a href="https://www.digitalocean.com/"><img src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/SVG/DO_Logo_horizontal_blue.svg" width="201px" />
	</a>
</p>