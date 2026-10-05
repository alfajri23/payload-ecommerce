'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Calendar,
  User,
  Phone,
  MessageSquare,
  ArrowUpRight,
  Menu,
  X,
  Heart,
  Star,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Send,
  Activity,
} from 'lucide-react'
import {
  TREATMENTS,
  PRICING_PLANS,
  TESTIMONIALS,
  SPA_GALLERY_IMAGES,
  Treatment,
} from './salon-data'

export function SalonPageClient() {
  // State navigasi mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // State keanggotaan: bulanan atau tahunan
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  // State booking form
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string>(TREATMENTS[0].id)
  const [fullName, setFullName] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('14:00')
  const [notes, setNotes] = useState('')
  const [bookingSubmitted, setBookingSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<{
    name: string
    service: string
    date: string
    time: string
    whatsapp: string
  } | null>(null)

  // Scroll halus ke target id
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Pilih treatment dan scroll ke form booking
  const handleSelectTreatmentForBooking = (treatment: Treatment) => {
    setSelectedTreatmentId(treatment.id)
    scrollToSection('booking')
  }

  // Submit booking form
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !whatsappNumber.trim()) {
      alert('Mohon lengkapi nama lengkap dan nomor WhatsApp Anda.')
      return
    }

    const selectedTreatment = TREATMENTS.find((t) => t.id === selectedTreatmentId) || TREATMENTS[0]
    const details = {
      name: fullName,
      service: selectedTreatment.name,
      date: bookingDate || 'Segera / Hari Ini',
      time: bookingTime,
      whatsapp: whatsappNumber,
    }

    setSubmittedData(details)
    setBookingSubmitted(true)

    // Buat URL WhatsApp langsung untuk konfirmasi
    const message = encodeURIComponent(
      `Halo Wellnest Spa, saya ingin reservasi sesi perawatan:\n\n` +
        `• Nama: ${details.name}\n` +
        `• Layanan: ${details.service}\n` +
        `• Tanggal: ${details.date}\n` +
        `• Waktu: ${details.time}\n` +
        `• No. Kontak: ${details.whatsapp}\n` +
        (notes ? `• Catatan: ${notes}\n\n` : '\n') +
        `Mohon konfirmasi ketersediaan jadwal terapis. Terima kasih!`,
    )
    const waUrl = `https://wa.me/6281234567890?text=${message}`

    // Buka WhatsApp di tab baru secara ramah
    window.open(waUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#241C17] font-sans antialiased selection:bg-[#9B6846] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. NAVBAR SPA ELEGAN (WELLNEST)                                           */}
      {/* ========================================================================= */}
      <nav
        aria-label="Navigasi Utama Wellnest"
        className="sticky top-0 z-50 w-full bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#EAE3D9] transition-all"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#9B6846] flex items-center justify-center text-[#FBF9F5] shadow-xs">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#241C17]">
                Wellnest
              </span>
            </div>

            {/* Menu Desktop Bahasa Indonesia */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5F534B]">
              <button
                type="button"
                onClick={() => scrollToSection('treatments')}
                className="hover:text-[#9B6846] transition-colors cursor-pointer"
              >
                Layanan Pijat
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('membership')}
                className="hover:text-[#9B6846] transition-colors cursor-pointer"
              >
                Keanggotaan
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('testimonials')}
                className="hover:text-[#9B6846] transition-colors cursor-pointer"
              >
                Ulasan Klien
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('booking')}
                className="hover:text-[#9B6846] transition-colors cursor-pointer"
              >
                Reservasi Sesi
              </button>
              <Link
                href="/"
                className="text-xs uppercase tracking-wider text-[#9B6846] hover:underline"
              >
                ← Kembali ke Bakery
              </Link>
            </div>

            {/* CTA Reservasi Sesi Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <button
                type="button"
                onClick={() => scrollToSection('booking')}
                className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#241C17] text-[#FBF9F5] hover:bg-[#9B6846] transition-all duration-300 shadow-sm cursor-pointer"
              >
                <span>Reservasi Sesi</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Buka menu navigasi"
                className="p-2 rounded-xl border border-[#EAE3D9] text-[#241C17] hover:bg-[#F3EDE2] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#EAE3D9] bg-[#FBF9F5] px-4 pt-3 pb-6 space-y-3">
            <button
              type="button"
              onClick={() => scrollToSection('treatments')}
              className="block w-full text-left py-2 text-sm font-medium text-[#241C17] hover:text-[#9B6846]"
            >
              Daftar Layanan & Harga
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('membership')}
              className="block w-full text-left py-2 text-sm font-medium text-[#241C17] hover:text-[#9B6846]"
            >
              Paket Keanggotaan
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('testimonials')}
              className="block w-full text-left py-2 text-sm font-medium text-[#241C17] hover:text-[#9B6846]"
            >
              Ulasan Klien
            </button>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => scrollToSection('booking')}
                className="w-full py-3 rounded-full text-center text-xs font-semibold uppercase tracking-wider bg-[#9B6846] text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Reservasi Sesi Sekarang</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            <div className="pt-2 text-center">
              <Link href="/" className="text-xs text-[#9B6846] underline">
                ← Kembali ke Halaman Toko Roti (The Bakery)
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION — 70VH MOBILE, OBJECT-RIGHT COVER & BREATHING PADDING     */}
      {/* ========================================================================= */}
      <section className="relative w-full h-[70vh] sm:h-auto sm:min-h-[calc(100vh-5rem)] flex flex-col justify-between text-white overflow-hidden">
        {/* Background Image High Res: Aligned object-right on mobile so the spa therapy focal point is visible */}
        <Image
          src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2000&auto=format&fit=crop"
          alt="Perawatan Pijat Terapeutik dan Spa Wellness"
          fill
          priority
          className="object-cover object-right sm:object-center"
          sizes="100vw"
        />

        {/* Gradient Scrim: Atas transparan agar foto terlihat jelas di kanan, bawah pekat untuk teks */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 via-50% to-transparent sm:bg-gradient-to-r sm:from-black/85 sm:via-black/60 sm:to-black/35" />

        {/* Konten Hero: Tag di Atas, Judul & CTA Berada di Bawah dengan Padding Lapang */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-10 lg:py-14 flex-1 flex flex-col justify-between">
          {/* Baris Atas Hero: Mini Tag Identitas */}
          <div className="flex items-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium tracking-wide bg-black/40 sm:bg-white/15 backdrop-blur-md border border-white/20 text-[#FAF5EF] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F7D4AA]" />
              Sanctuary Pijat Terapeutik
            </span>
          </div>

          {/* Bagian Bawah Hero: Headline, Subtitle, & CTA Ditautkan di Bawah dengan Jarak Nyaman */}
          <div className="max-w-2xl mt-auto mb-4 sm:my-auto sm:py-8 lg:py-10">
            {/* Title dengan standard Tailwind class (text-4xl di mobile agar lebih besar dan tegas) */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.12] tracking-tight text-white mb-3 sm:mb-5 pb-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              Redakan Pegal & Lelah.{' '}
              <span className="italic font-serif text-[#F7D4AA] block sm:inline drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                Pulihkan Tubuh Anda.
              </span>
            </h1>

            {/* Subtitle dengan padding bawah proporsional */}
            <p className="text-xs sm:text-base text-stone-100 leading-relaxed font-normal mb-4 sm:mb-8 pb-1 max-w-lg drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
              Pijat terarah oleh terapis bersertifikasi untuk melepas otot kaku dan mengembalikan kesegaran tubuh.
            </p>

            {/* Action Buttons: Dilengkapi padding bawah agar tidak mepet ke divider */}
            <div className="grid grid-cols-2 sm:flex sm:flex-row items-center gap-2.5 sm:gap-4 max-w-md sm:max-w-none pb-2 sm:pb-0">
              <button
                type="button"
                onClick={() => scrollToSection('booking')}
                className="px-4 sm:px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-[#241C17] hover:bg-[#F7D4AA] hover:text-[#1F1713] transition-all duration-300 shadow-xl text-center cursor-pointer min-h-[44px] flex items-center justify-center active:scale-[0.98]"
              >
                Reservasi Sesi
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('treatments')}
                className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/30 transition-all duration-300 text-center cursor-pointer min-h-[44px] active:scale-[0.98] shadow-lg"
              >
                <span>Lihat Layanan</span>
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>

          {/* Baris Bawah Hero: Social Proof Rating & Mini Floating Card */}
          <div className="pt-3 sm:pt-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-6 border-t border-white/20 w-full">
            {/* Rating & Social Proof: Baris Kompak di Mobile */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex flex-row sm:flex-col items-center sm:items-start gap-2 sm:gap-1">
                <div className="flex items-center gap-1 text-[#F7D4AA]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" />
                  ))}
                  <span className="text-xs font-bold text-white ml-1">4.9 / 5</span>
                </div>
                <span className="text-stone-400 text-xs sm:hidden">•</span>
                <p className="text-xs text-stone-200">
                  15rb+ ulasan pelanggan terverifikasi
                </p>
              </div>
            </div>

            {/* Floating Experience Card: Soft Champagne Gold yang Elegan & Mewah */}
            <div className="bg-gradient-to-br from-[#F6E7D5] via-[#EED7C0] to-[#E4C5A5] text-[#241C17] border border-[#D9B58F] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 w-full sm:max-w-sm flex items-center gap-3 shadow-2xl ring-1 ring-white/30">
              <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-lg sm:rounded-xl overflow-hidden shrink-0 border border-[#CFA67D]/60 shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=300&auto=format&fit=crop"
                  alt="Pengalaman Relaksasi"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 44px, 52px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A542D] flex items-center gap-1.5 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A542D]" />
                  Fasilitas Unggulan
                </span>
                <p className="text-xs text-[#241C17] font-semibold leading-snug line-clamp-1 sm:line-clamp-2">
                  Ruang privat tenang dengan aromaterapi alami.
                </p>
              </div>
              <button
                type="button"
                onClick={() => scrollToSection('treatments')}
                aria-label="Lihat fasilitas selengkapnya"
                className="w-8 h-8 rounded-full bg-[#241C17] hover:bg-[#8A542D] text-[#FAF5EF] flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-md active:scale-95"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. DAFTAR LAYANAN & HARGA (SESUAI REFERENSI GAMBAR)                        */}
      {/* ========================================================================= */}
      <section id="treatments" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9B6846] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9B6846]" />
                Layanan Pijat
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#241C17] leading-tight">
                Pilihan <span className="italic text-[#9B6846]">Perawatan Tubuh</span>
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-sm text-[#6C6057] leading-relaxed mb-4">
                Pijatan terarah sesuai titik pegal dan kebutuhan relaksasi Anda.
              </p>
              <button
                type="button"
                onClick={() => scrollToSection('booking')}
                className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#241C17] hover:text-[#9B6846] transition-colors cursor-pointer"
              >
                <span>Reservasi Sekarang</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>

          {/* Grid 3 Card Treatments Sesuai Desain Referensi Asli (Non-Slop, Designer-Crafted) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {TREATMENTS.slice(0, 3).map((treatment, idx) => {
              const isFeatured = treatment.featured

              if (isFeatured) {
                // Card 2: Full-Bleed Editorial Photo Card (Sesuai Referensi Gambar Tengah)
                return (
                  <div
                    key={treatment.id}
                    className="relative rounded-[32px] overflow-hidden text-white p-7 sm:p-8 flex flex-col justify-between shadow-2xl min-h-[460px] group transition-all duration-500 hover:-translate-y-1.5"
                  >
                    {/* Background Image Full-Bleed yang Mengisi Seluruh Kartu */}
                    <Image
                      src={treatment.image}
                      alt={treatment.name}
                      fill
                      priority
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 420px"
                    />

                    {/* Gradient Scrim Gelap: Atas & Bawah Pekat untuk Keterbacaan Sempurna (WCAG AAA) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 via-45% to-black/80" />

                    {/* Konten Atas: Icon, Badge, Judul, & Detail */}
                    <div className="relative z-10">
                      {/* Top Row: Heart Icon & Badge Paling Diminati */}
                      <div className="flex items-center justify-between mb-5">
                        <span className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-[#F7D4AA] flex items-center justify-center shadow-sm">
                          <Heart className="w-4 h-4 fill-[#F7D4AA]" />
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-[#F7D4AA] text-[#241C17] shadow-md">
                          {treatment.popularBadge || 'Paling Diminati'}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white mb-2 leading-snug drop-shadow-md">
                        {treatment.name}
                      </h3>
                      <p className="text-xs text-stone-200 leading-relaxed max-w-[280px] drop-shadow-sm mb-5">
                        {treatment.description}
                      </p>

                      {/* Durasi & Harga */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/20">
                        <div className="flex items-center gap-1.5 text-xs text-stone-200">
                          <Clock className="w-3.5 h-3.5 text-[#F7D4AA]" />
                          <span>{treatment.duration}</span>
                        </div>
                        <div className="font-sans text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                          {treatment.priceFormatted}
                        </div>
                      </div>
                    </div>

                    {/* Konten Bawah: Tombol Reservasi Lebar di Atas Foto */}
                    <div className="relative z-10 pt-6">
                      <button
                        type="button"
                        onClick={() => handleSelectTreatmentForBooking(treatment)}
                        className="w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-[#241C17] hover:bg-[#F7D4AA] hover:text-[#1F1713] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl min-h-[44px] active:scale-[0.98]"
                      >
                        <span>Pilih Layanan Ini</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              }

              // Card 1 & 3: Light Organic Aesthetic dengan Pebble Cutout di Pojok Kanan Bawah
              return (
                <div
                  key={treatment.id}
                  className="relative rounded-[32px] bg-white border border-[#EAE3D9] p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-500 group hover:-translate-y-1.5 min-h-[440px] overflow-hidden"
                >
                  {/* Konten Atas */}
                  <div>
                    {/* Top Row: Icon Bulat & Kategori */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="w-10 h-10 rounded-full bg-[#F5EFE6] text-[#9B6846] flex items-center justify-center border border-[#EBE1D3]">
                        {idx === 0 ? (
                          <Activity className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </span>
                      <span className="text-xs text-[#82756C] uppercase tracking-wider font-semibold">
                        {treatment.category}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-serif text-2xl font-normal text-[#241C17] mb-2 leading-snug group-hover:text-[#9B6846] transition-colors">
                      {treatment.name}
                    </h3>
                    <p className="text-xs text-[#6C6057] leading-relaxed max-w-[260px] mb-5">
                      {treatment.description}
                    </p>

                    {/* Durasi & Harga */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#F0EBE3]">
                      <div className="flex items-center gap-1.5 text-xs text-[#82756C]">
                        <Clock className="w-3.5 h-3.5 text-[#9B6846]" />
                        <span>{treatment.duration}</span>
                      </div>
                      <div className="font-sans text-xl font-bold tracking-tight text-[#241C17]">
                        {treatment.priceFormatted}
                      </div>
                    </div>
                  </div>

                  {/* Konten Bawah: Tombol Pill di Kiri & Pebble Organic Image di Pojok Kanan Bawah */}
                  <div className="relative pt-8 flex items-end justify-between min-h-[110px]">
                    {/* Compact Pill Button Sesuai Referensi Gambar */}
                    <button
                      type="button"
                      onClick={() => handleSelectTreatmentForBooking(treatment)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#241C17] text-white hover:bg-[#9B6846] transition-colors cursor-pointer shadow-sm min-h-[42px] z-10 active:scale-95"
                    >
                      <span>Pilih Layanan</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Pebble Arch Cutout Image Sesuai Referensi Gambar Asli */}
                    <div className="absolute -bottom-8 -right-8 w-36 h-36 sm:w-40 sm:h-40 rounded-tl-[48px] rounded-br-[28px] overflow-hidden border-4 border-[#FAF5EF] shadow-md bg-[#F3EDE2]">
                      <Image
                        src={treatment.image}
                        alt={treatment.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 160px, 180px"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Carousel / Pagination Dots Sesuai Referensi Gambar */}
          <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
            <span className="w-2 h-2 rounded-full bg-[#D5C7B7]" />
            <span className="w-6 h-2 rounded-full bg-[#9B6846]" />
            <span className="w-2 h-2 rounded-full bg-[#D5C7B7]" />
            <span className="w-2 h-2 rounded-full bg-[#D5C7B7]" />
          </div>

          {/* Menu Layanan Tambahan (Format Daftar Menu Klasik & Hierarki Halus) */}
          <div className="mt-12 sm:mt-14 pt-8 border-t border-[#EAE3D9]">
            {/* Header Sub-section dengan Hierarki Proporsional */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 mb-4 sm:mb-5">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9B6846]">
                  Layanan Lainnya
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-normal text-[#241C17] mt-0.5">
                  Pilihan Perawatan Pelengkap
                </h3>
              </div>
              <span className="text-xs text-[#82756C]">Klik baris untuk reservasi</span>
            </div>

            {/* List Menu Klasik dengan Tipografi Kecil & Hierarki Jelas */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-[#EAE3D9] divide-y divide-[#EAE3D9] shadow-2xs overflow-hidden">
              {TREATMENTS.slice(3).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTreatmentForBooking(item)}
                  className="w-full text-left px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3 sm:gap-4 group hover:bg-[#FAF6F0] transition-colors cursor-pointer focus:outline-hidden focus:bg-[#FAF6F0]"
                >
                  {/* Judul & Durasi (Hierarki Utama vs Sekunder) */}
                  <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D5C7B7] group-hover:bg-[#9B6846] transition-colors" />
                    <h4 className="font-serif text-sm sm:text-base font-normal text-[#241C17] group-hover:text-[#9B6846] transition-colors leading-snug">
                      {item.name}
                    </h4>
                    <span className="text-[11px] text-[#82756C] bg-[#F5EFE6] px-2 py-0.5 rounded-md font-medium">
                      {item.duration}
                    </span>
                  </div>

                  {/* Garis Titik Halus (Dotted Leader) */}
                  <div className="flex-1 border-b border-dotted border-[#D5C7B7]/60 mx-3 sm:mx-5 hidden sm:block" />

                  {/* Harga & Panah Pemilihan Ringkas */}
                  <div className="flex items-center gap-2.5 sm:gap-4 shrink-0 ml-auto sm:ml-0">
                    <span className="font-sans text-sm sm:text-base font-bold tracking-tight text-[#241C17]">
                      {item.priceFormatted}
                    </span>
                    <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#F5EFE6] text-[#241C17] group-hover:bg-[#241C17] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PAKET KEANGGOTAAN (WELLNESS THAT FITS YOUR LIFESTYLE)                   */}
      {/* ========================================================================= */}
      <section id="membership" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#F5EFE6]/60">
        <div className="max-w-7xl mx-auto">
          {/* Header & Subtitle */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9B6846] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9B6846]" />
              Paket Member
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#241C17] mb-3">
              Hemat untuk <span className="italic text-[#9B6846]">Perawatan Rutin</span>
            </h2>
            <p className="text-sm text-[#6C6057] leading-relaxed">
              Pilihan paket bulanan untuk menjaga tubuh tetap bugar dengan tarif lebih hemat.
            </p>

            {/* Toggle Bulanan vs Tahunan Switch */}
            <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-full bg-[#EAE2D5] border border-[#DDD4C4]">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-[#241C17] shadow-xs'
                    : 'text-[#6C6057] hover:text-[#241C17]'
                }`}
              >
                Bulanan
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-[#9B6846] text-white shadow-xs'
                    : 'text-[#6C6057] hover:text-[#241C17]'
                }`}
              >
                <span>Tahunan</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">Hemat 15%</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {PRICING_PLANS.map((plan) => {
              const priceDisplay =
                billingCycle === 'monthly' ? plan.monthlyPriceFormatted : plan.yearlyPriceFormatted

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-[30px] p-7 sm:p-9 flex flex-col justify-between transition-all duration-300 ${
                    plan.isPopular
                      ? 'bg-white border-2 border-[#9B6846] shadow-xl sm:-translate-y-2'
                      : 'bg-[#FAF7F2] border border-[#E2DAD0] shadow-xs hover:shadow-md'
                  }`}
                >
                  {/* Badge Paling Populer */}
                  {plan.isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#9B6846] text-white shadow-sm">
                      Paling Populer
                    </div>
                  )}

                  <div>
                    <h3 className="font-serif text-2xl font-normal text-[#241C17] mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-[#7A6E65] mb-6">{plan.subtitle}</p>

                    {/* Harga dengan Font Biasa Sans-Serif Sesuai antislop-ui */}
                    <div className="mb-6 pb-6 border-b border-[#EAE3D9]">
                      <div className="flex items-baseline gap-1">
                        <span className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-[#241C17]">
                          {priceDisplay}
                        </span>
                        <span className="text-xs text-[#7A6E65]">/ bulan</span>
                      </div>
                      {billingCycle === 'yearly' && (
                        <p className="text-[11px] text-[#9B6846] mt-1 font-medium">
                          Ditagih tahunan (Hemat 2 bulan gratis)
                        </p>
                      )}
                    </div>

                    {/* Daftar Manfaat */}
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-[#524740]">
                          <CheckCircle2 className="w-4 h-4 text-[#9B6846] shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tombol Pilih Paket */}
                  <button
                    type="button"
                    onClick={() => {
                      scrollToSection('booking')
                      setNotes(`Tertarik dengan paket membership: ${plan.name} (${billingCycle})`)
                    }}
                    className={`w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer min-h-[44px] ${
                      plan.isPopular
                        ? 'bg-[#9B6846] hover:bg-[#855535] text-white shadow-sm'
                        : 'bg-white border border-[#D5CABE] text-[#241C17] hover:bg-[#241C17] hover:text-white'
                    }`}
                  >
                    Pilih Paket
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ULASAN PELANGGAN & GALERI SPA                                          */}
      {/* ========================================================================= */}
      <section id="testimonials" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9B6846] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9B6846]" />
              Ulasan Klien
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#241C17] leading-tight">
              Kata Mereka yang <span className="italic text-[#9B6846]">Sudah Mencoba</span>
            </h2>
            <p className="text-sm text-[#6C6057] mt-2">
              Cerita nyata pelanggan tentang kualitas pijatan dan kenyamanan ruangan.
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-7 sm:p-8 border border-[#EAE3D9] flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl text-[#9B6846] font-serif leading-none">&ldquo;</span>
                    <div className="flex items-center gap-1 text-[#E5B589]">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#524740] leading-relaxed mb-6 italic">
                    {item.quote}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F0EBE3] flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#EAE3D9]">
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#241C17]">{item.name}</h4>
                    <p className="text-[11px] text-[#82756C]">{item.role}</p>
                    <span className="text-[10px] text-[#9B6846] font-medium block">
                      {item.serviceUsed}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Galeri Cuplikan Suasana */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {SPA_GALLERY_IMAGES.map((img, i) => (
              <div
                key={i}
                className="group relative h-44 sm:h-52 rounded-2xl overflow-hidden border border-[#EAE3D9] shadow-2xs"
              >
                <Image
                  src={img.url}
                  alt={img.caption}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 text-white text-[11px]">
                  <span>{img.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FORM RESERVASI INTERAKTIF (MULAI PERJALANAN RELAKSASI ANDA)            */}
      {/* ========================================================================= */}
      <section id="booking" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#F4EDE3]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Sisi Kiri: Informasi Janji Temu */}
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9B6846]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9B6846]" />
                Jadwal Kunjungan
              </span>
              <h2 className="font-serif text-3.5xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#241C17] leading-tight">
                Reservasi <span className="italic text-[#9B6846]">Sesi Anda</span>
              </h2>
              <p className="text-sm text-[#6C6057] leading-relaxed">
                Pilih layanan dan waktu yang cocok. Kami siapkan ruangan dan terapis untuk Anda.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3.5 text-xs text-[#524740]">
                  <div className="w-8 h-8 rounded-full bg-white text-[#9B6846] flex items-center justify-center shrink-0 shadow-2xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#241C17]">Terapis Berpengalaman</h4>
                    <p className="text-[#7A6E65] mt-0.5">
                      Terlatih dalam teknik anatomi dan pelepasan otot kaku.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-xs text-[#524740]">
                  <div className="w-8 h-8 rounded-full bg-white text-[#9B6846] flex items-center justify-center shrink-0 shadow-2xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#241C17]">Kamar Privat & Bersih</h4>
                    <p className="text-[#7A6E65] mt-0.5">
                      Ruang perawatan tenang dengan aromaterapi alami dan higienis.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sisi Kanan: Form Reservasi Interaktif */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-[#E4DCD0]">
                {bookingSubmitted && submittedData ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#EBF5ED] text-[#2A7E3B] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[#241C17]">
                      Reservasi Berhasil Diajukan!
                    </h3>
                    <p className="text-xs text-[#6C6057] max-w-md mx-auto leading-relaxed">
                      Terima kasih <span className="font-semibold text-[#241C17]">{submittedData.name}</span>.
                      Rincian reservasi untuk <span className="font-semibold">{submittedData.service}</span> pada{' '}
                      <span className="font-semibold">{submittedData.date} ({submittedData.time})</span> sedang diproses
                      oleh staf kami melalui WhatsApp.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setBookingSubmitted(false)}
                        className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#D5CABE] text-[#241C17] hover:bg-[#F8F5EE] transition-colors cursor-pointer"
                      >
                        Buat Reservasi Lain
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Nama Lengkap */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#423730] flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#9B6846]" />
                          Nama Lengkap *
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Nama Anda"
                          className="w-full px-4 py-3 rounded-xl border border-[#D9D1C5] bg-[#FAF8F5] text-xs text-[#241C17] placeholder:text-[#A09489] focus:outline-none focus:ring-2 focus:ring-[#9B6846] focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Nomor WhatsApp */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#423730] flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#9B6846]" />
                          Nomor WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value)}
                          placeholder="0812-xxxx-xxxx"
                          className="w-full px-4 py-3 rounded-xl border border-[#D9D1C5] bg-[#FAF8F5] text-xs text-[#241C17] placeholder:text-[#A09489] focus:outline-none focus:ring-2 focus:ring-[#9B6846] focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Pilihan Layanan */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#423730] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#9B6846]" />
                          Pilihan Layanan
                        </label>
                        <select
                          value={selectedTreatmentId}
                          onChange={(e) => setSelectedTreatmentId(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-[#D9D1C5] bg-[#FAF8F5] text-xs text-[#241C17] focus:outline-none focus:ring-2 focus:ring-[#9B6846] focus:border-transparent transition-all cursor-pointer"
                        >
                          {TREATMENTS.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.duration} - {t.priceFormatted})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Pilihan Tanggal */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#423730] flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#9B6846]" />
                          Tanggal Kunjungan
                        </label>
                        <input
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-[#D9D1C5] bg-[#FAF8F5] text-xs text-[#241C17] focus:outline-none focus:ring-2 focus:ring-[#9B6846] focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Pilihan Jam Sesi */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#423730] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#9B6846]" />
                        Pilihan Jam Sesi
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {['10:00', '13:00', '16:00', '19:00'].map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setBookingTime(time)}
                            className={`py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                              bookingTime === time
                                ? 'bg-[#241C17] text-white border-[#241C17]'
                                : 'bg-[#FAF8F5] border-[#D9D1C5] text-[#524740] hover:border-[#9B6846]'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Catatan Tambahan */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#423730] flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#9B6846]" />
                        Catatan Khusus (Opsional)
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Contoh: Fokus punggung atas, tekanan sedang"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#D9D1C5] bg-[#FAF8F5] text-xs text-[#241C17] placeholder:text-[#A09489] focus:outline-none focus:ring-2 focus:ring-[#9B6846] focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    {/* Tombol Submit Reservasi */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-4 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#9B6846] hover:bg-[#855535] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                      >
                        <Send className="w-4 h-4" />
                        <span>Kirim Jadwal via WhatsApp</span>
                      </button>
                      <p className="text-[11px] text-center text-[#82756C] mt-2">
                        Resepsionis kami akan langsung mengonfirmasi ketersediaan jadwal Anda.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FOOTER MEWAH WELLNEST BAHASA INDONESIA                                 */}
      {/* ========================================================================= */}
      <footer className="w-full bg-[#1F1713] text-[#FAF5EF] pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-t border-[#332720]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            {/* Kolom 1: Brand & Filosofi */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#9B6846] flex items-center justify-center text-[#FAF5EF]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  Wellnest
                </span>
              </div>
              <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
                Sanctuary perawatan tubuh dan pikiran yang menghadirkan teknik pemulihan holistik,
                minyak aromaterapi alami murni, dan kehangatan pelayanan terapis berlisensi.
              </p>
              <div className="text-xs text-stone-400 space-y-1 pt-1">
                <p>📍 Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan</p>
                <p>📞 +62 812-3456-7890 • Jam Operasional: 10:00 - 21:00 WIB</p>
              </div>
            </div>

            {/* Kolom 2: Navigasi Cepat */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#E9C39B]">
                Navigasi Layanan
              </h4>
              <ul className="space-y-2 text-xs text-stone-300">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('treatments')}
                    className="hover:text-[#E9C39B] transition-colors cursor-pointer"
                  >
                    Daftar Treatment & Harga
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('membership')}
                    className="hover:text-[#E9C39B] transition-colors cursor-pointer"
                  >
                    Paket Keanggotaan Bulanan
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('testimonials')}
                    className="hover:text-[#E9C39B] transition-colors cursor-pointer"
                  >
                    Ulasan Klien Terverifikasi
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('booking')}
                    className="hover:text-[#E9C39B] transition-colors cursor-pointer"
                  >
                    Formulir Reservasi Sesi
                  </button>
                </li>
              </ul>
            </div>

            {/* Kolom 3: Demo Switcher Info */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#E9C39B]">
                Mode Showcase
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Halaman ini adalah demo template khusus kategori Salon, Spa, & Wellness.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-[#E9C39B] hover:underline pt-2 font-medium"
              >
                <span>Beralih ke Template Toko Roti</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Baris Bawah Hak Cipta */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            <p>&copy; {new Date().getFullYear()} Wellnest Wellness & Spa. Hak cipta dilindungi.</p>
            <p className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9B6846]" />
              <span>Dibuat untuk Kemewahan Organik & Kebugaran Holistik</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
