import type { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const PageWrapper = ({ children }: Props) => {
  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "4rem 1rem",
      }}
    >
      {children}
    </main>
  )
}

export default PageWrapper
