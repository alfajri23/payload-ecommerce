'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Search,
  ShoppingBag,
  Heart,
  ArrowRight,
  ArrowLeft,
  Truck,
  RotateCcw,
  ShieldCheck,
  Plus,
  Check,
  Menu,
  X,
  Play,
} from 'lucide-react'
import {
  PRODUCT_CATEGORIES,
  ALL_PRODUCTS,
  MOOD_TAGS,
  FEATURE_BENEFITS,
  FashionProduct,
} from './fashion-data'

// Format mata uang Rupiah
const formatRupiah = (amount: number) => {
  return `Rp ${amount.toLocaleString('id-ID')}`
}

export function FashionPageClient() {
  // State navigasi dan laci keranjang
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [cartItems, setCartItems] = useState<{ product: FashionProduct; quantity: number }[]>([
    { product: ALL_PRODUCTS[0], quantity: 1 },
  ])
  const [likedProductIds, setLikedProductIds] = useState<string[]>(['stand-up-collar'])

  // Filter suasana hati (mood)
  const [activeMood, setActiveMood] = useState<string | null>(null)

  // Notifikasi toast
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Penghitung waktu mundur aktif
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 12,
    minutes: 53,
    seconds: 38,
  })

  // Detik demi detik timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Fungsi memicu notifikasi toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // Tambah produk ke tas belanja
  const handleAddToCart = (product: FashionProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
    triggerToast(`${product.name} berhasil ditambahkan ke tas belanja`)
    setCartDrawerOpen(true)
  }

  // Hapus produk dari tas
  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  // Beralih status favorit (wishlist)
  const handleToggleWishlist = (productId: string) => {
    setLikedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  // Kalkulasi total keranjang
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 font-sans antialiased selection:bg-neutral-900 selection:text-white">
      {/* Notifikasi Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-neutral-900 text-white px-4 py-2.5 rounded-full shadow-xl transition-all text-xs font-normal"
        >
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. NAVBAR UTAMA AVENUE                                                    */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-neutral-200 h-16 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 items-center">
            {/* Navigasi Kiri */}
            <nav aria-label="Navigasi Utama" className="hidden md:flex items-center gap-8">
              <Link
                href="/fashion"
                className="text-sm font-normal text-neutral-900 hover:text-neutral-500 transition-colors"
              >
                Beranda
              </Link>
              <a
                href="#category-outerwear"
                className="text-sm font-normal text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Koleksi
              </a>
              <a
                href="#seasonal-favorites"
                className="text-sm font-normal text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Harga Spesial
              </a>
            </nav>

            {/* Tombol Menu Mobile */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Buka menu navigasi"
                className="p-2 -ml-2 text-neutral-700 hover:text-neutral-900 rounded-md min-h-11 min-w-11 flex items-center justify-center"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Logo Brand Tengah */}
            <div className="flex items-center justify-start md:justify-center gap-2">
              <div className="flex items-center justify-center text-neutral-900">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
                </svg>
              </div>
              <Link
                href="/fashion"
                className="text-xl sm:text-2xl font-medium tracking-tight text-neutral-900 hover:opacity-80 transition-opacity"
              >
                Avenue
              </Link>
            </div>

            {/* Ikon Kanan (Pencarian, Favorit, Tas) */}
            <div className="flex items-center justify-end gap-1 sm:gap-2">
              {/* Kolom Pencarian */}
              <div className="relative">
                {searchOpen ? (
                  <div className="flex items-center bg-neutral-100 rounded-full px-3 py-1 border border-neutral-300">
                    <Search className="w-3.5 h-3.5 text-neutral-500 mr-1.5" />
                    <input
                      type="text"
                      placeholder="Cari pakaian..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="bg-transparent text-xs text-neutral-900 outline-none w-28 sm:w-36 font-normal"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSearchOpen(false)
                        setSearchQuery('')
                      }}
                      className="text-neutral-400 hover:text-neutral-700 p-0.5"
                      aria-label="Tutup pencarian"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    aria-label="Buka pencarian"
                    className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors rounded-full hover:bg-neutral-100 min-h-11 min-w-11 flex items-center justify-center"
                  >
                    <Search className="w-5 h-5 stroke-[1.5]" />
                  </button>
                )}
              </div>

              {/* Tombol Wishlist */}
              <button
                type="button"
                onClick={() =>
                  triggerToast(
                    likedProductIds.length > 0
                      ? `${likedProductIds.length} item tersimpan di daftar keinginan`
                      : 'Daftar keinginan Anda masih kosong',
                  )
                }
                aria-label={`Daftar keinginan dengan ${likedProductIds.length} item`}
                className="relative p-2 text-neutral-700 hover:text-neutral-900 transition-colors rounded-full hover:bg-neutral-100 min-h-11 min-w-11 flex items-center justify-center"
              >
                <Heart
                  className={`w-5 h-5 stroke-[1.5] ${likedProductIds.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`}
                />
                {likedProductIds.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-rose-500 text-white text-xs flex items-center justify-center rounded-full font-normal">
                    {likedProductIds.length}
                  </span>
                )}
              </button>

              {/* Tombol Tas Belanja */}
              <button
                type="button"
                onClick={() => setCartDrawerOpen(true)}
                aria-label={`Tas belanja dengan ${totalCartCount} item`}
                className="relative p-2 text-neutral-700 hover:text-neutral-900 transition-colors rounded-full hover:bg-neutral-100 min-h-11 min-w-11 flex items-center justify-center"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                {totalCartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-neutral-900 text-white text-xs flex items-center justify-center rounded-full font-normal">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Navigasi Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-white">
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <span className="font-medium text-lg tracking-tight text-neutral-900">Avenue</span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Tutup menu"
              className="p-2 rounded-md text-neutral-700 min-h-11 min-w-11 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 px-5 py-6 space-y-6 overflow-y-auto">
            <div className="space-y-4">
              <Link
                href="/fashion"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-normal text-neutral-900 hover:text-neutral-500"
              >
                Beranda
              </Link>
              {PRODUCT_CATEGORIES.map((cat) => (
                <a
                  key={cat.id}
                  href={`#category-${cat.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-normal text-neutral-900 hover:text-neutral-500"
                >
                  {cat.title}
                </a>
              ))}
              <a
                href="#seasonal-favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-normal text-neutral-900 hover:text-neutral-500"
              >
                Harga Spesial
              </a>
            </div>

            <div className="pt-4 border-t border-neutral-200 space-y-2.5">
              <p className="text-xs font-normal text-neutral-400 uppercase tracking-wider">
                Pilih Berdasarkan Suasana Hati
              </p>
              <div className="flex flex-wrap gap-1.5">
                {MOOD_TAGS.map((mood) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => {
                      setActiveMood(activeMood === mood ? null : mood)
                      setMobileMenuOpen(false)
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-normal border transition-colors ${
                      activeMood === mood
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-700 border-neutral-300'
                    }`}
                  >
                    + {mood}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. HERO SECTION: 100VH, OBJECT-CENTER, MOOD CARD DI KANAN ATAS            */}
      {/* ========================================================================= */}
      <section className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-sky-300">
        {/* Gambar Hero: Posisi object-center */}
        <Image
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=90&w=1800&auto=format&fit=crop"
          alt="Seni Bergaya Setiap Hari dengan kacamata trendi"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Gradasi lembut transparan di kiri agar teks putih selalu terbaca jelas */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-950/35 via-transparent to-transparent pointer-events-none" />

        {/* Konten Hero dalam ruang 100vh tanpa terpotong */}
        <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 flex flex-col justify-between">
          {/* Baris Atas Hero: Kiri Headline & Tombol Belanja */}
          <div className="max-w-xl text-white">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="text-xs font-normal tracking-widest uppercase text-white/90">
                MUSIM BARU / 2026
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white leading-tight mb-2 sm:mb-3 drop-shadow-xs">
              Seni Bergaya
              <br />
              Setiap Hari.
            </h1>

            <p className="text-xs sm:text-sm font-light text-white/95 leading-relaxed max-w-md mb-4 sm:mb-5 drop-shadow-xs">
              Pilihan pakaian esensial yang dirancang dengan kesederhanaan, kenyamanan, dan cita rasa modern.
            </p>

            <a
              href="#category-outerwear"
              className="group inline-flex items-center gap-2.5 bg-neutral-900 text-white hover:bg-neutral-800 transition-all px-5 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase shadow-md min-h-11 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>BELANJA KOLEKSI BARU</span>
              <div className="w-5 h-5 rounded-full bg-white text-neutral-900 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3 h-3 stroke-[2]" />
              </div>
            </a>
          </div>

          {/* Baris Bawah Hero: Kartu Keunggulan di Kanan Bawah dengan Desain Di-enhance */}
          <div className="w-full flex justify-end pt-3 sm:pt-4">
            <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-1 sm:pb-0 max-w-full sm:max-w-2xl justify-start sm:justify-end">
              {FEATURE_BENEFITS.map((item) => (
                <div
                  key={item.id}
                  className="group min-w-[155px] sm:min-w-[175px] bg-white/90 hover:bg-white backdrop-blur-md rounded-xl p-2.5 sm:p-3 shadow-md hover:shadow-lg border border-white/60 transition-all duration-300 flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                    {item.iconType === 'truck' && <Truck className="w-4 h-4 stroke-[1.5]" />}
                    {item.iconType === 'refresh' && <RotateCcw className="w-4 h-4 stroke-[1.5]" />}
                    {item.iconType === 'shield' && <ShieldCheck className="w-4 h-4 stroke-[1.5]" />}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xs font-medium text-neutral-900 truncate leading-snug">
                      {item.title}
                    </h2>
                    <p className="text-[11px] font-normal text-neutral-500 truncate leading-tight mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. KAMPANYE STREETWEAR: RUANG LEGA & ELEGAN (PADDING-Y NYAMAN)            */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white overflow-hidden border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Baris Atas Lega: Kiri Judul, Kanan Deskripsi + Tombol */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end mb-8 sm:mb-10">
            {/* Kiri: Headline Proporsional */}
            <div className="lg:col-span-7">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-neutral-900 leading-tight">
                Feel the Freedom,
                <br />
                Power, and
                <br />
                the Hustle
              </h2>
            </div>

            {/* Kanan: Deskripsi Ringkas, Tombol, dan Bintang Dekorasi */}
            <div className="lg:col-span-5 relative space-y-2.5 sm:space-y-3">
              {/* Ikon Bintang 4 Titik Halus */}
              <div className="hidden sm:block absolute -top-5 right-0 text-teal-400">
                <svg
                  className="w-5 h-5 fill-teal-400"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </div>

              <p className="text-xs sm:text-sm font-normal text-neutral-600 leading-relaxed max-w-sm">
                Di Avenue, kami merancang koleksi baju dan tas streetwear yang memadukan{' '}
                <span className="font-medium text-neutral-900">kenyamanan premium</span> dengan estetika modern sehari-hari.
              </p>

              <div>
                <a
                  href="#category-outerwear"
                  className="inline-flex items-center gap-2 bg-sky-400 hover:bg-sky-500 text-white px-4 py-2 rounded-full text-xs font-medium transition-colors shadow-2xs min-h-11"
                >
                  <span>Lihat Koleksi Baju & Tas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Galeri 3 Kartu: Baju & Tas dari Unsplash */}
          <div className="flex gap-3 sm:gap-5 overflow-x-auto pb-2 snap-x sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
            {/* Kartu 1: Baju - Hoodie & Jaket Streetwear */}
            <div className="w-[75vw] sm:w-auto shrink-0 snap-center sm:shrink relative rounded-xl sm:rounded-2xl overflow-hidden h-52 sm:h-64 lg:h-72 bg-neutral-100 group shadow-2xs border border-neutral-200/60">
              <Image
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop"
                alt="Koleksi baju hoodie dan jaket streetwear Avenue"
                fill
                className="object-cover object-center group-hover:scale-103 transition-transform duration-500"
                sizes="(max-width: 640px) 75vw, 33vw"
              />

              {/* Tag Edisi di Kanan Atas */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-neutral-900 text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full shadow-2xs">
                Koleksi Baju
              </div>

              {/* Bayangan Gradasi Bawah */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

              {/* Info Produk Bawah */}
              <div className="absolute inset-x-3 sm:inset-x-4 bottom-3 sm:bottom-4 pointer-events-none">
                <h3 className="text-sm sm:text-base font-medium text-white leading-tight drop-shadow-xs">
                  Hoodie & Jaket Streetwear
                </h3>
                <p className="text-[11px] sm:text-xs font-light text-white/85 mt-0.5">
                  Potongan santai dengan bahan katun tebal premium
                </p>
              </div>
            </div>

            {/* Kartu 2: Baju - Atasan & Kaos Esensial */}
            <div className="w-[75vw] sm:w-auto shrink-0 snap-center sm:shrink relative rounded-xl sm:rounded-2xl overflow-hidden h-52 sm:h-64 lg:h-72 bg-neutral-100 group shadow-2xs border border-neutral-200/60">
              <Image
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop"
                alt="Koleksi atasan dan kaos katun esensial Avenue"
                fill
                className="object-cover object-center group-hover:scale-103 transition-transform duration-500"
                sizes="(max-width: 640px) 75vw, 33vw"
              />

              {/* Tag Edisi di Kanan Atas */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-neutral-900 text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full shadow-2xs">
                Koleksi Baju
              </div>

              {/* Bayangan Gradasi Bawah */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

              {/* Info Produk Bawah */}
              <div className="absolute inset-x-3 sm:inset-x-4 bottom-3 sm:bottom-4 pointer-events-none">
                <h3 className="text-sm sm:text-base font-medium text-white leading-tight drop-shadow-xs">
                  Atasan & Kaos Katun
                </h3>
                <p className="text-[11px] sm:text-xs font-light text-white/85 mt-0.5">
                  Kenyamanan serat katun bernapas untuk gaya harian
                </p>
              </div>
            </div>

            {/* Kartu 3: Tas - Tas Selempang & Aksesori Kulit */}
            <div className="w-[75vw] sm:w-auto shrink-0 snap-center sm:shrink relative rounded-xl sm:rounded-2xl overflow-hidden h-52 sm:h-64 lg:h-72 bg-neutral-100 group shadow-2xs border border-neutral-200/60">
              <Image
                src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop"
                alt="Koleksi tas selempang kulit Avenue"
                fill
                className="object-cover object-center group-hover:scale-103 transition-transform duration-500"
                sizes="(max-width: 640px) 75vw, 33vw"
              />

              {/* Tag Edisi di Kanan Atas */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-neutral-900 text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full shadow-2xs">
                Koleksi Tas
              </div>

              {/* Bayangan Gradasi Bawah */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

              {/* Info Produk Bawah */}
              <div className="absolute inset-x-3 sm:inset-x-4 bottom-3 sm:bottom-4 pointer-events-none">
                <h3 className="text-sm sm:text-base font-medium text-white leading-tight drop-shadow-xs">
                  Tas Selempang & Kulit
                </h3>
                <p className="text-[11px] sm:text-xs font-light text-white/85 mt-0.5">
                  Desain kompak fungsional untuk membawa esensial Anda
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. KATALOG PRODUK: JARAK LEBIH DEKAT, HANYA JUDUL TANPA PEMBATAS          */}
      {/* ========================================================================= */}
      <div className="space-y-1 sm:space-y-2">
        {PRODUCT_CATEGORIES.map((category) => {
          const displayedProducts = category.products.filter((p) => {
            const matchesMood = !activeMood || p.moods.includes(activeMood)
            const matchesSearch =
              !searchQuery ||
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.category.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesMood && matchesSearch
          })

          return (
            <section
              key={category.id}
              id={`category-${category.id}`}
              className="py-4 sm:py-6 bg-stone-50"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Kategori: Judul Saja & Tombol Lihat Semua */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-neutral-900">
                    {category.title}
                  </h2>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveMood(null)
                      setSearchQuery('')
                      triggerToast(`Menampilkan seluruh ${category.title}`)
                    }}
                    className="inline-flex items-center justify-center bg-neutral-900 text-white hover:bg-neutral-800 transition-colors px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase min-h-11 shrink-0"
                  >
                    LIHAT SEMUA
                  </button>
                </div>

                {/* 5 Card per Baris: Foto, Title, Desc Singkat, Harga Rp */}
                {displayedProducts.length === 0 ? (
                  <div className="py-6 text-center bg-white rounded-lg border border-neutral-200 p-4">
                    <p className="text-sm font-medium text-neutral-800">
                      Tidak ada pakaian yang cocok dengan filter ini
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMood(null)
                        setSearchQuery('')
                      }}
                      className="mt-1.5 text-xs font-normal text-neutral-600 underline"
                    >
                      Hapus filter aktif
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    {displayedProducts.map((product) => {
                      const isLiked = likedProductIds.includes(product.id)
                      return (
                        <div
                          key={product.id}
                          className="flex flex-col group"
                        >
                          {/* 1. FOTO: Wadah abu-abu ber-sudut halus */}
                          <div className="relative aspect-square w-full bg-neutral-100 rounded-lg overflow-hidden mb-2 p-2 flex items-center justify-center border border-neutral-200/60">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover object-center group-hover:scale-103 transition-transform duration-300"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            />

                            {/* Tombol Favorit */}
                            <button
                              type="button"
                              onClick={() => handleToggleWishlist(product.id)}
                              aria-label={`Simpan ${product.name} ke favorit`}
                              className="absolute top-2 left-2 w-7 h-7 rounded-md bg-white/90 text-neutral-700 hover:text-rose-500 flex items-center justify-center transition-colors shadow-2xs"
                            >
                              <Heart
                                className={`w-3.5 h-3.5 stroke-[1.5] ${isLiked ? 'text-rose-500 fill-rose-500' : ''}`}
                              />
                            </button>

                            {/* Tombol Tambah ke Tas */}
                            <div className="absolute inset-x-2 bottom-2 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleAddToCart(product)}
                                className="w-full bg-neutral-900 text-white py-1.5 px-2.5 rounded-md text-xs font-normal hover:bg-neutral-800 shadow-md transition-colors flex items-center justify-center gap-1.5"
                              >
                                <ShoppingBag className="w-3 h-3 stroke-[1.5]" />
                                <span>Tambah ke Tas</span>
                              </button>
                            </div>
                          </div>

                          {/* 2. TITLE, 3. DESC SINGKAT, 4. HARGA RP */}
                          <div className="space-y-0.5 text-center">
                            {/* Judul Produk */}
                            <h3 className="text-xs sm:text-sm font-normal text-neutral-900 group-hover:text-neutral-500 transition-colors truncate">
                              {product.name}
                            </h3>

                            {/* Deskripsi Singkat */}
                            <p className="text-xs font-light text-neutral-500 line-clamp-1 leading-tight">
                              {product.description}
                            </p>

                            {/* Harga Rp */}
                            <p className="text-xs sm:text-sm font-normal text-neutral-700 pt-0.5">
                              {formatRupiah(product.price)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </section>
          )
        })}
      </div>

      {/* ========================================================================= */}
      {/* 4. PROMO KOLEKSI ESENSIAL: EDITORIAL LUXURY ARSITEKTURAL                   */}
      {/* ========================================================================= */}
      <section
        id="seasonal-favorites"
        className="relative w-full h-[580px] sm:h-[660px] lg:h-[720px] overflow-hidden bg-neutral-900 text-white flex flex-col justify-between"
      >
        {/* Foto Latar Belakang Editorial Arsitektural Mewah */}
        <Image
          src="/fashion/curated-capsule-editorial.jpg"
          alt="Koleksi busana esensial Avenue berlatar arsitektur tenang"
          fill
          unoptimized
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Lapisan Gradasi Halus untuk Kontras Tipografi dan Gambar */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent to-black/25 pointer-events-none" />

        {/* Baris Atas: Tombol Navigasi Panah Kanan Atas & Badge Edisi */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex items-center justify-between">
          {/* Badge Edisi Halus di Kiri Atas */}
          <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-light text-white border border-white/20 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>Koleksi Esensial 2026</span>
          </div>

          {/* Tombol Panah Kanan Atas Sesuai Desain Editorial */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => triggerToast('Menampilkan busana kurasi sebelumnya')}
              aria-label="Koleksi sebelumnya"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-neutral-800 backdrop-blur-md flex items-center justify-center transition-all shadow-sm cursor-pointer min-h-11 min-w-11"
            >
              <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
            </button>
            <button
              type="button"
              onClick={() => triggerToast('Menampilkan busana kurasi berikutnya')}
              aria-label="Koleksi berikutnya"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-neutral-800 backdrop-blur-md flex items-center justify-center transition-all shadow-sm cursor-pointer min-h-11 min-w-11"
            >
              <ArrowRight className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* Baris Tengah: Tipografi Raksasa Terbelah Dua (Koleksi di Kiri, Esensial di Kanan) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto pointer-events-none">
          <div className="flex flex-col sm:flex-row items-center sm:items-baseline justify-between gap-2 sm:gap-0">
            {/* Kiri: Koleksi (Tebal & Tegas) */}
            <h2 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight text-white drop-shadow-md">
              Koleksi
            </h2>

            {/* Kanan: Esensial (Light & Elegan) */}
            <h2 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tight text-white drop-shadow-md">
              Esensial
            </h2>
          </div>
        </div>

        {/* Baris Bawah: Tombol Jelajahi di Tengah & Deskripsi Nyata di Kanan Bawah */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            {/* Kiri Bawah: Indikator Penawaran Terbatas Ramping */}
            <div className="hidden md:block md:col-span-3">
              <div className="inline-flex items-center gap-2 bg-black/35 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-light text-white/95 border border-white/20 shadow-sm">
                <span>Penawaran Khusus:</span>
                <span className="font-medium text-white tabular-nums">
                  {timeLeft.days}h {timeLeft.hours}j {timeLeft.minutes}m
                </span>
              </div>
            </div>

            {/* Tengah Bawah: Tombol Pil Bersih 'Lihat Koleksi Esensial' */}
            <div className="md:col-span-6 flex justify-center">
              <a
                href="#category-outerwear"
                className="inline-flex items-center justify-center bg-white hover:bg-neutral-100 text-neutral-900 font-medium px-8 py-3.5 rounded-full text-xs sm:text-sm tracking-wide shadow-xl hover:shadow-2xl transition-all cursor-pointer min-h-11"
              >
                Lihat Koleksi Esensial
              </a>
            </div>

            {/* Kanan Bawah: Teks Paragraf Spesifik & Nyata (Bebas Kata Musiman & Klise) */}
            <div className="md:col-span-3 text-center md:text-right">
              <p className="text-xs sm:text-sm font-normal text-white/95 leading-relaxed drop-shadow-md">
                Potongan busana bergaris tegas dengan bahan wol murni dan katun pilihan.
                Dirancang untuk keleluasaan gerak tubuh dan ketahanan harian.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* ========================================================================= */}
      {/* 6. FOOTER RESMI AVENUE                                                    */}
      {/* ========================================================================= */}
      <footer className="bg-neutral-900 text-white pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-neutral-800">
            {/* Kolom Brand */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
                </svg>
                <span className="text-xl font-medium tracking-tight">Avenue</span>
              </div>
              <p className="text-xs sm:text-sm font-normal text-neutral-400 max-w-sm leading-relaxed">
                Pakaian esensial berkualitas tinggi untuk gaya hidup penuh kenyamanan dan ketenangan.
                Dibuat dengan siluet abadi dan bahan pilihan yang tahan lama.
              </p>
            </div>

            {/* Kolom Kategori */}
            <div className="md:col-span-3 space-y-2">
              <h3 className="text-xs font-normal tracking-wider uppercase text-neutral-300">
                Koleksi Pilihan
              </h3>
              <ul className="space-y-1.5 text-xs font-normal text-neutral-400">
                {PRODUCT_CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <a
                      href={`#category-${cat.id}`}
                      className="hover:text-white transition-colors"
                    >
                      {cat.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolom Newsletter */}
            <div className="md:col-span-4 space-y-2.5">
              <h3 className="text-xs font-normal tracking-wider uppercase text-neutral-300">
                Kabar Koleksi Baru
              </h3>
              <p className="text-xs font-normal text-neutral-400">
                Dapatkan info awal perilisan koleksi musiman dan pratinjau eksklusif.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  triggerToast('Terima kasih telah bergabung dengan pembaruan Avenue.')
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  required
                  placeholder="Masukkan alamat email"
                  className="bg-neutral-800 text-white text-xs px-3.5 py-2 rounded-md flex-1 outline-none border border-neutral-700 focus:border-neutral-500 font-normal"
                />
                <button
                  type="submit"
                  className="bg-white text-neutral-900 text-xs font-medium uppercase tracking-wider px-3.5 py-2 rounded-md hover:bg-neutral-200 transition-colors min-h-11"
                >
                  Daftar
                </button>
              </form>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-normal text-neutral-500 gap-3">
            <p>© 2026 Avenue Studio. Hak cipta dilindungi.</p>
            <div className="flex items-center gap-5">
              <Link href="/fashion" className="hover:text-neutral-400">
                Kebijakan Privasi
              </Link>
              <Link href="/fashion" className="hover:text-neutral-400">
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 7. LACI KERANJANG SLIDE-OVER                                              */}
      {/* ========================================================================= */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setCartDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              {/* Header Laci */}
              <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-neutral-900 stroke-[1.5]" />
                  <h2 className="text-base font-medium text-neutral-900">
                    Tas Belanja ({totalCartCount})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setCartDrawerOpen(false)}
                  aria-label="Tutup tas belanja"
                  className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-md min-h-11 min-w-11 flex items-center justify-center"
                >
                  <X className="w-4 h-4 stroke-[1.5]" />
                </button>
              </div>

              {/* Daftar Produk di Tas */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10">
                    <ShoppingBag className="w-10 h-10 text-neutral-300 mb-2 stroke-[1]" />
                    <p className="text-sm font-medium text-neutral-800">Tas belanja Anda masih kosong</p>
                    <p className="text-xs font-normal text-neutral-500 mt-1">
                      Jelajahi koleksi kami dan temukan busana esensial pilihan Anda.
                    </p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3 p-2.5 bg-neutral-50 rounded-lg border border-neutral-200/70"
                    >
                      <div className="relative w-16 h-20 rounded-md bg-neutral-200 overflow-hidden shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1.5">
                            <h3 className="text-xs font-medium text-neutral-900 truncate">
                              {item.product.name}
                            </h3>
                            <button
                              type="button"
                              onClick={() => handleRemoveFromCart(item.product.id)}
                              aria-label="Hapus produk"
                              className="text-neutral-400 hover:text-neutral-700"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs font-normal text-neutral-500">{item.product.category}</p>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs font-normal text-neutral-500">Jumlah: {item.quantity}</span>
                          <span className="text-xs font-medium text-neutral-900">
                            {formatRupiah(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Bagian Bawah Laci */}
              {cartItems.length > 0 && (
                <div className="p-4 border-t border-neutral-200 bg-neutral-50 space-y-3">
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-neutral-500 font-normal">
                      <span>Subtotal</span>
                      <span className="font-medium text-neutral-900 text-sm">
                        {formatRupiah(cartSubtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-neutral-500 font-normal">
                      <span>Ongkos Kirim</span>
                      <span className="text-emerald-600 font-medium">Gratis</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      triggerToast('Melanjutkan ke halaman pembayaran.')
                    }}
                    className="w-full bg-neutral-900 text-white hover:bg-neutral-800 transition-colors py-3 px-4 rounded-md text-xs font-medium uppercase tracking-wider min-h-11 shadow-xs flex items-center justify-center gap-2"
                  >
                    <span>Lanjut ke Pembayaran</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
