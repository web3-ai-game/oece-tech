# Contributing to SVS-MCP

Thank you for your interest in contributing to SVS-MCP! This document provides guidelines and instructions for contributing.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Project Structure](#project-structure)
5. [Coding Standards](#coding-standards)
6. [Commit Guidelines](#commit-guidelines)
7. [Pull Request Process](#pull-request-process)
8. [Testing](#testing)
9. [Documentation](#documentation)

---

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and beginners
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or intimidation
- Trolling or insulting comments
- Publishing others' private information
- Unprofessional conduct

---

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- Basic knowledge of JavaScript/Node.js
- Familiarity with Express.js (for services)
- Understanding of Docker (optional)

### Find an Issue

1. Check [existing issues](https://github.com/web3-ai-game/svs-mcp/issues)
2. Look for issues labeled `good first issue` or `help wanted`
3. Comment on the issue to claim it
4. Wait for maintainer approval before starting work

### Report a Bug

Before creating a bug report:
1. Search existing issues
2. Verify it's actually a bug
3. Collect relevant information

Create a bug report with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots or logs (if applicable)

### Request a Feature

1. Search existing feature requests
2. Clearly describe the feature
3. Explain why it would be useful
4. Provide examples if possible

---

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/svs-mcp.git
cd svs-mcp

# Add upstream remote
git remote add upstream https://github.com/web3-ai-game/svs-mcp.git
```

### 2. Install Dependencies

```bash
# Run setup script
npm run setup

# Or manually
npm install
npm run install:all
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with your development settings
nano .env
```

### 4. Start Development Services

```bash
# With PM2
npm run dev

# Or with Docker
npm run docker:up

# Monitor services
npm run monitor
```

### 5. Create a Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bugfix
git checkout -b fix/bug-description
```

---

## Project Structure

```
svs-mcp/
├── services/              # Microservices
│   ├── knowledge-base/    # MCP Knowledge Base
│   ├── aibot/            # AI Bot Service
│   ├── ai-tools/         # AI Tools Service
│   └── forum/            # Forum Service
├── shared/               # Shared utilities
│   ├── logger.js         # Logging utilities
│   ├── validators.js     # Validation utilities
│   ├── errors.js         # Error classes
│   ├── cache.js          # Cache manager
│   └── utils.js          # General utilities
├── scripts/              # Utility scripts
│   ├── setup.sh          # Setup script
│   ├── health-check.sh   # Health check
│   └── monitor.sh        # Monitoring
├── data/                 # Data storage
├── logs/                 # Log files
├── docker-compose.yml    # Docker configuration
├── ecosystem.config.js   # PM2 configuration
└── package.json          # Root dependencies
```

### Service Structure

```
services/service-name/
├── src/
│   └── index.js          # Service entry point
├── Dockerfile            # Docker configuration
└── package.json          # Service dependencies
```

---

## Coding Standards

### JavaScript Style

- Use ES6+ features
- Use `const` for immutable variables
- Use `let` for mutable variables
- Avoid `var`
- Use arrow functions for callbacks
- Use template literals for strings
- Use async/await over promises when possible

### Naming Conventions

```javascript
// Variables and functions: camelCase
const userName = 'John';
function getUserData() {}

// Classes: PascalCase
class UserManager {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;

// Private methods: _prefixed
function _privateMethod() {}

// Files: kebab-case
// user-manager.js, api-routes.js
```

### Code Organization

```javascript
// 1. Imports
import express from 'express';
import { createLogger } from '../../shared/logger.js';

// 2. Constants
const PORT = 3000;
const MAX_RETRIES = 3;

// 3. Configuration
const app = express();
const logger = createLogger('service-name');

// 4. Middleware
app.use(express.json());

// 5. Routes
app.get('/health', (req, res) => {});

// 6. Helper functions
function helperFunction() {}

// 7. Main/Start function
async function start() {}

// 8. Execute
start();
```

### Error Handling

```javascript
// Use custom error classes
import { ValidationError, NotFoundError } from '../../shared/errors.js';

// Throw appropriate errors
if (!user) {
  throw new NotFoundError('User not found');
}

// Use try-catch for async operations
try {
  const result = await fetchData();
} catch (error) {
  logger.error('Fetch failed', { error: error.message });
  throw error;
}

// Use asyncHandler for Express routes
import { asyncHandler } from '../../shared/errors.js';

app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await getUser(req.params.id);
  res.json(user);
}));
```

### Logging

```javascript
import { createLogger } from '../../shared/logger.js';

const logger = createLogger('service-name');

// Use appropriate log levels
logger.error('Critical error', { error: err.message });
logger.warn('Warning message', { context: data });
logger.info('Informational message', { userId: id });
logger.debug('Debug information', { details: obj });
```

### Comments

```javascript
/**
 * Get user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object>} User object
 * @throws {NotFoundError} If user not found
 */
async function getUser(id) {
  // Implementation
}

// Single-line comments for brief explanations
const result = await fetchData(); // Fetch from API
```

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(aibot): add streaming support for chat API"

# Bug fix
git commit -m "fix(forum): resolve database connection timeout"

# Documentation
git commit -m "docs: update deployment guide with nginx config"

# Refactoring
git commit -m "refactor(shared): improve error handling utilities"
```

### Best Practices

- Use present tense ("add" not "added")
- Use imperative mood ("move" not "moves")
- Keep subject line under 50 characters
- Capitalize subject line
- No period at the end of subject
- Separate subject from body with blank line
- Wrap body at 72 characters
- Explain what and why, not how

---

## Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Test your changes**
   ```bash
   npm test
   npm run health-check
   ```

3. **Lint your code**
   ```bash
   npm run lint
   ```

4. **Update documentation**
   - Update README if needed
   - Add JSDoc comments
   - Update API documentation

### Creating Pull Request

1. Push to your fork
   ```bash
   git push origin your-branch
   ```

2. Create PR on GitHub
   - Clear title describing changes
   - Reference related issues
   - Describe changes in detail
   - Add screenshots if applicable

3. PR Template
   ```markdown
   ## Description
   Brief description of changes
   
   ## Related Issue
   Fixes #123
   
   ## Changes Made
   - Change 1
   - Change 2
   
   ## Testing
   - [ ] Tested locally
   - [ ] Added unit tests
   - [ ] Updated documentation
   
   ## Screenshots
   (if applicable)
   ```

### Review Process

1. Wait for maintainer review
2. Address feedback promptly
3. Make requested changes
4. Request re-review when ready

### After Approval

- Maintainers will merge your PR
- Delete your branch
- Update your fork
  ```bash
  git checkout main
  git pull upstream main
  git push origin main
  ```

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run service-specific tests
cd services/aibot && npm test

# Run with coverage
npm run test:coverage
```

### Writing Tests

```javascript
// Example test structure
describe('UserService', () => {
  describe('getUser', () => {
    it('should return user by id', async () => {
      const user = await getUser(1);
      expect(user).toBeDefined();
      expect(user.id).toBe(1);
    });

    it('should throw NotFoundError for invalid id', async () => {
      await expect(getUser(999))
        .rejects
        .toThrow(NotFoundError);
    });
  });
});
```

### Test Coverage

- Aim for 80%+ code coverage
- Test happy paths
- Test error cases
- Test edge cases
- Mock external dependencies

---

## Documentation

### Code Documentation

- Use JSDoc comments for functions
- Document complex logic
- Keep comments up-to-date
- Remove commented-out code

### User Documentation

- Update README.md for user-facing changes
- Update API_DOCUMENTATION.md for API changes
- Update DEPLOYMENT.md for deployment changes
- Add examples for new features

### Documentation Style

- Clear and concise
- Use examples
- Include code snippets
- Add links to related docs
- Keep formatting consistent

---

## Questions?

- Create a [discussion](https://github.com/web3-ai-game/svs-mcp/discussions)
- Join our community chat
- Email: contribute@svs-mcp.com

---

Thank you for contributing to SVS-MCP! 🎉
