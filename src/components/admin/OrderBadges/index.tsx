'use client'

import React from 'react'
import type { DefaultCellComponentProps } from 'payload'
import type { LucideIcon } from 'lucide-react'
import {
  AlertCircle,
  Ban,
  Check,
  CheckCircle2,
  ChefHat,
  Clock,
  CreditCard,
  HelpCircle,
  Truck,
  XCircle,
} from 'lucide-react'

interface StatusBadgeConfig {
  label: string
  bg: string
  color: string
  border: string
  icon: LucideIcon
}

// Konfigurasi status pengerjaan pesanan
const ORDER_PROGRESS_CONFIG: Record<string, StatusBadgeConfig> = {
  belum_konfirmasi: {
    label: 'Belum Konfirmasi',
    bg: '#fef3c7',
    color: '#92400e',
    border: '#fde68a',
    icon: Clock,
  },
  dikonfirmasi: {
    label: 'Dikonfirmasi',
    bg: '#e0f2fe',
    color: '#075985',
    border: '#bae6fd',
    icon: Check,
  },
  diproses: {
    label: 'Diproses',
    bg: '#ede9fe',
    color: '#5b21b6',
    border: '#ddd6fe',
    icon: ChefHat,
  },
  pengiriman: {
    label: 'Siap / Dikirim',
    bg: '#ccfbf1',
    color: '#115e59',
    border: '#99f6e4',
    icon: Truck,
  },
  selesai: {
    label: 'Selesai',
    bg: '#dcfce7',
    color: '#166534',
    border: '#bbf7d0',
    icon: CheckCircle2,
  },
  dibatalkan: {
    label: 'Dibatalkan',
    bg: '#fee2e2',
    color: '#991b1b',
    border: '#fecaca',
    icon: XCircle,
  },
}

// Konfigurasi status pembayaran
const PAYMENT_STATUS_CONFIG: Record<string, StatusBadgeConfig> = {
  unpaid: {
    label: 'Belum Bayar',
    bg: '#fee2e2',
    color: '#991b1b',
    border: '#fecaca',
    icon: AlertCircle,
  },
  dp_paid: {
    label: 'DP Terbayar',
    bg: '#e0f2fe',
    color: '#075985',
    border: '#bae6fd',
    icon: CreditCard,
  },
  paid: {
    label: 'Lunas',
    bg: '#dcfce7',
    color: '#166534',
    border: '#bbf7d0',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Batal',
    bg: '#f3f4f6',
    color: '#374151',
    border: '#e5e7eb',
    icon: Ban,
  },
}

const DEFAULT_CONFIG: StatusBadgeConfig = {
  label: 'Unknown',
  bg: '#f3f4f6',
  color: '#374151',
  border: '#e5e7eb',
  icon: HelpCircle,
}

// Base style yang dipakai bersama agar maintenance ukuran, font, & padding terpusat di satu tempat
const BASE_BADGE_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 600,
  lineHeight: '1.2',
  whiteSpace: 'nowrap',
  userSelect: 'none',
}

const renderBadge = (config: StatusBadgeConfig) => {
  const Icon = config.icon

  return (
    <span
      style={{
        ...BASE_BADGE_STYLE,
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
      }}
    >
      <Icon size={14} strokeWidth={2} style={{ flexShrink: 0 }} />
      <span>{config.label}</span>
    </span>
  )
}

export const OrderProgressCell: React.FC<DefaultCellComponentProps> = ({ cellData }) => {
  const value = String(cellData || 'belum_konfirmasi')
  const config = ORDER_PROGRESS_CONFIG[value] || { ...DEFAULT_CONFIG, label: value }
  return renderBadge(config)
}

export const PaymentStatusCell: React.FC<DefaultCellComponentProps> = ({ cellData }) => {
  const value = String(cellData || 'unpaid')
  const config = PAYMENT_STATUS_CONFIG[value] || { ...DEFAULT_CONFIG, label: value }
  return renderBadge(config)
}
