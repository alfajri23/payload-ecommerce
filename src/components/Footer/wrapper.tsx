'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

export function FooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Sembunyikan footer default Bakery di halaman demo khusus /salon atau /fashion
  if (pathname?.startsWith('/salon') || pathname?.startsWith('/fashion')) {
    return null
  }

  return <>{children}</>
}
