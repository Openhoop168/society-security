import { testConnection } from './database'

// 测试数据库连接的工具函数
export async function runConnectionTest() {
  console.log('🔍 开始测试 Supabase 数据库连接...')

  try {
    const result = await testConnection()

    if (result.success) {
      console.log('✅ Supabase 数据库连接成功！')
      return true
    } else {
      console.error('❌ Supabase 数据库连接失败:', result.error)
      return false
    }
  } catch (error) {
    console.error('❌ 连接测试过程中发生错误:', error)
    return false
  }
}

// 如果在 Node.js 环境中直接运行此文件，执行连接测试
if (typeof window === 'undefined' && require.main === module) {
  runConnectionTest()
    .then((success) => {
      process.exit(success ? 0 : 1)
    })
    .catch((error) => {
      console.error('测试执行失败:', error)
      process.exit(1)
    })
}