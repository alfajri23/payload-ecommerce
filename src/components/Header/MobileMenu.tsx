'use client'

import type { Header } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useAuth } from '@/providers/Auth'
import { MenuIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Props {
  menu: Header['navItems']
}

export function MobileMenu({ menu }: Props) {
  const { user } = useAuth()

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const closeMobileMenu = () => setIsOpen(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname, searchParams])

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger className="relative flex h-10 w-10 items-center justify-center rounded-none border border-slate-200 text-slate-800 hover:border-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 cursor-pointer">
        <MenuIcon className="h-4 w-4" />
      </SheetTrigger>

      <SheetContent side="left" className="px-6 flex flex-col justify-between">
        <div>
          <SheetHeader className="px-0 pt-4 pb-2 border-b border-slate-100">
            <SheetTitle className="text-left font-bold text-lg text-slate-900">
              The Bakery
            </SheetTitle>
            <SheetDescription className="text-left text-xs text-slate-500">
              Artisan Bakery & Pastry Shop
            </SheetDescription>
          </SheetHeader>

          {/* Navigasi Utama Mobile */}
          <div className="py-4">
            {menu?.length ? (
              <ul className="flex w-full flex-col divide-y divide-slate-100">
                {menu.map((item) => (
                  <li className="py-2.5" key={item.id}>
                    <CMSLink
                      {...item.link}
                      appearance="link"
                      className="text-sm font-medium text-slate-800 hover:text-[#bc6432] transition-colors"
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        {/* Bagian Akun Mobile */}
        <div className="pb-8 pt-4 border-t border-slate-100">
          {user ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Akun Anda
                </p>
                <p className="text-sm font-semibold text-slate-900 mt-1 truncate">
                  {user.name || user.email}
                </p>
              </div>
              <ul className="flex flex-col gap-2.5 text-sm">
                <li>
                  <Link
                    href="/orders"
                    className="text-slate-700 hover:text-[#bc6432] transition-colors"
                  >
                    Pesanan Saya
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account"
                    className="text-slate-700 hover:text-[#bc6432] transition-colors"
                  >
                    Kelola Akun & Alamat
                  </Link>
                </li>
                <li className="pt-2">
                  <Button asChild variant="outline" className="w-full rounded-none">
                    <Link href="/logout" className="text-rose-600">
                      Keluar
                    </Link>
                  </Button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Masuk atau Buat Akun
              </p>
              <div className="flex flex-col gap-2.5">
                <Button asChild className="w-full rounded-none" variant="outline">
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button asChild className="w-full rounded-none bg-slate-900 hover:bg-black text-white">
                  <Link href="/create-account">Daftar Akun Baru</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
