#!/usr/bin/env node

/**
 * MCP服务器测试脚本
 * 验证Hotel Inistel项目中配置的MCP服务器功能
 */

const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Hotel Inistel MCP服务器测试');
console.log('================================');

// 测试结果收集
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function addTestResult(name, success, message = '') {
  testResults.tests.push({ name, success, message });
  if (success) {
    testResults.passed++;
    console.log(`✅ ${name}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${name}: ${message}`);
  }
}

async function runCommand(command) {
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      resolve({
        success: !error,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        error
      });
    });
  });
}

async function testMCPServers() {
  console.log('\n📋 测试MCP服务器配置...\n');

  // 1. 测试项目结构
  const projectPath = '/Users/svs.loline/Documents/xiangmu/hotel-inistel';
  const fs = require('fs');
  
  try {
    const mcpConfigExists = fs.existsSync(path.join(projectPath, '.windsurf/mcp-enhanced.json'));
    addTestResult('MCP配置文件存在', mcpConfigExists);
    
    const databaseExists = fs.existsSync(path.join(projectPath, 'database/hotel.db'));
    addTestResult('SQLite数据库文件存在', databaseExists);
    
    const envExists = fs.existsSync(path.join(projectPath, '.env'));
    addTestResult('环境配置文件存在', envExists);
  } catch (error) {
    addTestResult('文件系统检查', false, error.message);
  }

  // 2. 测试SQLite数据库
  try {
    const dbTest = await runCommand(`sqlite3 ${projectPath}/database/hotel.db "SELECT COUNT(*) FROM tenants;"`);
    const tenantCount = parseInt(dbTest.stdout);
    addTestResult('SQLite数据库连接', dbTest.success && tenantCount >= 1, 
      dbTest.success ? `发现 ${tenantCount} 个租户` : dbTest.stderr);
  } catch (error) {
    addTestResult('SQLite数据库测试', false, error.message);
  }

  // 3. 测试Node.js依赖
  try {
    const packageTest = await runCommand('npm list @modelcontextprotocol/sdk');
    addTestResult('MCP SDK安装', packageTest.success, 
      packageTest.success ? 'SDK已安装' : '需要安装MCP SDK');
  } catch (error) {
    addTestResult('依赖检查', false, error.message);
  }

  // 4. 测试项目启动准备
  try {
    const frontendDeps = fs.existsSync(path.join(projectPath, 'node_modules'));
    addTestResult('前端依赖安装', frontendDeps);
    
    const backendDeps = fs.existsSync(path.join(projectPath, 'backend/node_modules'));
    addTestResult('后端依赖安装', backendDeps);
  } catch (error) {
    addTestResult('依赖检查', false, error.message);
  }

  // 输出测试总结
  console.log('\n📊 测试总结');
  console.log('============');
  console.log(`✅ 通过: ${testResults.passed}`);
  console.log(`❌ 失败: ${testResults.failed}`);
  console.log(`📈 成功率: ${Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%`);

  if (testResults.failed === 0) {
    console.log('\n🎉 所有MCP服务器配置正常！可以开始开发工作。');
  } else {
    console.log('\n⚠️  部分配置需要完善，请检查失败的项目。');
  }

  // 输出下一步建议
  console.log('\n🔧 下一步操作建议:');
  console.log('1. 启动后端服务: cd backend && npm run dev');
  console.log('2. 启动前端服务: npm start');
  console.log('3. 访问应用: http://localhost:3000');
  console.log('4. 测试MCP功能: 在Windsurf中使用MCP工具');

  return testResults;
}

// 运行测试
if (require.main === module) {
  testMCPServers().catch(console.error);
}

module.exports = { testMCPServers };