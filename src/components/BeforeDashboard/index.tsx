import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SeedButton } from './SeedButton'
import './index.scss'

export const BeforeDashboard: React.FC = async () => {
  const payload = await getPayload({ config })

  const [visitsCount, promoCount, recentViewsDoc, ordersCount, productsCount] =
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
          limit: 5,
          sort: '-createdAt',
        })
        .catch(() => ({ docs: [] })),
      payload.count({ collection: 'orders' }).catch(() => ({ totalDocs: 0 })),
      payload.count({ collection: 'products' }).catch(() => ({ totalDocs: 0 })),
    ])

  const totalVisits = visitsCount.totalDocs
  const promoVisits = promoCount.totalDocs
  const recentViews = recentViewsDoc.docs
  const totalOrders = ordersCount.totalDocs
  const totalProducts = productsCount.totalDocs

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

      {/* Tabel Kunjungan Terakhir */}
      <div className="custom-admin-dashboard__recent-section">
        <div className="custom-admin-dashboard__recent-title">
          <span>Kunjungan Terakhir (Live Traffic)</span>
          <a
            href="/admin/collections/page-views"
            className="custom-admin-dashboard__link-button"
          >
            Lihat Semua Kunjungan →
          </a>
        </div>

        {recentViews.length === 0 ? (
          <p className="custom-admin-dashboard__empty-text">
            Belum ada kunjungan tercatat. Coba buka website dengan parameter:{' '}
            <code>?ref=ig_test</code>
          </p>
        ) : (
          <div className="custom-admin-dashboard__table-wrapper">
            <table className="custom-admin-dashboard__table">
              <thead>
                <tr>
                  <th>Landing Path</th>
                  <th>Sumber / Ref</th>
                  <th>Perangkat</th>
                  <th>Waktu</th>
                </tr>
              </thead>
              <tbody>
                {recentViews.map((item, idx) => {
                  const date = item.createdAt
                    ? new Date(item.createdAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-'
                  const isDirect = !item.referrer || item.referrer === 'Direct'

                  return (
                    <tr key={item.id || idx}>
                      <td>
                        <strong>{item.path}</strong>
                      </td>
                      <td>
                        <span
                          className={`custom-admin-dashboard__badge ${
                            isDirect
                              ? 'custom-admin-dashboard__badge--direct'
                              : 'custom-admin-dashboard__badge--ref'
                          }`}
                        >
                          {item.referrer || 'Direct'}
                        </span>
                      </td>
                      <td>
                        <span className="custom-admin-dashboard__badge custom-admin-dashboard__badge--device">
                          {item.device || 'desktop'}
                        </span>
                      </td>
                      <td>{date}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
