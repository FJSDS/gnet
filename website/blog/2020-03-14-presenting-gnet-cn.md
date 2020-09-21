---
last_modified_on: "2020-03-14"
id: presenting-gnet-cn
title: "Gnet 导视"
description: "最快的 Go 网络框架 gnet 来啦！"
author_github: https://github.com/panjf2000
tags: ["type: 官宣", "domain: 展示"]
---

<p align="center">
<img src="https://raw.githubusercontent.com/panjf2000/logos/master/gnet/logo.png" alt="gnet" />
</p>


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

# 💡 核心设计
## 多线程/Go程网络模型
### 主从多 Reactors

`gnet` 重新设计开发了一个新内置的多线程/Go程网络模型：『主从多 Reactors』，这也是 `netty` 默认的多线程网络模型，下面是这个模型的原理图：

<p align="center">
<img alt="multi_reactor" src="https://raw.githubusercontent.com/panjf2000/illustrations/master/go/multi-reactors.png" />
</p>

它的运行流程如下面的时序图：
<p align="center">
<img alt="reactor" src="https://raw.githubusercontent.com/panjf2000/illustrations/master/go/multi-reactors-sequence-diagram.png" />
</p>

### 主从多 Reactors + 线程/Go程池

你可能会问一个问题：如果我的业务逻辑是阻塞的，那么在 `EventHandler.React` 注册方法里的逻辑也会阻塞，从而导致阻塞 event-loop 线程，这时候怎么办？

正如你所知，基于 `gnet` 编写你的网络服务器有一条最重要的原则：永远不能让你业务逻辑（一般写在 `EventHandler.React` 里）阻塞 event-loop 线程，这也是 `netty` 的一条最重要的原则，否则的话将会极大地降低服务器的吞吐量。

我的回答是，基于`gnet` 的另一种多线程/Go程网络模型：『带线程/Go程池的主从多 Reactors』可以解决阻塞问题，这个新网络模型通过引入一个 worker pool 来解决业务逻辑阻塞的问题：它会在启动的时候初始化一个 worker pool，然后在把 `EventHandler.React`里面的阻塞代码放到 worker pool 里执行，从而避免阻塞 event-loop 线程。

模型的架构图如下所示：

<p align="center">
<img alt="multi_reactor_thread_pool" src="https://raw.githubusercontent.com/panjf2000/illustrations/master/go/multi-reactors%2Bthread-pool.png" />
</p>

它的运行流程如下面的时序图：
<p align="center">
<img alt="multi-reactors" src="https://raw.githubusercontent.com/panjf2000/illustrations/master/go/multi-reactors%2Bthread-pool-sequence-diagram.png" />
</p>

