import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize database
const dbPath = process.env.KB_DB_PATH || join(__dirname, '../../../data/knowledge.db');
const dbDir = dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS entities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS observations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS relations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_entity_id INTEGER NOT NULL,
    to_entity_id INTEGER NOT NULL,
    relation_type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_entity_id) REFERENCES entities(id) ON DELETE CASCADE,
    FOREIGN KEY (to_entity_id) REFERENCES entities(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_entities_name ON entities(name);
  CREATE INDEX IF NOT EXISTS idx_observations_entity ON observations(entity_id);
  CREATE INDEX IF NOT EXISTS idx_relations_from ON relations(from_entity_id);
  CREATE INDEX IF NOT EXISTS idx_relations_to ON relations(to_entity_id);
`);

// MCP Server implementation
const server = new Server(
  {
    name: 'svs-knowledge-base',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'create_entities',
        description: 'Create multiple entities in the knowledge graph',
        inputSchema: {
          type: 'object',
          properties: {
            entities: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'Entity name' },
                  entityType: { type: 'string', description: 'Entity type' },
                  observations: { type: 'array', items: { type: 'string' } },
                },
                required: ['name', 'entityType', 'observations'],
              },
            },
          },
          required: ['entities'],
        },
      },
      {
        name: 'create_relations',
        description: 'Create relations between entities',
        inputSchema: {
          type: 'object',
          properties: {
            relations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  from: { type: 'string' },
                  to: { type: 'string' },
                  relationType: { type: 'string' },
                },
                required: ['from', 'to', 'relationType'],
              },
            },
          },
          required: ['relations'],
        },
      },
      {
        name: 'search_nodes',
        description: 'Search for entities by name or observations',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query' },
          },
          required: ['query'],
        },
      },
      {
        name: 'read_graph',
        description: 'Read the entire knowledge graph',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Tool handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'create_entities': {
        const results = [];
        for (const entity of args.entities) {
          const stmt = db.prepare('INSERT INTO entities (name, type) VALUES (?, ?)');
          const result = stmt.run(entity.name, entity.entityType);
          const entityId = result.lastInsertRowid;

          for (const obs of entity.observations) {
            db.prepare('INSERT INTO observations (entity_id, content) VALUES (?, ?)').run(
              entityId,
              obs
            );
          }
          results.push({ id: entityId, name: entity.name });
        }
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'create_relations': {
        const results = [];
        for (const rel of args.relations) {
          const fromEntity = db.prepare('SELECT id FROM entities WHERE name = ?').get(rel.from);
          const toEntity = db.prepare('SELECT id FROM entities WHERE name = ?').get(rel.to);

          if (!fromEntity || !toEntity) {
            throw new Error(`Entity not found: ${rel.from} or ${rel.to}`);
          }

          const stmt = db.prepare(
            'INSERT INTO relations (from_entity_id, to_entity_id, relation_type) VALUES (?, ?, ?)'
          );
          const result = stmt.run(fromEntity.id, toEntity.id, rel.relationType);
          results.push({ id: result.lastInsertRowid, ...rel });
        }
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'search_nodes': {
        const query = `%${args.query}%`;
        const entities = db
          .prepare(
            `
          SELECT DISTINCT e.* FROM entities e
          LEFT JOIN observations o ON e.id = o.entity_id
          WHERE e.name LIKE ? OR o.content LIKE ?
          LIMIT 20
        `
          )
          .all(query, query);

        const results = entities.map((e) => {
          const observations = db
            .prepare('SELECT content FROM observations WHERE entity_id = ?')
            .all(e.id);
          return { ...e, observations: observations.map((o) => o.content) };
        });

        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'read_graph': {
        const entities = db.prepare('SELECT * FROM entities').all();
        const relations = db
          .prepare(
            `
          SELECT r.*, 
            e1.name as from_name, 
            e2.name as to_name
          FROM relations r
          JOIN entities e1 ON r.from_entity_id = e1.id
          JOIN entities e2 ON r.to_entity_id = e2.id
        `
          )
          .all();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ entities: entities.length, relations: relations.length }, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('SVS Knowledge Base MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
