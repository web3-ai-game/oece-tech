#!/usr/bin/env node

/**
 * 最后的修复脚本 - 修复剩余的语法问题
 */

const fs = require('fs')
const path = require('path')

// 需要修复的文件列表（基于构建错误）
const filesToFix = [
  'app/dashboard/page.tsx',
  'app/forum/page.tsx',
  'app/pricing/page.tsx',
  'app/profile/page.tsx',
  'app/tools/page.tsx'
]

// 修复函数
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8')
    let fixed = false
    
    // 查找并修复未闭合的三元运算符
    // 模式: ? '...' : '...'  后面没有 }
    const ternaryPattern = /(\?\s*['"`][^'"`]*['"`]\s*:\s*['"`][^'"`]*['"`])(?!\s*})/g
    
    if (ternaryPattern.test(content)) {
      content = content.replace(ternaryPattern, '$1}')
      fixed = true
    }
    
    // 修复可能的其他模式
    // 检查 {condition ? 'value1' : 'value2' 缺少结束括号
    const lines = content.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // 计算该行的括号平衡
      const openBrackets = (line.match(/\{/g) || []).length
      const closeBrackets = (line.match(/\}/g) || []).length
      
      // 如果包含三元运算符且括号不平衡
      if (line.includes('?') && line.includes(':') && openBrackets > closeBrackets) {
        // 检查是否是JSX中的三元运算符
        if (line.includes("'") || line.includes('"')) {
          // 在行尾添加缺失的括号
          if (!line.trim().endsWith('}')) {
            lines[i] = line + '}'
            fixed = true
          }
        }
      }
    }
    
    if (fixed) {
      content = lines.join('\n')
      fs.writeFileSync(filePath, content, 'utf8')
      console.log(`✅ 修复: ${filePath}`)
      return true
    } else {
      console.log(`⏭️  跳过: ${filePath} (无需修复)`)
      return false
    }
  } catch (error) {
    console.error(`❌ 错误: ${filePath} - ${error.message}`)
    return false
  }
}

// 主函数
function main() {
  console.log('🔧 开始最终修复...\n')
  
  let fixedCount = 0
  
  filesToFix.forEach(file => {
    const fullPath = path.join(process.cwd(), file)
    if (fs.existsSync(fullPath)) {
      if (fixFile(fullPath)) {
        fixedCount++
      }
    } else {
      console.log(`⚠️  文件不存在: ${file}`)
    }
  })
  
  console.log(`\n✨ 修复完成！共修复 ${fixedCount} 个文件`)
  console.log('\n下一步:')
  console.log('1. 运行 npm run build 验证构建')
  console.log('2. 如果仍有错误，请手动检查')
}

main()
