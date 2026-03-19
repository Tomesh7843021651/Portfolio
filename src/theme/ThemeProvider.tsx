import { createContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import { lightTheme, darkTheme } from "./themes"
import type { Theme } from "./themes"

interface ThemeContextType {
  theme: Theme
  mode: "light" | "dark"
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | null>(null)

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<"light" | "dark">("light")

  useEffect(() => {
    document.body.style.background =
      mode === "light" ? lightTheme.background : darkTheme.background
    document.body.style.color =
      mode === "light" ? lightTheme.text : darkTheme.text
  }, [mode])

  return (
    <ThemeContext.Provider
      value={{
        theme: mode === "light" ? lightTheme : darkTheme,
        mode,
        toggleTheme: () =>
          setMode((prev) => (prev === "light" ? "dark" : "light")),
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
