# Supabase MCP Server

Model Context Protocol (MCP) server for Supabase integration.

## Features

- Query tables with filters
- Insert, update, and delete rows
- List all tables
- Full Supabase integration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

3. Start the server:
```bash
npm start
```

## Available Tools

### query_table
Query data from a Supabase table with optional filters.

**Parameters:**
- `table` (required): Name of the table to query
- `columns` (optional): Comma-separated list of columns (default: *)
- `filters` (optional): Filter conditions object
- `limit` (optional): Maximum number of rows

### insert_row
Insert a new row into a table.

**Parameters:**
- `table` (required): Name of the table
- `data` (required): Data object to insert

### update_row
Update rows in a table.

**Parameters:**
- `table` (required): Name of the table
- `filters` (required): Filter conditions to match rows
- `data` (required): Data object to update

### delete_row
Delete rows from a table.

**Parameters:**
- `table` (required): Name of the table
- `filters` (required): Filter conditions to match rows

### list_tables
List all tables in the database.

## Usage Example

```javascript
// Query users table
{
  "tool": "query_table",
  "arguments": {
    "table": "users",
    "filters": { "status": "active" },
    "limit": 10
  }
}

// Insert a new user
{
  "tool": "insert_row",
  "arguments": {
    "table": "users",
    "data": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

## Integration with SVS-MCP

This MCP server is part of the SVS-MCP platform and integrates seamlessly with other services.

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "node",
      "args": ["services/supabase-mcp/src/index.js"]
    }
  }
}
```
