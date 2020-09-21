package main

import (
	"github.com/FJSDS/common/logger"
	"go.uber.org/zap"

	"github.com/FJSDS/gnet"
)

type EchoServer struct {
	*gnet.EventServer
}

func (this_ *EchoServer) React(frame []byte, c gnet.Conn) (out []byte, action gnet.Action) {
	out = frame
	return
}

func main() {
	log, err := logger.NewLogger("test_server", "./log", zap.DebugLevel, logger.WithFile())
	if err != nil {
		panic(err)
	}
	defer log.Flush()
	echo := new(EchoServer)
	err = gnet.Serve(echo, "tcp://:9000", log, gnet.WithMulticore(true))
	if err != nil {
		log.Fatal("gnet.Serve Fatal", zap.Error(err))
	}
}
