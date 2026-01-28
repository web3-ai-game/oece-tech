# 多阶段构建 - Go版SVS Bot
FROM golang:1.21-alpine AS builder

# 设置工作目录
WORKDIR /build

# 安装必要的工具
RUN apk add --no-cache git ca-certificates tzdata

# 复制go.mod和go.sum
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY . .

# 编译（静态链接，支持多架构）
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags='-w -s -extldflags "-static"' \
    -a -installsuffix cgo \
    -o svs-bot ./cmd/bot

# 最终镜像 - 使用distroless极简镜像
FROM gcr.io/distroless/static:nonroot

# 复制时区数据
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo

# 复制CA证书
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# 复制编译好的二进制文件
COPY --from=builder /build/svs-bot /svs-bot

# 设置时区
ENV TZ=Asia/Singapore

# 使用非root用户
USER nonroot:nonroot

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD ["/svs-bot", "-health"] || exit 1

# 运行
ENTRYPOINT ["/svs-bot"]
