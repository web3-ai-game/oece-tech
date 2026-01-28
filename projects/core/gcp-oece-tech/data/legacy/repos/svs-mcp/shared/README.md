# SVS-MCP Shared Utilities

Shared utilities and libraries for the SVS-MCP platform services.

## Installation

```bash
npm install
```

## Modules

### Logger

Winston-based logging system with file and console transports.

```javascript
import { createLogger, requestLogger } from '@svs-mcp/shared/logger';

// Create logger instance
const logger = createLogger('my-service', 'info');

// Use in code
logger.info('Application started');
logger.error('Error occurred', { error: err.message });

// Express middleware for request logging
app.use(requestLogger(logger));
```

### Validators

Common validation utilities for user input.

```javascript
import { 
  isValidEmail, 
  isValidUsername, 
  validatePassword,
  sanitizeHtml,
  validateSchema 
} from '@svs-mcp/shared/validators';

// Email validation
isValidEmail('user@example.com'); // true

// Username validation
isValidUsername('user123'); // true

// Password validation
const result = validatePassword('MyPass123');
// { valid: true, errors: [] }

// HTML sanitization
sanitizeHtml('<script>alert("xss")</script>'); // &lt;script&gt;...

// Schema validation
const schema = {
  username: { required: true, type: 'string', minLength: 3 },
  email: { required: true, type: 'string', pattern: /email-regex/ }
};
validateSchema(userData, schema);
```

### Errors

Custom error classes and error handling middleware.

```javascript
import { 
  AppError,
  ValidationError,
  AuthenticationError,
  NotFoundError,
  errorHandler,
  asyncHandler 
} from '@svs-mcp/shared/errors';

// Throw custom errors
throw new ValidationError('Invalid input', ['Email is required']);
throw new AuthenticationError('Invalid credentials');
throw new NotFoundError('User not found');

// Express error handler
app.use(errorHandler);

// Async route handler wrapper
app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);
  if (!user) throw new NotFoundError('User not found');
  res.json(user);
}));
```

### Cache

Redis-based caching system.

```javascript
import { CacheManager, cacheMiddleware } from '@svs-mcp/shared/cache';

// Initialize cache manager
const cache = new CacheManager({
  host: 'localhost',
  port: 6379,
  ttl: 3600
});

await cache.connect();

// Basic operations
await cache.set('key', { data: 'value' });
const data = await cache.get('key');
await cache.delete('key');

// Cache with fallback
const user = await cache.getOrSet('user:123', async () => {
  return await db.findUser(123);
}, 3600);

// Express middleware
app.use('/api/users', cacheMiddleware(cache, 300));
```

### Utils

General utility functions.

```javascript
import { 
  generateUUID,
  sleep,
  retry,
  debounce,
  paginate,
  formatBytes,
  deepMerge 
} from '@svs-mcp/shared/utils';

// Generate UUID
const id = generateUUID();

// Sleep
await sleep(1000);

// Retry with exponential backoff
const result = await retry(async () => {
  return await fetchData();
}, 3, 1000);

// Debounce function
const debouncedFn = debounce(() => {
  console.log('Called');
}, 300);

// Paginate array
const page = paginate(items, 1, 10);
// { items: [...], pagination: { page, pageSize, total, ... } }

// Format bytes
formatBytes(1024); // '1 KB'

// Deep merge
const merged = deepMerge(obj1, obj2);
```

## Usage in Services

### Import in service

```javascript
// services/your-service/src/index.js
import { createLogger } from '../../../shared/logger.js';
import { errorHandler } from '../../../shared/errors.js';
import { CacheManager } from '../../../shared/cache.js';

const logger = createLogger('your-service');
const cache = new CacheManager();

// ... use in your service
```

### Add to service package.json

```json
{
  "dependencies": {
    "@svs-mcp/shared": "file:../../../shared"
  }
}
```

## Development

```bash
# Run tests (when available)
npm test

# Link for local development
npm link
```

## License

MIT
