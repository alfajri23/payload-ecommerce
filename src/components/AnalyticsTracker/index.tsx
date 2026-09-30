'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function TrackerContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Dapatkan atau buat Session ID anonim
    let sessionId = sessionStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36)
      sessionStorage.setItem('analytics_session_id', sessionId)
    }

    // 2. Cek parameter ref di URL
    const refParam = searchParams.get('ref') || searchParams.get('utm_source')
    const lastTrackedRef = sessionStorage.getItem('analytics_last_tracked_ref')
    const isAlreadyTracked = sessionStorage.getItem('analytics_tracked') === 'true'

    // Pilihan 1: Hanya kirim jika sesi baru ATAU ada ref baru yang berbeda
    const isNewRef = Boolean(refParam && refParam !== lastTrackedRef)
    const shouldTrack = !isAlreadyTracked || isNewRef

    if (!shouldTrack) {
      return
    }

    // 3. Tentukan nilai referrer
    let referrer = refParam
    if (!referrer && typeof document !== 'undefined' && document.referrer) {
      try {
        referrer = new URL(document.referrer).hostname
      } catch {
        referrer = document.referrer
      }
    }
    if (!referrer) {
      referrer = 'Direct'
    }

    // 4. Kirim data analitik di latar belakang (sendBeacon / fetch keepalive)
    const payloadData = JSON.stringify({
      path: pathname,
      referrer,
      sessionId,
    })

    if (navigator.sendBeacon) {
      const blob = new Blob([payloadData], { type: 'application/json' })
      navigator.sendBeacon('/api/track', blob)
    } else {
      void fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payloadData,
        keepalive: true,
      })
    }

    // 5. Tandai bahwa sesi ini sudah tercatat agar tidak mencatat ulang setiap klik navigasi
    sessionStorage.setItem('analytics_tracked', 'true')
    if (refParam) {
      sessionStorage.setItem('analytics_last_tracked_ref', refParam)
    }
  }, [pathname, searchParams])

  return null
}

export function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerContent />
    </Suspense>
  )
}
