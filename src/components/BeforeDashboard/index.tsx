import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SeedButton } from './SeedButton'
import { TrafficChart } from './TrafficChart'
import './index.scss'

export const BeforeDashboard: React.FC = async () => {
  const payload = await getPayload({ config })

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)
  thirtyDaysAgo.setHours(0, 0, 0, 0)

  const [visitsCount, promoCount, monthlyViewsDoc, ordersCount, productsCount] =
    await Promise.all([
      payload.count({ collection: 'page-views' }).catch(() => ({ totalDocs: 0 })),
      payload
        .count({
          collection: 'page-views',
          where: {
            referrer: {
              not_equals: 'Direct',
            },
          },
        })
        .catch(() => ({ totalDocs: 0 })),
      payload
        .find({
          collection: 'page-views',
          where: {
            createdAt: {
              greater_than_equal: thirtyDaysAgo.toISOString(),
            },
          },
          limit: 1000,
          pagination: false,
          sort: 'createdAt',
        })
        .catch(() => ({ docs: [] })),
      payload.count({ collection: 'orders' }).catch(() => ({ totalDocs: 0 })),
      payload.count({ collection: 'products' }).catch(() => ({ totalDocs: 0 })),
    ])

  const totalVisits = visitsCount.totalDocs
  const promoVisits = promoCount.totalDocs
  const totalOrders = ordersCount.totalDocs
  const totalProducts = productsCount.totalDocs

  const trafficData = (monthlyViewsDoc.docs || []).map((doc) => ({
    createdAt:
      typeof doc.createdAt === 'string' ? doc.createdAt : new Date(doc.createdAt).toISOString(),
    device: doc.device || null,
    referrer: doc.referrer || null,
  }))

  return (
    <div className="custom-admin-dashboard">
      <div className="custom-admin-dashboard__header">
        <div>
          <h2 className="custom-admin-dashboard__title">Ringkasan Toko & Analitik</h2>
          <p className="custom-admin-dashboard__subtitle">
            Pantau metrik kunjungan website dan aktivitas toko secara real-time.
          </p>
        </div>
        <div className="custom-admin-dashboard__actions">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="custom-admin-dashboard__link-button"
          >
            ↗ Kunjungi Web
          </a>
          <SeedButton />
        </div>
      </div>

      {/* Grid 4 Kartu Metrik */}
      <div className="custom-admin-dashboard__grid">
        <div className="custom-admin-dashboard__card">
          <div className="custom-admin-dashboard__card-header">
            <span className="custom-admin-dashboard__card-label">Total Pengunjung</span>
            <span className="custom-admin-dashboard__card-icon">👥</span>
          </div>
          <div className="custom-admin-dashboard__card-value">{totalVisits}</div>
          <div className="custom-admin-dashboard__card-desc">Sesi unik landing tercatat</div>
        </div>

        <div className="custom-admin-dashboard__card">
          <div className="custom-admin-dashboard__card-header">
            <span className="custom-admin-dashboard__card-label">Kunjungan Promo (?ref=)</span>
            <span className="custom-admin-dashboard__card-icon">🏷️</span>
          </div>
          <div className="custom-admin-dashboard__card-value">{promoVisits}</div>
          <div className="custom-admin-dashboard__card-desc">Dari link promosi sosial / chat</div>
        </div>

        <div className="custom-admin-dashboard__card">
          <div className="custom-admin-dashboard__card-header">
            <span className="custom-admin-dashboard__card-label">Total Pesanan</span>
            <span className="custom-admin-dashboard__card-icon">🛍️</span>
          </div>
          <div className="custom-admin-dashboard__card-value">{totalOrders}</div>
          <div className="custom-admin-dashboard__card-desc">Semua pesanan masuk</div>
        </div>

        <div className="custom-admin-dashboard__card">
          <div className="custom-admin-dashboard__card-header">
            <span className="custom-admin-dashboard__card-label">Produk Terdaftar</span>
            <span className="custom-admin-dashboard__card-icon">🥐</span>
          </div>
          <div className="custom-admin-dashboard__card-value">{totalProducts}</div>
          <div className="custom-admin-dashboard__card-desc">Katalog roti & artisan</div>
        </div>
      </div>

      {/* Grafik Tren Trafik */}
      <TrafficChart initialData={trafficData} />
    </div>
  )
}
