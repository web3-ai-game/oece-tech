#!/usr/bin/env node

/**
 * 快速修复常见的代码问题
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')

// 修复未转义的单引号
function fixUnescapedQuotes(content) {
  // 在JSX文本中替换单引号
  return content.replace(
    /(<[^>]+>)([^<]*)'([^<]*)(<\/[^>]+>)/g,
    '$1$2&apos;$3$4'
  )
}

// 修复any类型（改为unknown）
function fixAnyTypes(content) {
  // 保留必要的any（如第三方库）
  const protectedPatterns = [
    'React.ComponentPropsWithoutRef<any>',
    'NextApiRequest',
    'NextApiResponse'
  ]
  
  let result = content
  
  // 只替换明显的any类型声明
  result = result.replace(/: any\b/g, ': unknown')
  result = result.replace(/<any>/g, '<unknown>')
  result = result.replace(/\bany\[\]/g, 'unknown[]')
  
  // 恢复受保护的模式
  protectedPatterns.forEach(pattern => {
    result = result.replace(
      pattern.replace('any', 'unknown'),
      pattern
    )
  })
  
  return result
}

// 添加类型到未类型化的参数
function addMissingTypes(content) {
  // 为常见的事件处理器添加类型
  content = content.replace(
    /\bonClick=\{(\w+)\}/g,
    (match, handler) => {
      if (!content.includes(`${handler}:`)) {
        console.log(`Consider adding type to handler: ${handler}`)
      }
      return match
    }
  )
  
  return content
}

// 处理单个文件
function processFile(filePath) {
  const ext = path.extname(filePath)
  if (!['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
    return false
  }
  
  let content = fs.readFileSync(filePath, 'utf8')
  const originalContent = content
  
  // 应用修复
  if (ext === '.tsx' || ext === '.jsx') {
    content = fixUnescapedQuotes(content)
  }
  
  if (ext === '.ts' || ext === '.tsx') {
    content = fixAnyTypes(content)
    content = addMissingTypes(content)
  }
  
  // 如果内容有变化，写回文件
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`✅ Fixed: ${filePath}`)
    return true
  }
  
  return false
}

// 主函数
function main() {
  console.log('🔧 开始快速修复...\n')
  
  const patterns = [
    'app/**/*.{ts,tsx,js,jsx}',
    'components/**/*.{ts,tsx,js,jsx}',
    'lib/**/*.{ts,tsx,js,jsx}'
  ]
  
  let totalFixed = 0
  
  patterns.forEach(pattern => {
    const files = glob.sync(pattern, {
      ignore: ['**/node_modules/**', '**/.next/**']
    })
    
    files.forEach(file => {
      if (processFile(file)) {
        totalFixed++
      }
    })
  })
  
  console.log(`\n✨ 修复完成！共修复 ${totalFixed} 个文件`)
  console.log('\n下一步:')
  console.log('1. 运行 npm run lint 检查剩余问题')
  console.log('2. 运行 npm run build 验证构建')
}

// 检查是否安装了glob
try {
  require('glob')
} catch (e) {
  console.log('📦 安装依赖...')
  require('child_process').execSync('npm install --save-dev glob', {
    stdio: 'inherit'
  })
}

main()
