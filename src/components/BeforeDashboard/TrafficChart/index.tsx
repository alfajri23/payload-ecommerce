'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import './index.scss'

export interface PageViewRecord {
  createdAt: string
  device?: string | null
  referrer?: string | null
}

interface TrafficChartProps {
  initialData: PageViewRecord[]
}

type FilterRange = '7d' | '30d'

interface DailyData {
  dateKey: string // YYYY-MM-DD
  dayLabel: string
  dateLabel: string
  fullLabel: string
  total: number
  referral: number
  direct: number
}

function formatDateKey(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const date = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${date}`
}

export const TrafficChart: React.FC<TrafficChartProps> = ({ initialData }) => {
  const [range, setRange] = useState<FilterRange>('7d')
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const chartData = useMemo(() => {
    const daysCount = range === '7d' ? 7 : 30
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const days: DailyData[] = []
    const dayMap = new Map<string, DailyData>()

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const dateKey = formatDateKey(d)

      const dayLabel = d.toLocaleDateString('id-ID', { weekday: 'short' })
      const dateLabel = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
      const fullLabel = d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })

      const entry: DailyData = {
        dateKey,
        dayLabel,
        dateLabel,
        fullLabel,
        total: 0,
        referral: 0,
        direct: 0,
      }

      days.push(entry)
      dayMap.set(dateKey, entry)
    }

    initialData.forEach((item) => {
      if (!item.createdAt) return
      const itemDate = new Date(item.createdAt)
      const dateKey = formatDateKey(itemDate)
      const target = dayMap.get(dateKey)
      if (target) {
        target.total += 1
        const isDirect = !item.referrer || item.referrer.toLowerCase() === 'direct'
        if (isDirect) {
          target.direct += 1
        } else {
          target.referral += 1
        }
      }
    })

    return days
  }, [range, initialData])

  const totalPeriodVisits = useMemo(
    () => chartData.reduce((sum, item) => sum + item.total, 0),
    [chartData],
  )

  const averageDaily = useMemo(() => {
    const daysCount = chartData.length || 1
    return (totalPeriodVisits / daysCount).toFixed(1)
  }, [totalPeriodVisits, chartData])

  const peakDay = useMemo(() => {
    let peak = chartData[0]
    for (const d of chartData) {
      if (!peak || d.total > peak.total) {
        peak = d
      }
    }
    return peak && peak.total > 0 ? peak : null
  }, [chartData])

  const maxValue = useMemo(() => {
    const highest = Math.max(...chartData.map((d) => d.total), 0)
    if (highest === 0) return 5
    // Bulatkan ke atas agar ada ruang nafas di puncak grafik
    return Math.ceil((highest + 1) / 5) * 5
  }, [chartData])

  // Dimensi SVG
  const svgWidth = 660
  const svgHeight = 210
  const margin = { top: 20, right: 16, bottom: 35, left: 36 }
  const innerWidth = svgWidth - margin.left - margin.right
  const innerHeight = svgHeight - margin.top - margin.bottom

  const barStep = innerWidth / chartData.length
  const barWidth = Math.max(6, Math.min(barStep * 0.62, range === '7d' ? 44 : 14))

  const hoveredItem = hoveredIdx !== null ? chartData[hoveredIdx] : null

  return (
    <section className="traffic-chart-section" aria-label="Analitik Trafik Pengunjung">
      <div className="traffic-chart-section__header">
        <div className="traffic-chart-section__heading">
          <h3 className="traffic-chart-section__title">Tren Kunjungan Website</h3>
          <p className="traffic-chart-section__subtitle">
            Aktivitas pengunjung per hari berdasarkan data first-party analytics.
          </p>
        </div>

        <div className="traffic-chart-section__controls">
          <div className="traffic-chart-section__filters" role="group" aria-label="Filter Periode">
            <button
              type="button"
              className={`traffic-chart-section__filter-btn ${
                range === '7d' ? 'traffic-chart-section__filter-btn--active' : ''
              }`}
              onClick={() => {
                setRange('7d')
                setHoveredIdx(null)
              }}
              aria-pressed={range === '7d'}
            >
              7 Hari Terakhir
            </button>
            <button
              type="button"
              className={`traffic-chart-section__filter-btn ${
                range === '30d' ? 'traffic-chart-section__filter-btn--active' : ''
              }`}
              onClick={() => {
                setRange('30d')
                setHoveredIdx(null)
              }}
              aria-pressed={range === '30d'}
            >
              30 Hari Terakhir
            </button>
          </div>

          <Link
            href="/admin/collections/page-views"
            className="traffic-chart-section__link-button"
            title="Buka tabel lengkap data kunjungan di menu koleksi"
          >
            Buka Log Page Views →
          </Link>
        </div>
      </div>

      {/* Ringkasan Metrik Periode */}
      <div className="traffic-chart-section__metrics">
        <div className="traffic-chart-section__metric-item">
          <span className="traffic-chart-section__metric-label">Total Periode Ini</span>
          <span className="traffic-chart-section__metric-value">{totalPeriodVisits} sesi</span>
        </div>
        <div className="traffic-chart-section__metric-item">
          <span className="traffic-chart-section__metric-label">Rata-rata Harian</span>
          <span className="traffic-chart-section__metric-value">{averageDaily} / hari</span>
        </div>
        <div className="traffic-chart-section__metric-item">
          <span className="traffic-chart-section__metric-label">Trafik Tertinggi</span>
          <span className="traffic-chart-section__metric-value">
            {peakDay ? `${peakDay.dateLabel} (${peakDay.total})` : '-'}
          </span>
        </div>
      </div>

      {/* Container Grafik SVG */}
      <div className="traffic-chart-section__canvas-wrapper">
        <svg
          className="traffic-chart-section__svg"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="none"
          role="img"
          aria-label="Grafik batang kunjungan harian"
        >
          {/* Garis Grid Horizontal (3 level) */}
          {[0, 0.5, 1].map((ratio) => {
            const y = margin.top + innerHeight * (1 - ratio)
            const val = Math.round(maxValue * ratio)
            return (
              <g key={ratio} className="traffic-chart-section__grid-line-group">
                <line
                  x1={margin.left}
                  y1={y}
                  x2={margin.left + innerWidth}
                  y2={y}
                  className="traffic-chart-section__grid-line"
                />
                <text
                  x={margin.left - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="traffic-chart-section__axis-label"
                >
                  {val}
                </text>
              </g>
            )
          })}

          {/* Batang Kunjungan */}
          {chartData.map((d, idx) => {
            const barHeight = maxValue > 0 ? (d.total / maxValue) * innerHeight : 0
            const x = margin.left + idx * barStep + (barStep - barWidth) / 2
            const y = margin.top + innerHeight - barHeight
            const isHovered = hoveredIdx === idx

            // Penentuan label X axis agar tidak padat saat 30 hari
            const showLabel =
              range === '7d' || idx === 0 || idx === chartData.length - 1 || idx % 5 === 0

            return (
              <g
                key={d.dateKey}
                className={`traffic-chart-section__bar-group ${
                  isHovered ? 'traffic-chart-section__bar-group--active' : ''
                }`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                tabIndex={0}
                role="graphics-symbol"
                aria-label={`${d.fullLabel}: ${d.total} kunjungan`}
                onFocus={() => setHoveredIdx(idx)}
                onBlur={() => setHoveredIdx(null)}
              >
                {/* Area hit transparan yang lebar agar mudah disentuh / di-hover */}
                <rect
                  x={margin.left + idx * barStep}
                  y={margin.top}
                  width={barStep}
                  height={innerHeight}
                  fill="transparent"
                  className="traffic-chart-section__hit-area"
                />

                {/* Indikator kolom latar saat hover */}
                {isHovered && (
                  <rect
                    x={margin.left + idx * barStep}
                    y={margin.top}
                    width={barStep}
                    height={innerHeight}
                    className="traffic-chart-section__bar-backdrop"
                  />
                )}

                {/* Batang grafik (Bar) */}
                <rect
                  x={x}
                  y={d.total > 0 ? y : margin.top + innerHeight - 2}
                  width={barWidth}
                  height={d.total > 0 ? barHeight : 2}
                  rx={3}
                  ry={3}
                  className={`traffic-chart-section__bar ${
                    d.total === 0 ? 'traffic-chart-section__bar--empty' : ''
                  }`}
                />

                {/* Label Hari / Tanggal (X Axis) */}
                {showLabel && (
                  <text
                    x={x + barWidth / 2}
                    y={svgHeight - 12}
                    textAnchor="middle"
                    className="traffic-chart-section__x-label"
                  >
                    {range === '7d' ? d.dayLabel : d.dateLabel}
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        {/* Floating Tooltip saat Hover */}
        {hoveredItem && (
          <div
            className="traffic-chart-section__tooltip"
            style={{
              left: `${
                ((margin.left +
                  (hoveredIdx ?? 0) * barStep +
                  barStep / 2) /
                  svgWidth) *
                100
              }%`,
            }}
          >
            <div className="traffic-chart-section__tooltip-date">{hoveredItem.fullLabel}</div>
            <div className="traffic-chart-section__tooltip-total">
              <strong>{hoveredItem.total}</strong> sesi kunjungan
            </div>
            {hoveredItem.total > 0 && (
              <div className="traffic-chart-section__tooltip-breakdown">
                <span>Direct: {hoveredItem.direct}</span>
                <span>•</span>
                <span>Ref / Promo: {hoveredItem.referral}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {totalPeriodVisits === 0 && (
        <p className="traffic-chart-section__empty-note">
          Belum ada kunjungan yang tercatat dalam periode ini. Data akan otomatis muncul ketika ada
          pengunjung membuka website (misal: <code>?ref=promo_test</code>).
        </p>
      )}
    </section>
  )
}
