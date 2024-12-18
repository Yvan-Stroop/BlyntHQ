"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // Only render after component is mounted on client
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Return a placeholder with the same structure during SSR
  if (!mounted) {
    return <div className="contents">{children}</div>
  }

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="light" // Set a specific default theme
      enableSystem={false} // Disable system theme to prevent hydration mismatch
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}