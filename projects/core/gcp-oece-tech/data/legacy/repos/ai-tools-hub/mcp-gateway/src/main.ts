import { McpClient, McpServerConfig } from './lib/mcp-client';

// 定义目标 MCP 服务器的配置
const TARGET_SERVERS: McpServerConfig[] = [
  {
    name: 'filesystem',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', process.cwd()],
  },
  {
    name: 'sequentialthinking',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-sequential-thinking'],
  },
  {
    name: 'context7',
    command: 'npx',
    args: ['-y', '@upstash/context7-mcp'],
  },
];

/**
 * McpGatewayServer 类是代理服务器的主类。
 * 它管理多个 MCP 客户端，并作为统一的入口点。
 */
class McpGatewayServer {
  private clients: Map<string, McpClient> = new Map();
  private tools: Map<string, { serverName: string; toolSpec: Record<string, unknown> }> = new Map();

  constructor() {
    for (const config of TARGET_SERVERS) {
      this.clients.set(config.name, new McpClient(config));
    }
  }

  /**
   * 启动网关服务器和所有的 MCP 客户端。
   */
  public async start(): Promise<void> {
    console.error('Starting MCP Gateway Server...');

    // Start and connect all clients
    for (const [name, client] of this.clients.entries()) {
      console.error(`- Connecting to ${name}...`);
      await client.start();
    }

    // Discover tools from all connected clients
    await this.discoverTools();

    this.listen();
    console.error('MCP Gateway Server is ready and listening...');
  }

  /**
   * 停止网关服务器和所有的 MCP 客户端。
   */
  public async stop(): Promise<void> {
    console.error('Stopping MCP Gateway Server...');
    const stopPromises = Array.from(this.clients.values()).map(client => client.stop());
    await Promise.all(stopPromises);
  }

  /**
   * 发现并聚合所有目标服务器上的工具。
   */
  private async discoverTools(): Promise<void> {
    console.error('Discovering tools from target servers...');
    const discoveryPromises = Array.from(this.clients.entries()).map(async ([name, client]) => {
      try {
        const response = await client.listTools();
        if (response && response.tools) {
          for (const tool of response.tools) {
            // Prefix tool names with server name to avoid conflicts
            const prefixedName = `${name}__${tool.name}`;
            this.tools.set(prefixedName, {
              serverName: name,
              toolSpec: { ...tool, name: prefixedName },
            });
          }
          console.error(`- Discovered ${response.tools.length} tools from ${name}`);
        }
      } catch (error) {
        console.error(`- Error discovering tools from ${name}:`, error);
      }
    });

    await Promise.all(discoveryPromises);
    console.error(`Tool discovery complete. Total tools: ${this.tools.size}`);
  }

  /**
   * 将请求路由到合适的目标服务器。
   */
  private async routeRequest(method: string, params: Record<string, unknown>): Promise<unknown> {
    // Handle tools/call requests
    if (method === 'tools/call') {
      const toolName = params?.name;
      if (!toolName) {
        return Promise.reject({
          code: -32602,
          message: 'Invalid params: tool name is required',
        });
      }

      const toolInfo = this.tools.get(toolName);
      if (!toolInfo) {
        return Promise.reject({
          code: -32601,
          message: `Tool not found: ${toolName}`,
        });
      }

      const client = this.clients.get(toolInfo.serverName);
      if (!client) {
        return Promise.reject({
          code: -32603,
          message: `Internal error: Client not found for server ${toolInfo.serverName}`,
        });
      }

      // Remove server prefix from tool name when forwarding
      const originalToolName = toolName.replace(`${toolInfo.serverName}__`, '');
      return await client.callTool(originalToolName, params.arguments || {});
    }

    // For other methods, just reject
    return Promise.reject({
      code: -32601,
      message: `Method not found: ${method}`,
    });
  }


  /**
   * 将消息发送到 stdout。
   * @param message - 要发送的消息。
   */
  private sendResponse(message: Record<string, unknown>): void {
    const content = JSON.stringify(message);
    const contentLength = Buffer.byteLength(content, 'utf-8');
    const header = `Content-Length: ${contentLength}\r\n\r\n`;
    process.stdout.write(header + content);
  }

  /**
   * 监听 stdin 并处理来自客户端的请求。
   */
  private listen(): void {
    let buffer = '';
    process.stdin.on('data', (chunk) => {
      buffer += chunk.toString();
      while (true) {
        const match = buffer.match(/Content-Length: (\d+)\r\n\r\n/);
        if (!match) {
          break;
        }

        const contentLength = parseInt(match[1], 10);
        const headerLength = match[0].length;
        const messageLength = headerLength + contentLength;

        if (buffer.length < messageLength) {
          break;
        }

        const messageBody = buffer.substring(headerLength, messageLength);
        buffer = buffer.substring(messageLength);

        this.handleClientRequest(messageBody);
      }
    });
  }

  /**
   * 处理来自客户端的单个请求。
   * @param messageBody - 请求的消息体。
   */
  private async handleClientRequest(messageBody: string): Promise<void> {
    try {
      const request = JSON.parse(messageBody);
      const { id, method, params } = request;

      console.error(`[Gateway] Received request: ${method}`);

      // Handle initialize request
      if (method === 'initialize') {
        this.sendResponse({
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {},
            },
            serverInfo: {
              name: 'mcp-gateway',
              version: '1.0.0',
            },
          },
        });
        return;
      }

      // Handle tools/list request
      if (method === 'tools/list') {
        const toolsList = Array.from(this.tools.values()).map((info) => info.toolSpec);
        this.sendResponse({
          jsonrpc: '2.0',
          id,
          result: {
            tools: toolsList,
          },
        });
        console.error(`[Gateway] Returned ${toolsList.length} tools`);
        return;
      }

      // Route other requests
      try {
        const result = await this.routeRequest(method, params);
        this.sendResponse({
          jsonrpc: '2.0',
          id,
          result,
        });
        console.error(`[Gateway] Request ${method} completed successfully`);
      } catch (error) {
        this.sendResponse({
          jsonrpc: '2.0',
          id,
          error,
        });
        console.error(`[Gateway] Request ${method} failed:`, error);
      }
    } catch (error) {
      console.error('[Gateway] Error handling client request:', error);
    }
  }
}

// 启动服务器
const server = new McpGatewayServer();
server.start().catch((error) => {
  console.error('Failed to start MCP Gateway:', error);
  process.exit(1);
});

// 处理进程退出信号
process.on('SIGINT', async () => {
  await server.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await server.stop();
  process.exit(0);
});