import type { PropsWithChildren } from 'react'

export default function SiteLayout({ children }: PropsWithChildren) {
  return <main id="main-content">{children}</main>
}
