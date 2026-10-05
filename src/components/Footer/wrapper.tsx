'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

export function FooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Sembunyikan footer default Bakery di halaman demo khusus /salon
  if (pathname?.startsWith('/salon')) {
    return null
  }

  return <>{children}</>
}
