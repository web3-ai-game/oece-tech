import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { EventEmitter } from 'events';

// 定义 MCP 服务器的配置
export interface McpServerConfig {
  name: string;
  command: string;
  args: string[];
}

/**
 * McpClient 类负责与一个基于 Stdio 的 MCP 服务器子进程进行通信。
 * 使用官方 @modelcontextprotocol/sdk 实现。
 */
export class McpClient extends EventEmitter {
  private client: Client;
  private transport: StdioClientTransport;
  private connected: boolean = false;

  constructor(private config: McpServerConfig) {
    super();
    
    this.transport = new StdioClientTransport({
      command: config.command,
      args: config.args,
    });

    this.client = new Client({
      name: 'mcp-gateway',
      version: '1.0.0',
    }, {
      capabilities: {},
    });
  }

  /**
   * 启动并连接到 MCP 服务器。
   */
  public async start(): Promise<void> {
    try {
      await this.client.connect(this.transport);
      this.connected = true;
      console.error(`[${this.config.name}] Connected successfully`);
    } catch (error) {
      console.error(`[${this.config.name}] Failed to connect:`, error);
      throw error;
    }
  }

  /**
   * 列出服务器支持的所有工具。
   */
  public async listTools(): Promise<unknown> {
    if (!this.connected) {
      throw new Error('Client is not connected');
    }
    return await this.client.listTools();
  }

  /**
   * 调用服务器上的工具。
   */
  public async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    if (!this.connected) {
      throw new Error('Client is not connected');
    }
    return await this.client.callTool({ name, arguments: args });
  }

  /**
   * 停止并关闭与 MCP 服务器的连接。
   */
  public async stop(): Promise<void> {
    if (this.connected) {
      try {
        await this.client.close();
        this.connected = false;
        console.error(`[${this.config.name}] Disconnected`);
      } catch (error) {
        console.error(`[${this.config.name}] Error during disconnect:`, error);
      }
    }
  }
}