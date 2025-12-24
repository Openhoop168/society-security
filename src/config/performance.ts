/**
 * 性能优化配置
 * 定义应用的性能相关配置
 */

export const performanceConfig = {
  // 代码分割配置
  codeSplitting: {
    enabled: true,
    // 页面级别的懒加载
    lazyPages: [
      '/upload',
      '/results',
      '/admin',
    ],
  },

  // 缓存配置
  caching: {
    // 数据缓存时间（毫秒）
    defaultTTL: 5 * 60 * 1000, // 5分钟
    userDataTTL: 10 * 60 * 1000, // 10分钟
    calculationResultsTTL: 15 * 60 * 1000, // 15分钟
  },

  // 防抖/节流配置
  debounce: {
    // 搜索输入防抖（毫秒）
    searchInput: 300,
    // 窗口大小改变防抖（毫秒）
    windowResize: 200,
    // 自动保存防抖（毫秒）
    autoSave: 1000,
  },

  // 节流配置
  throttle: {
    // 滚动事件节流（毫秒）
    scroll: 100,
    // 鼠标移动节流（毫秒）
    mouseMove: 50,
  },

  // 批量处理配置
  batchProcessing: {
    // 批量插入每批数量
    insertBatchSize: 100,
    // 批量更新每批数量
    updateBatchSize: 50,
    // 批量删除每批数量
    deleteBatchSize: 100,
  },

  // 分页配置
  pagination: {
    // 默认每页数量
    defaultPageSize: 10,
    // 每页数量选项
    pageSizeOptions: [10, 20, 50, 100],
    // 最大每页数量
    maxPageSize: 100,
  },

  // 图片优化配置
  images: {
    // 懒加载阈值（像素）
    lazyThreshold: 200,
    // 图片格式
    formats: ['image/avif', 'image/webp'],
    // 图片质量
    quality: 85,
  },

  // 动画配置
  animation: {
    // 页面切换动画时长（毫秒）
    pageTransition: 300,
    // 元素进入动画时长（毫秒）
    fadeIn: 200,
    // 元素退出动画时长（毫秒）
    fadeOut: 150,
  },

  // API 请求配置
  api: {
    // 请求超时时间（毫秒）
    timeout: 30000,
    // 重试次数
    maxRetries: 3,
    // 重试延迟（毫秒）
    retryDelay: 1000,
  },

  // 内存管理配置
  memory: {
    // 最大缓存条目数
    maxCacheEntries: 100,
    // 缓存清理间隔（毫秒）
    cacheCleanupInterval: 60000,
  },
}

export type PerformanceConfig = typeof performanceConfig