`gnet` 通过利用 [ants](https://github.com/panjf2000/ants) goroutine 池（一个基于 Go 开发的高性能的 goroutine 池 ，实现了对大规模 goroutines 的调度管理、goroutines 复用）来实现『主从多 Reactors + 线程/Go程池』网络模型。关于 `ants` 的全部功能和使用，可以在 [ants 文档](https://pkg.go.dev/github.com/panjf2000/ants/v2?tab=doc) 里找到。

`gnet` 内部集成了 `ants` 以及提供了 `pool.goroutine.Default()` 方法来初始化一个 `ants` goroutine 池，然后你可以把 `EventHandler.React` 中阻塞的业务逻辑提交到 goroutine 池里执行，最后在 goroutine 池里的代码调用 `gnet.Conn.AsyncWrite([]byte)` 方法把处理完阻塞逻辑之后得到的输出数据异步写回客户端，这样就可以避免阻塞 event-loop 线程。

有关在 `gnet` 里使用 `ants` goroutine 池的细节可以到[这里](#带阻塞逻辑的-echo-服务器)进一步了解。

## 可重用且自动扩容的 Ring-Buffer

`gnet` 内置了inbound 和 outbound 两个 buffers，基于 Ring-Buffer 原理实现，分别用来缓冲输入输出的网络数据以及管理内存，gnet 里面的 ring buffer 能够重用内存以及按需扩容。

对于 TCP 协议的流数据，使用 `gnet` 不需要业务方为了解析应用层协议而自己维护和管理 buffers，`gnet` 会替业务方完成缓冲和管理网络数据的任务，降低业务代码的复杂性以及降低开发者的心智负担，使得开发者能够专注于业务逻辑而非一些底层实现。

<p align="center">
<img src="https://raw.githubusercontent.com/panjf2000/illustrations/master/go/ring-buffer.gif" />
</p>


# 🎉 开始使用

## 前提

`gnet` 需要 Go 版本 >= 1.9。

## 安装

```powershell
go get -u github.com/FJSDS/gnet
```

`gnet` 支持作为一个 Go module 被导入，基于 [Go 1.11 Modules](https://github.com/golang/go/wiki/Modules) (Go 1.11+)，只需要在你的项目里直接 `import "github.com/FJSDS/gnet"`，然后运行 `go [build|run|test]` 自动下载和构建需要的依赖包。

## 使用示例

**详细的文档在这里: [gnet 接口文档](https://pkg.go.dev/github.com/FJSDS/gnet?tab=doc)，不过下面我们先来了解下使用 `gnet` 的简略方法。**

用 `gnet` 来构建网络服务器是非常简单的，只需要实现 `gnet.EventHandler`接口然后把你关心的事件函数注册到里面，最后把它连同监听地址一起传递给 `gnet.Serve` 函数就完成了。在服务器开始工作之后，每一条到来的网络连接会在各个事件之间传递，如果你想在某个事件中关闭某条连接或者关掉整个服务器的话，直接在事件函数里把 `gnet.Action` 设置成 `Close` 或者 `Shutdown` 就行了。

Echo 服务器是一种最简单网络服务器，把它作为 `gnet` 的入门例子在再合适不过了，下面是一个最简单的 echo server，它监听了 9000 端口：
### 不带阻塞逻辑的 echo 服务器

<details>
	<summary> Old version(&lt;=v1.0.0-rc.4)  </summary>

```go
package main

import (
	"log"

	"github.com/FJSDS/gnet"
)

type echoServer struct {
	*gnet.EventServer
}

func (es *echoServer) React(c gnet.Conn) (out []byte, action gnet.Action) {
	out = c.Read()
	c.ResetBuffer()
	return
}

func main() {
	echo := new(echoServer)
	log.Fatal(gnet.Serve(echo, "tcp://:9000", gnet.WithMulticore(true)))
}
```
</details>

```go
package main

import (
	"log"

	"github.com/FJSDS/gnet"
)

type echoServer struct {
	*gnet.EventServer
}

func (es *echoServer) React(frame []byte, c gnet.Conn) (out []byte, action gnet.Action) {
	out = frame
	return
}

func main() {
	echo := new(echoServer)
	log.Fatal(gnet.Serve(echo, "tcp://:9000", gnet.WithMulticore(true)))
}
```

正如你所见，上面的例子里 `gnet` 实例只注册了一个 `EventHandler.React` 事件。一般来说，主要的业务逻辑代码会写在这个事件方法里，这个方法会在服务器接收到客户端写过来的数据之时被调用，此时的输入参数: `frame` 已经是解码过后的一个完整的网络数据包，一般来说你需要实现 `gnet` 的 [codec 接口](https://pkg.go.dev/github.com/FJSDS/gnet?tab=doc#ICodec)作为你自己的业务编解码器来处理 TCP 组包和分包的问题，如果你不实现那个接口的话，那么 `gnet` 将会使用[默认的 codec](https://pkg.go.dev/github.com/FJSDS/gnet?tab=doc#BuiltInFrameCodec)，这意味着在 `EventHandler.React` 被触发调用之时输入参数: `frame` 里存储的是所有网络数据：包括最新的以及还在 buffer 里的旧数据，然后处理输入数据（这里只是把数据 echo 回去）并且在处理完之后把需要输出的数据赋值给 `out` 变量并返回，接着输出的数据会经过编码，最后被写回客户端。

### 带阻塞逻辑的 echo 服务器

<details>
	<summary> Old version(&lt;=v1.0.0-rc.4)  </summary>

```go
package main

import (
	"log"
	"time"

	"github.com/FJSDS/gnet"
	"github.com/FJSDS/gnet/pool/goroutine"
)

type echoServer struct {
	*gnet.EventServer
	pool *goroutine.Pool
}

func (es *echoServer) React(c gnet.Conn) (out []byte, action gnet.Action) {
	data := append([]byte{}, c.Read()...)
	c.ResetBuffer()

	// Use ants pool to unblock the event-loop.
	_ = es.pool.Submit(func() {
		time.Sleep(1 * time.Second)
		c.AsyncWrite(data)
	})

	return
}

func main() {
	p := goroutine.Default()
	defer p.Release()
	
	echo := &echoServer{pool: p}
	log.Fatal(gnet.Serve(echo, "tcp://:9000", gnet.WithMulticore(true)))
}
```
</details>

```go
package main

import (
	"log"
	"time"

	"github.com/FJSDS/gnet"
	"github.com/FJSDS/gnet/pool/goroutine"
)

type echoServer struct {
	*gnet.EventServer
	pool *goroutine.Pool
}

func (es *echoServer) React(frame []byte, c gnet.Conn) (out []byte, action gnet.Action) {
	data := append([]byte{}, frame...)

	// Use ants pool to unblock the event-loop.
	_ = es.pool.Submit(func() {
		time.Sleep(1 * time.Second)
		c.AsyncWrite(data)
	})

	return
}

func main() {
	p := goroutine.Default()
	defer p.Release()

	echo := &echoServer{pool: p}
	log.Fatal(gnet.Serve(echo, "tcp://:9000", gnet.WithMulticore(true)))
}
```

正如我在『主从多 Reactors + 线程/Go程池』那一节所说的那样，如果你的业务逻辑里包含阻塞代码，那么你应该把这些阻塞代码变成非阻塞的，比如通过把这部分代码放到独立的 goroutines 去运行，但是要注意一点，如果你的服务器处理的流量足够的大，那么这种做法将会导致创建大量的 goroutines 极大地消耗系统资源，所以我一般建议你用 goroutine pool 来做 goroutines 的复用和管理，以及节省系统资源。

**各种 gnet 示例:**

<details>
	<summary> TCP Echo Server </summary>

```go
package main

import (
	"flag"
	"fmt"
	"log"

	"github.com/FJSDS/gnet"
)

type echoServer struct {
	*gnet.EventServer
}

func (es *echoServer) OnInitComplete(srv gnet.Server) (action gnet.Action) {
	log.Printf("Echo server is listening on %s (multi-cores: %t, loops: %d)\n",
		srv.Addr.String(), srv.Multicore, srv.NumEventLoop)
	return
}

func (es *echoServer) React(frame []byte, c gnet.Conn) (out []byte, action gnet.Action) {
	// Echo synchronously.
	out = frame
	return

	/*
		// Echo asynchronously.
		data := append([]byte{}, frame...)
		go func() {
			time.Sleep(time.Second)
			c.AsyncWrite(data)
		}()
		return
	*/
}

func main() {
	var port int
	var multicore, reuseport bool

	// Example command: go run echo.go --port 9000 --multicore=true --reuseport=true
	flag.IntVar(&port, "port", 9000, "--port 9000")
	flag.BoolVar(&multicore, "multicore", false, "--multicore true")
	flag.BoolVar(&reuseport, "reuseport", false, "--reuseport true")
	flag.Parse()
	echo := new(echoServer)
	log.Fatal(gnet.Serve(echo, fmt.Sprintf("tcp://:%d", port), gnet.WithMulticore(multicore), gnet.WithReusePort(reuseport)))
}
```
</details>

<details>
	<summary> UDP Echo Server </summary>

```go
package main

import (
	"flag"
	"fmt"
	"log"

	"github.com/FJSDS/gnet"
)

type echoServer struct {
	*gnet.EventServer
}

func (es *echoServer) OnInitComplete(srv gnet.Server) (action gnet.Action) {
	log.Printf("UDP Echo server is listening on %s (multi-cores: %t, loops: %d)\n",
		srv.Addr.String(), srv.Multicore, srv.NumEventLoop)
	return
}

func (es *echoServer) React(frame []byte, c gnet.Conn) (out []byte, action gnet.Action) {
	// Echo synchronously.
	out = frame
	return

	/*
		// Echo asynchronously.
		data := append([]byte{}, frame...)
		go func() {
			time.Sleep(time.Second)
			c.SendTo(data)
		}()
		return
	*/
}

func main() {
	var port int
	var multicore, reuseport bool

	// Example command: go run echo.go --port 9000 --multicore=true --reuseport=true
	flag.IntVar(&port, "port", 9000, "--port 9000")
	flag.BoolVar(&multicore, "multicore", false, "--multicore true")
	flag.BoolVar(&reuseport, "reuseport", false, "--reuseport true")
	flag.Parse()
	echo := new(echoServer)
	log.Fatal(gnet.Serve(echo, fmt.Sprintf("udp://:%d", port), gnet.WithMulticore(multicore), gnet.WithReusePort(reuseport)))
}
```
</details>

<details>
	<summary> UDS Echo Server </summary>

```go
package main

import (
	"flag"
	"fmt"
	"log"

	"github.com/FJSDS/gnet"
)

type echoServer struct {
	*gnet.EventServer
}

func (es *echoServer) OnInitComplete(srv gnet.Server) (action gnet.Action) {
	log.Printf("Echo server is listening on %s (multi-cores: %t, loops: %d)\n",
		srv.Addr.String(), srv.Multicore, srv.NumEventLoop)
	return
}

func (es *echoServer) React(frame []byte, c gnet.Conn) (out []byte, action gnet.Action) {
	// Echo synchronously.
	out = frame
	return

	/*
		// Echo asynchronously.
		data := append([]byte{}, frame...)
		go func() {
			time.Sleep(time.Second)
			c.AsyncWrite(data)
		}()
		return
	*/
}

func main() {
	var addr string
	var multicore bool

	// Example command: go run echo.go --sock echo.sock --multicore=true
	flag.StringVar(&addr, "sock", "echo.sock", "--port 9000")
	flag.BoolVar(&multicore, "multicore", false, "--multicore true")
	flag.Parse()

	echo := new(echoServer)
	log.Fatal(gnet.Serve(echo, fmt.Sprintf("unix://%s", addr), gnet.WithMulticore(multicore)))
}
```
</details>

<details>
	<summary> HTTP Server </summary>

```go
package main

import (
	"flag"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"
	"unsafe"

	"github.com/FJSDS/gnet"
)

var res string

type request struct {
	proto, method string
	path, query   string
	head, body    string
	remoteAddr    string
}

type httpServer struct {
	*gnet.EventServer
}

var (
	errMsg      = "Internal Server Error"
	errMsgBytes = []byte(errMsg)
)

type httpCodec struct {
	req request
}

func (hc *httpCodec) Encode(c gnet.Conn, buf []byte) (out []byte, err error) {
	if c.Context() == nil {
		return buf, nil
	}
	return appendResp(out, "500 Error", "", errMsg+"\n"), nil
}

func (hc *httpCodec) Decode(c gnet.Conn) (out []byte, err error) {
	buf := c.Read()
	c.ResetBuffer()

	// process the pipeline
	var leftover []byte
pipeline:
	leftover, err = parseReq(buf, &hc.req)
	// bad thing happened
	if err != nil {
		c.SetContext(err)
		return nil, err
	} else if len(leftover) == len(buf) {
		// request not ready, yet
		return
	}
	out = appendHandle(out, res)
	buf = leftover
	goto pipeline
}

func (hs *httpServer) OnInitComplete(srv gnet.Server) (action gnet.Action) {
	log.Printf("HTTP server is listening on %s (multi-cores: %t, loops: %d)\n",
		srv.Addr.String(), srv.Multicore, srv.NumEventLoop)
	return
}

func (hs *httpServer) React(frame []byte, c gnet.Conn) (out []byte, action gnet.Action) {
	if c.Context() != nil {
		// bad thing happened
		out = errMsgBytes
		action = gnet.Close
		return
	}
	// handle the request
	out = frame
	return
}

func main() {
	var port int
	var multicore bool

	// Example command: go run http.go --port 8080 --multicore=true
	flag.IntVar(&port, "port", 8080, "server port")
	flag.BoolVar(&multicore, "multicore", true, "multicore")
	flag.Parse()

	res = "Hello World!\r\n"

	http := new(httpServer)
	hc := new(httpCodec)

	// Start serving!
	log.Fatal(gnet.Serve(http, fmt.Sprintf("tcp://:%d", port), gnet.WithMulticore(multicore), gnet.WithCodec(hc)))
}

// appendHandle handles the incoming request and appends the response to
// the provided bytes, which is then returned to the caller.
func appendHandle(b []byte, res string) []byte {
	return appendResp(b, "200 OK", "", res)
}

// appendResp will append a valid http response to the provide bytes.
// The status param should be the code plus text such as "200 OK".
// The head parameter should be a series of lines ending with "\r\n" or empty.
func appendResp(b []byte, status, head, body string) []byte {
	b = append(b, "HTTP/1.1"...)
	b = append(b, ' ')
	b = append(b, status...)
	b = append(b, '\r', '\n')
	b = append(b, "Server: gnet\r\n"...)
	b = append(b, "Date: "...)
	b = time.Now().AppendFormat(b, "Mon, 02 Jan 2006 15:04:05 GMT")
	b = append(b, '\r', '\n')
	if len(body) > 0 {
		b = append(b, "Content-Length: "...)
		b = strconv.AppendInt(b, int64(len(body)), 10)
		b = append(b, '\r', '\n')
	}
	b = append(b, head...)
	b = append(b, '\r', '\n')
	if len(body) > 0 {
		b = append(b, body...)
	}
	return b
}

func b2s(b []byte) string {
	return *(*string)(unsafe.Pointer(&b))
}

// parseReq is a very simple http request parser. This operation
// waits for the entire payload to be buffered before returning a
// valid request.
func parseReq(data []byte, req *request) (leftover []byte, err error) {
	sdata := b2s(data)
	var i, s int
	var head string
	var clen int
	q := -1
	// method, path, proto line
	for ; i < len(sdata); i++ {
		if sdata[i] == ' ' {
			req.method = sdata[s:i]
			for i, s = i+1, i+1; i < len(sdata); i++ {
				if sdata[i] == '?' && q == -1 {
					q = i - s
				} else if sdata[i] == ' ' {
					if q != -1 {
						req.path = sdata[s:q]
						req.query = req.path[q+1 : i]
					} else {
						req.path = sdata[s:i]
					}
					for i, s = i+1, i+1; i < len(sdata); i++ {
						if sdata[i] == '\n' && sdata[i-1] == '\r' {
							req.proto = sdata[s:i]
							i, s = i+1, i+1
							break
						}
					}
					break
				}
			}
			break
		}
	}
	if req.proto == "" {
		return data, fmt.Errorf("malformed request")
	}
	head = sdata[:s]
	for ; i < len(sdata); i++ {
		if i > 1 && sdata[i] == '\n' && sdata[i-1] == '\r' {
			line := sdata[s : i-1]
			s = i + 1
			if line == "" {
				req.head = sdata[len(head)+2 : i+1]
				i++
				if clen > 0 {
					if len(sdata[i:]) < clen {
						break
					}
					req.body = sdata[i : i+clen]
					i += clen
				}
				return data[i:], nil
			}
			if strings.HasPrefix(line, "Content-Length:") {
				n, err := strconv.ParseInt(strings.TrimSpace(line[len("Content-Length:"):]), 10, 64)
				if err == nil {
					clen = int(n)
				}
			}
		}
	}
	// not enough data
	return data, nil
}
```
</details>

<details>
	<summary> Push Server </summary>

```go
package main

import (
	"flag"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/FJSDS/gnet"
)

type pushServer struct {
	*gnet.EventServer
	tick             time.Duration
	connectedSockets sync.Map
}

func (ps *pushServer) OnInitComplete(srv gnet.Server) (action gnet.Action) {
	log.Printf("Push server is listening on %s (multi-cores: %t, loops: %d), "+
		"pushing data every %s ...\n", srv.Addr.String(), srv.Multicore, srv.NumEventLoop, ps.tick.String())
	return
}

func (ps *pushServer) OnOpened(c gnet.Conn) (out []byte, action gnet.Action) {
	log.Printf("Socket with addr: %s has been opened...\n", c.RemoteAddr().String())
	ps.connectedSockets.Store(c.RemoteAddr().String(), c)
	return
}

func (ps *pushServer) OnClosed(c gnet.Conn, err error) (action gnet.Action) {
	log.Printf("Socket with addr: %s is closing...\n", c.RemoteAddr().String())
	ps.connectedSockets.Delete(c.RemoteAddr().String())
	return
}

func (ps *pushServer) Tick() (delay time.Duration, action gnet.Action) {
	log.Println("It's time to push data to clients!!!")
	ps.connectedSockets.Range(func(key, value interface{}) bool {
		addr := key.(string)
		c := value.(gnet.Conn)
		c.AsyncWrite([]byte(fmt.Sprintf("heart beating to %s\n", addr)))
		return true
	})
	delay = ps.tick
	return
}

func (ps *pushServer) React(frame []byte, c gnet.Conn) (out []byte, action gnet.Action) {
	out = frame
	return
}

func main() {
	var port int
	var multicore bool
	var interval time.Duration
	var ticker bool

	// Example command: go run push.go --port 9000 --tick 1s --multicore=true
	flag.IntVar(&port, "port", 9000, "server port")
	flag.BoolVar(&multicore, "multicore", true, "multicore")
	flag.DurationVar(&interval, "tick", 0, "pushing tick")
	flag.Parse()
	if interval > 0 {
		ticker = true
	}
	push := &pushServer{tick: interval}
	log.Fatal(gnet.Serve(push, fmt.Sprintf("tcp://:%d", port), gnet.WithMulticore(multicore), gnet.WithTicker(ticker)))
}
```
</details>

<details>
	<summary> Codec Client/Server </summary>

**Client:**

```go
// Reference https://github.com/smallnest/goframe/blob/master/_examples/goclient/client.go

package main

import (
	"encoding/binary"
	"fmt"
	"net"

	"github.com/smallnest/goframe"
)

func main() {
	conn, err := net.Dial("tcp", "127.0.0.1:9000")
	if err != nil {
		panic(err)
	}
	defer conn.Close()

	encoderConfig := goframe.EncoderConfig{
		ByteOrder:                       binary.BigEndian,
		LengthFieldLength:               4,
		LengthAdjustment:                0,
		LengthIncludesLengthFieldLength: false,
	}

	decoderConfig := goframe.DecoderConfig{
		ByteOrder:           binary.BigEndian,
		LengthFieldOffset:   0,
		LengthFieldLength:   4,
		LengthAdjustment:    0,
		InitialBytesToStrip: 4,
	}

	fc := goframe.NewLengthFieldBasedFrameConn(encoderConfig, decoderConfig, conn)
	err = fc.WriteFrame([]byte("hello"))
	if err != nil {
		panic(err)
	}
	err = fc.WriteFrame([]byte("world"))
	if err != nil {
		panic(err)
	}

	buf, err := fc.ReadFrame()
	if err != nil {
		panic(err)
	}
	fmt.Println("received: ", string(buf))
	buf, err = fc.ReadFrame()
	if err != nil {
		panic(err)
	}
	fmt.Println("received: ", string(buf))
}
```

**Server:**

```go
package main

import (
	"encoding/binary"
	"flag"
	"fmt"
	"log"
	"time"

	"github.com/FJSDS/gnet"
	"github.com/FJSDS/gnet/pool/goroutine"
)

type codecServer struct {
	*gnet.EventServer
	addr       string
	multicore  bool
	async      bool
	codec      gnet.ICodec
	workerPool *goroutine.Pool
}

func (cs *codecServer) OnInitComplete(srv gnet.Server) (action gnet.Action) {
	log.Printf("Test codec server is listening on %s (multi-cores: %t, loops: %d)\n",
		srv.Addr.String(), srv.Multicore, srv.NumEventLoop)
	return
}

func (cs *codecServer) React(frame []byte, c gnet.Conn) (out []byte, action gnet.Action) {
	if cs.async {
		data := append([]byte{}, frame...)
		_ = cs.workerPool.Submit(func() {
			c.AsyncWrite(data)
		})
		return
	}
	out = frame
	return
}

func testCodecServe(addr string, multicore, async bool, codec gnet.ICodec) {
	var err error
	if codec == nil {
		encoderConfig := gnet.EncoderConfig{
			ByteOrder:                       binary.BigEndian,
			LengthFieldLength:               4,
			LengthAdjustment:                0,
			LengthIncludesLengthFieldLength: false,
		}
		decoderConfig := gnet.DecoderConfig{
			ByteOrder:           binary.BigEndian,
			LengthFieldOffset:   0,
			LengthFieldLength:   4,
			LengthAdjustment:    0,
			InitialBytesToStrip: 4,
		}
		codec = gnet.NewLengthFieldBasedFrameCodec(encoderConfig, decoderConfig)
	}
	cs := &codecServer{addr: addr, multicore: multicore, async: async, codec: codec, workerPool: goroutine.Default()}
	err = gnet.Serve(cs, addr, gnet.WithMulticore(multicore), gnet.WithTCPKeepAlive(time.Minute*5), gnet.WithCodec(codec))
	if err != nil {
		panic(err)
	}
}

func main() {
	var port int
	var multicore bool

	// Example command: go run server.go --port 9000 --multicore=true
	flag.IntVar(&port, "port", 9000, "server port")
	flag.BoolVar(&multicore, "multicore", true, "multicore")
	flag.Parse()
	addr := fmt.Sprintf("tcp://:%d", port)
	testCodecServe(addr, multicore, false, nil)
}
```
</details>

<details>
	<summary> Custom Codec Demo with Client/Server </summary>

**protocol intro:**

```go
// CustomLengthFieldProtocol 
// 测试用的协议，由以下字段构成:
// version+actionType+dataLength+data
// 其中 version+actionType+dataLength 为 header，data 为 payload
type CustomLengthFieldProtocol struct {
	Version    uint16
	ActionType uint16
	DataLength uint32
	Data       []byte
}


// Encode ...
func (cc *CustomLengthFieldProtocol) Encode(c gnet.Conn, buf []byte) ([]byte, error) {
	result := make([]byte, 0)

	buffer := bytes.NewBuffer(result)

	// 取出`React()`时存入的参数
	item := c.Context().(CustomLengthFieldProtocol)


	if err := binary.Write(buffer, binary.BigEndian, item.Version); err != nil {
		s := fmt.Sprintf("Pack version error , %v", err)
		return nil, errors.New(s)
	}

	if err := binary.Write(buffer, binary.BigEndian, item.ActionType); err != nil {
		s := fmt.Sprintf("Pack type error , %v", err)
		return nil, errors.New(s)
	}
	dataLen := uint32(len(buf))
	if err := binary.Write(buffer, binary.BigEndian, dataLen); err != nil {
		s := fmt.Sprintf("Pack datalength error , %v", err)
		return nil, errors.New(s)
	}
	if dataLen > 0 {
		if err := binary.Write(buffer, binary.BigEndian, buf); err != nil {
			s := fmt.Sprintf("Pack data error , %v", err)
			return nil, errors.New(s)
		}
	}

	return buffer.Bytes(), nil
}

// Decode ...
func (cc *CustomLengthFieldProtocol) Decode(c gnet.Conn) ([]byte, error) {
	// parse header
	headerLen := DefaultHeadLength // uint16+uint16+uint32
	if size, header := c.ReadN(headerLen); size == headerLen {
		byteBuffer := bytes.NewBuffer(header)
		var pbVersion, actionType uint16
		var dataLength uint32
		binary.Read(byteBuffer, binary.BigEndian, &pbVersion)
		binary.Read(byteBuffer, binary.BigEndian, &actionType)
		binary.Read(byteBuffer, binary.BigEndian, &dataLength)
		// to check the protocol version and actionType,
		// reset buffer if the version or actionType is not correct
		if pbVersion != DefaultProtocolVersion || isCorrectAction(actionType) == false {
			c.ResetBuffer()
			log.Println("not normal protocol:", pbVersion, DefaultProtocolVersion, actionType, dataLength)
			return nil, errors.New("not normal protocol")
		}
		// parse payload
		dataLen := int(dataLength) // max int32 can contain 210MB payload
		protocolLen := headerLen + dataLen
		if dataSize, data := c.ReadN(protocolLen); dataSize == protocolLen {
			c.ShiftN(protocolLen)

			// return the payload of the data
			return data[headerLen:], nil
		}
		return nil, errors.New("not enough payload data")

	}
	return nil, errors.New("not enough header data")
}
```

**Client/Server:**
[查看源码](https://github.com/gnet-io/gnet-examples/tree/master/examples/custom_codec).
</details>

**更详细的代码在这里: [全部 gnet 示例](https://github.com/gnet-io/gnet-examples)。**

## I/O 事件

 `gnet` 目前支持的 I/O 事件如下：

- `EventHandler.OnInitComplete` 当 server 初始化完成之后调用。
- `EventHandler.OnOpened` 当连接被打开的时候调用。
- `EventHandler.OnClosed` 当连接被关闭的之后调用。
- `EventHandler.React` 当 server 端接收到从 client 端发送来的数据的时候调用。（你的核心业务代码一般是写在这个方法里）
- `EventHandler.Tick` 服务器启动的时候会调用一次，之后就以给定的时间间隔定时调用一次，是一个定时器方法。
- `EventHandler.PreWrite` 预先写数据方法，在 server 端写数据回 client 端之前调用。


## 定时器

`EventHandler.Tick` 会每隔一段时间触发一次，间隔时间你可以自己控制，设定返回的 `delay` 变量就行。

定时器的第一次触发是在 gnet server 启动之后，如果你要设置定时器，别忘了设置 option 选项：`WithTicker(true)`。

```go
events.Tick = func() (delay time.Duration, action Action){
	log.Printf("tick")
	delay = time.Second
	return
}
```

## UDP 支持

`gnet` 支持 UDP 协议，所以在 `gnet.Serve` 里绑定允许绑定 UDP 地址，`gnet` 的 UDP 支持有如下的特性：

- 网络数据的读入和写出不做缓冲，会一次性读写客户端。
-  `EventHandler.OnOpened` 和 `EventHandler.OnClosed` 这两个事件在 UDP 下不可用，唯一可用的事件是 `React`。
-  TCP 里的异步写操作是 `AsyncWrite([]byte)` 方法，而在 UDP 里对应的方法是  `SendTo([]byte)`。

## Unix Domain Socket 支持

`gnet` 还支持 UDS(Unix Domain Socket) 机制，只需要把类似 "unix://xxx" 的 UDS 地址传参给 `gnet.Serve` 函数绑定就行了。

在 `gnet` 里使用 UDS 和使用 TCP 没有什么不同，所有 TCP 协议下可以使用的事件函数都可以在 UDS 中使用。

## 使用多核

`gnet.WithMulticore(true)` 参数指定了 `gnet` 是否会使用多核来进行服务，如果是 `true` 的话就会使用多核，否则就是单核运行，利用的核心数一般是机器的 CPU 数量。

## 负载均衡

`gnet` 目前支持三种负载均衡算法：`Round-Robin(轮询)`、`Source-Addr-Hash(源地址哈希)` 和 `Least-Connections(最少连接数)`，你可以通过传递 functional option 的 `LB` (RoundRobin/LeastConnections/SourceAddrHash) 的值给 `gnet.Serve` 来指定要使用的负载均衡算法。

如果没有显示地指定，那么 `gnet` 将会使用 `Round-Robin` 作为默认的负载均衡算法。

## SO_REUSEPORT 端口复用

服务器支持 [SO_REUSEPORT](https://lwn.net/Articles/542629/) 端口复用特性，允许多个 sockets 监听同一个端口，然后内核会帮你做好负载均衡，每次只唤醒一个 socket 来处理 `connect` 请求，避免惊群效应。

默认情况下，`gnet` 不会有惊群效应，因为 `gnet` 默认的网络模型是主从多 Reactors，只会有一个主 reactor 在监听端口以及接收新连接。所以，开不开启 `SO_REUSEPORT` 选项是无关紧要的，只是开启了这个选项之后 `gnet` 的网络模型将会切换成 `evio` 的旧网络模型，这一点需要注意一下。

开启这个功能也很简单，使用 functional options 设置一下即可：

```go
gnet.Serve(events, "tcp://:9000", gnet.WithMulticore(true), gnet.WithReusePort(true)))
```

## 多种内置的 TCP 流编解码器

`gnet` 内置了多种用于 TCP 流分包的编解码器。

目前一共实现了 4 种常见的编解码器：LineBasedFrameCodec, DelimiterBasedFrameCodec, FixedLengthFrameCodec 和 LengthFieldBasedFrameCodec，基本上能满足大多数应用场景的需求了；而且 `gnet` 还允许用户实现自己的编解码器：只需要实现 [gnet.ICodec](https://pkg.go.dev/github.com/FJSDS/gnet?tab=doc#ICodec) 接口，并通过 functional options 替换掉内部默认的编解码器即可。

这里有一个使用编解码器对 TCP 流分包的[例子](https://github.com/gnet-io/gnet-examples/tree/master/examples/codec)。

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

# ️🚨 证书

`gnet` 的源码允许用户在遵循 [MIT 开源证书](https://github.com/FJSDS/gnet/blob/master/LICENSE) 规则的前提下使用。

# 👏 贡献者

请在提 PR 之前仔细阅读 [Contributing Guidelines](https://github.com/FJSDS/gnet/blob/master/CONTRIBUTING.md)，感谢那些为 `gnet` 贡献过代码的开发者！

[![](https://opencollective.com/gnet/contributors.svg?width=890&button=false)](https://github.com/FJSDS/gnet/graphs/contributors)

# 🙏 致谢

- [evio](https://github.com/tidwall/evio)
- [netty](https://github.com/netty/netty)
- [ants](https://github.com/panjf2000/ants)
- [go_reuseport](https://github.com/kavu/go_reuseport)
- [bytebufferpool](https://github.com/valyala/bytebufferpool)
- [goframe](https://github.com/smallnest/goframe)
- [ringbuffer](https://github.com/smallnest/ringbuffer)

# ⚓ 相关文章

- [A Million WebSockets and Go](https://www.freecodecamp.org/news/million-websockets-and-go-cc58418460bb/)
- [Going Infinite, handling 1M websockets connections in Go](https://speakerdeck.com/eranyanay/going-infinite-handling-1m-websockets-connections-in-go)
- [Go netpoll I/O 多路复用构建原生网络模型之源码深度解析](https://taohuawu.club/go-netpoll-io-multiplexing-reactor)
- [gnet: 一个轻量级且高性能的 Golang 网络库](https://taohuawu.club/go-event-loop-networking-library-gnet)
- [最快的 Go 网络框架 gnet 来啦！](https://taohuawu.club/releasing-gnet-v1-with-techempower)
- [字节跳动在 Go 网络库上的实践](https://taohuawu.club/bytedance-network-library-practices)

# 💰 支持

如果有意向，可以通过每个月定量的少许捐赠来支持这个项目。

<a href="https://opencollective.com/gnet#backers" target="_blank"><img src="https://opencollective.com/gnet/backers.svg" /></a>

# 💎 赞助

每月定量捐赠 10 刀即可成为本项目的赞助者，届时您的 logo 或者 link 可以展示在本项目的 README 上。

<a href="https://opencollective.com/gnet#sponsors" target="_blank"><img src="https://opencollective.com/gnet/sponsors.svg" /></a>

# ☕️ 打赏

> 当您通过以下方式进行捐赠时，请务必留下姓名、Github账号或其他社交媒体账号，以便我将其添加到捐赠者名单中，以表谢意。

<table><tr>
<td><img src="https://raw.githubusercontent.com/panjf2000/illustrations/master/payments/WeChatPay.JPG" width="250" /></td>
<td><img src="https://raw.githubusercontent.com/panjf2000/illustrations/master/payments/AliPay.JPG" width="250" /></td>
<td><a href="https://www.paypal.me/R136a1X" target="_blank"><img src="https://raw.githubusercontent.com/panjf2000/illustrations/master/payments/PayPal.JPG" width="250" /></a></td>
</tr></table>

# 💴 捐赠者名单

<a target="_blank" href="https://github.com/patrick-othmer"><img src="https://avatars1.githubusercontent.com/u/8964313" width="100" alt="Patrick Othmer" /></a>&nbsp;&nbsp;<a target="_blank" href="https://github.com/FJSDS/gnet"><img src="https://avatars2.githubusercontent.com/u/50285334" width="100" alt="Jimmy" /></a>&nbsp;&nbsp;<a target="_blank" href="https://github.com/cafra"><img src="https://avatars0.githubusercontent.com/u/13758306" width="100" alt="ChenZhen" /></a>&nbsp;&nbsp;<a target="_blank" href="https://github.com/yangwenmai"><img src="https://avatars0.githubusercontent.com/u/1710912" width="100" alt="Mai Yang" /></a>&nbsp;&nbsp;<a target="_blank" href="https://github.com/BeijingWks"><img src="https://avatars3.githubusercontent.com/u/33656339" width="100" alt="王开帅" /></a>

# 💵 付费支持

<p align="center">
	<a title="XS:CODE" target="_blank" href="https://xscode.com/panjf2000/gnet"><img src="https://raw.githubusercontent.com/panjf2000/illustrations/master/go/gnet-banner.png" /></a>
</p>

如果你需要一个深度定制的 `gnet` 版本且想要作者协助开发、或者是需要花费时间精力的 bug 修复/快速方案/咨询等，可以到[这里](https://xscode.com/panjf2000/gnet)申请付费支持。

# 🔑 JetBrains 开源证书支持

`gnet` 项目一直以来都是在 JetBrains 公司旗下的 GoLand 集成开发环境中进行开发，基于 **free JetBrains Open Source license(s)** 正版免费授权，在此表达我的谢意。
<a href="https://www.jetbrains.com/?from=gnet" target="_blank"><img src="https://raw.githubusercontent.com/panjf2000/illustrations/master/jetbrains/jetbrains-variant-4.png" width="250" align="middle" /></a>

# 🔋 赞助商

<p>
	<h3>本项目由以下机构赞助：</h3>
	<a href="https://www.digitalocean.com/"><img src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/SVG/DO_Logo_horizontal_blue.svg" width="201px" />
	</a>
</p>