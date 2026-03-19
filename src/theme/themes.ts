// src/theme/themes.ts

export type Theme = {
    background: string
    text: string
    card: string
    accent: string
  }
  
  export const lightTheme: Theme = {
    background: "#FAFAFA",
    text: "#111111",
    card: "#FFFFFF",
    accent: "#2F5DFF",
  }
  
  export const darkTheme: Theme = {
    background: "#0D0D0D",
    text: "#EAEAEA",
    card: "#161616",
    accent: "#6C8BFF",
  }
  