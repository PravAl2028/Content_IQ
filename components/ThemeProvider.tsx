'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => { },
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const pathname = usePathname()

  const isDashboard = pathname?.startsWith('/dashboard') || false

  // On mount or path change: read saved preference, default to dark
  useEffect(() => {
    if (isDashboard) {
      // In dashboard, respect saved preference
      const saved = localStorage.getItem('theme') as Theme | null
      const resolved: Theme = saved === 'light' ? 'light' : 'dark'
      setTheme(resolved)
      applyTheme(resolved)
    } else {
      // Outside dashboard, force dark mode
      setTheme('dark')
      applyTheme('dark')
    }
  }, [isDashboard])

  function applyTheme(t: Theme) {
    const root = document.documentElement
    if (t === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  function toggleTheme() {
    if (!isDashboard) return // Only allow toggling in dashboard

    setTheme(prev => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      applyTheme(next)
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
