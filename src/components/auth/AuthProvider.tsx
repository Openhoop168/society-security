'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  })

  const router = useRouter()

  // 初始化认证状态
  useEffect(() => {
    let mounted = true

    async function initializeAuth() {
      try {
        // 获取初始会话
        const { data: { session }, error } = await supabase.auth.getSession()

        if (mounted) {
          setAuthState({
            user: session?.user ?? null,
            session,
            isLoading: false,
            isAuthenticated: !!session,
          })
        }
      } catch (error) {
        console.error('初始化认证状态失败:', error)
        if (mounted) {
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
          })
        }
      }
    }

    initializeAuth()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('认证状态变化:', event, session?.user?.email)

        if (mounted) {
          setAuthState({
            user: session?.user ?? null,
            session,
            isLoading: false,
            isAuthenticated: !!session,
          })

          // 根据事件类型处理路由
          if (event === 'SIGNED_IN') {
            router.push('/')
          } else if (event === 'SIGNED_OUT') {
            router.push('/login')
          }
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router])

  // 登录
  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }))

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('登录失败:', error.message)
        return { error }
      }

      console.log('登录成功:', data.user?.email)
      return { error: null }
    } catch (error) {
      console.error('登录异常:', error)
      return { error: { message: '登录过程中发生错误' } as AuthError }
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }
  }

  // 注册
  const signUp = async (email: string, password: string, name: string): Promise<{ error: AuthError | null }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }))

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) {
        console.error('注册失败:', error.message)
        return { error }
      }

      console.log('注册成功:', data.user?.email)
      return { error: null }
    } catch (error) {
      console.error('注册异常:', error)
      return { error: { message: '注册过程中发生错误' } as AuthError }
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }
  }

  // 登出
  const signOut = async (): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }))

    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('登出失败:', error.message)
      } else {
        console.log('登出成功')
      }
    } catch (error) {
      console.error('登出异常:', error)
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }
  }

  // 重置密码
  const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        console.error('发送重置密码邮件失败:', error.message)
        return { error }
      }

      console.log('重置密码邮件发送成功')
      return { error: null }
    } catch (error) {
      console.error('重置密码异常:', error)
      return { error: { message: '发送重置密码邮件时发生错误' } as AuthError }
    }
  }

  // 刷新会话
  const refreshSession = async (): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        console.error('刷新会话失败:', error.message)
      } else {
        console.log('会话刷新成功')
      }
    } catch (error) {
      console.error('刷新会话异常:', error)
    }
  }

  const contextValue: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshSession,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}