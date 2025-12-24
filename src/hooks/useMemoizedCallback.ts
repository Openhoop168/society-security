/**
 * useMemoizedCallback Hook
 * 优化的 useCallback 版本，使用稳定的引用
 */

import { useCallback, useRef } from 'react'

export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  const callbackRef = useRef(callback)

  // 更新回调引用
  callbackRef.current = callback

  // 使用稳定的引用
  return useCallback(
    (...args: Parameters<T>) => callbackRef.current(...args),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  ) as T
}
