'use client'
import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import { CMSLink } from '@/components/Link'
import { useAuth } from '@/providers/Auth'
import { cn } from '@/utilities/cn'
import { ChevronDown, LogOut, Package, User, Wheat } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import type { Header } from 'src/payload-types'

import { MobileMenu } from './MobileMenu'

type Props = {
  header: Header
}

export function HeaderClient({ header }: Props) {
  const menu = header.navItems || []
  const pathname = usePathname()
  const { user } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Tutup dropdown user menu saat klik di luar area atau tombol Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUserMenuOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Tutup dropdown saat rute berpindah
  useEffect(() => {
    setUserMenuOpen(false)
  }, [pathname])

  // Jangan render navbar Bakery di halaman showcase /salon
  if (pathname?.startsWith('/salon')) {
    return null
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/95 backdrop-blur-xs transition-colors">
      <div className="container mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* 1. KIRI: Brand Logo & Title */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          >
            <Wheat className="h-6 w-6 text-[#bc6432] group-hover:scale-105 transition-transform" />
            <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-[#bc6432] transition-colors">
              The Bakery
            </span>
          </Link>

          {/* 2. KANAN: Menu, User Auth, Cart, dan Mobile Hamburger */}
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
            {/* Navigasi Desktop */}
            {menu.length ? (
              <nav aria-label="Menu Utama" className="hidden md:block">
                <ul className="flex items-center gap-6 lg:gap-8 text-sm font-medium">
                  {menu.map((item) => {
                    const isActive =
                      item.link.url && item.link.url !== '/'
                        ? pathname.startsWith(item.link.url)
                        : pathname === item.link.url

                    return (
                      <li key={item.id}>
                        <CMSLink
                          {...item.link}
                          size="clear"
                          appearance="inline"
                          className={cn(
                            'text-sm transition-colors py-1 hover:text-[#bc6432]',
                            isActive
                              ? 'text-[#bc6432] font-semibold border-b-2 border-[#bc6432]'
                              : 'text-slate-600',
                          )}
                        />
                      </li>
                    )
                  })}
                </ul>
              </nav>
            ) : null}

            {/* Garis Pemisah Halus Desktop */}
            <div className="hidden md:block h-4 w-px bg-slate-200" />

            {/* Bagian User Auth Desktop */}
            <div className="hidden md:flex items-center">
              {user ? (
                /* Dropdown User Saat Sudah Login */
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                    className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 py-1.5 px-2"
                  >
                    <User className="h-4 w-4 text-slate-600" />
                    <span className="max-w-[120px] truncate text-xs font-semibold uppercase tracking-wider text-slate-800">
                      {user.name || 'Akun'}
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 text-slate-400 transition-transform duration-150',
                        userMenuOpen && 'rotate-180',
                      )}
                    />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 rounded-none border border-slate-200 bg-white shadow-lg py-2 z-50 animate-in fade-in-50 duration-100">
                      <div className="px-3.5 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {user.name || 'Pelanggan'}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <Package className="h-3.5 w-3.5 text-slate-400" />
                        Pesanan Saya
                      </Link>
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        Kelola Akun
                      </Link>
                      <div className="border-t border-slate-100 my-1" />
                      <Link
                        href="/logout"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5 text-rose-500" />
                        Keluar
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                /* Tombol Masuk & Daftar Saat Belum Login */
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="text-xs uppercase tracking-wider font-semibold text-slate-600 hover:text-slate-900 transition-colors px-2 py-1"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/create-account"
                    className="text-xs uppercase tracking-wider font-semibold px-3.5 py-2 rounded-none bg-slate-900 hover:bg-black text-white transition-colors"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>

            {/* Keranjang Belanja */}
            <div className="flex items-center">
              <Suspense fallback={<OpenCartButton />}>
                <Cart />
              </Suspense>
            </div>

            {/* Tombol Hamburger Menu Mobile */}
            <div className="block md:hidden">
              <Suspense fallback={null}>
                <MobileMenu menu={menu} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
