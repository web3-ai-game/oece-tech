# 多阶段构建 - Go版小爱同学Bot
FROM golang:1.21-alpine AS builder

WORKDIR /build

# 安装依赖
RUN apk add --no-cache git ca-certificates

# 复制go.mod和go.sum
COPY go.mod go.sum* ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY main.go ./

# 编译（静态链接）
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags='-w -s -extldflags "-static"' \
    -a -installsuffix cgo \
    -o xiaoai-bot .

# 最终镜像 - 极小
FROM scratch

# 从builder复制证书
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# 复制编译好的二进制
COPY --from=builder /build/xiaoai-bot /xiaoai-bot

# 设置环境变量
ENV TELEGRAM_TOKEN=""

# 健康检查（注：scratch镜像无shell，使用二进制本身）
# HEALTHCHECK --interval=30s --timeout=3s CMD ["/xiaoai-bot", "-health"]

# 运行
ENTRYPOINT ["/xiaoai-bot"]
