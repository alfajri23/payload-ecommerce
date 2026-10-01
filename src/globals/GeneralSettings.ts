import type { GlobalConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'
import { revalidateGeneralSettings } from '@/hooks/revalidateGeneralSettings'

export const GeneralSettings: GlobalConfig = {
  slug: 'general-settings',
  label: 'General Settings',
  admin: {
    group: 'Settings',
    description: 'Pengaturan umum toko (alamat, nomor kontak, jam operasional, dan validasi stok e-commerce).',
  },
  access: {
    read: () => true,
    update: adminOnly,
  },
  hooks: {
    afterChange: [revalidateGeneralSettings],
  },
  fields: [
    {
      name: 'storeName',
      type: 'text',
      label: 'Nama Toko',
      defaultValue: 'The Bakery',
      required: true,
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Alamat Toko',
      defaultValue: 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan 12190',
      required: true,
      admin: {
        description: 'Alamat fisik toko yang ditampilkan di homepage dan footer.',
      },
    },
    {
      name: 'mapsUrl',
      type: 'text',
      label: 'Link Google Maps',
      admin: {
        description: 'Tautan Google Maps lokasi toko (opsional).',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'phoneNumber',
          type: 'text',
          label: 'Nomor WhatsApp / Telepon Utama',
          defaultValue: '+62 812-8899-7722',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'secondaryPhone',
          type: 'text',
          label: 'Telepon Kantor / Tambahan (Opsional)',
          defaultValue: '(021) 720-8899',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'email',
          type: 'text',
          label: 'Email Resmi Toko',
          defaultValue: 'kontak@thebakery.id',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'openingHours',
          type: 'text',
          label: 'Jam Operasional Buka',
          defaultValue: 'Buka Setiap Hari: 07.00 - 21.00 WIB',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'instagramUrl',
          type: 'text',
          label: 'Link Profil Instagram',
          admin: {
            width: '50%',
            placeholder: 'https://instagram.com/thebakery',
          },
        },
        {
          name: 'tiktokUrl',
          type: 'text',
          label: 'Link Profil TikTok',
          admin: {
            width: '50%',
            placeholder: 'https://tiktok.com/@thebakery',
          },
        },
      ],
    },
    {
      name: 'enableInventoryValidation',
      type: 'checkbox',
      label: 'Aktifkan Validasi Stok (Inventory)',
      defaultValue: false,
      admin: {
        description:
          'Jika diaktifkan (centang), sistem akan membatasi pembelian sesuai stok aktual di database. Jika dinonaktifkan, pembeli bebas memesan tanpa batas kuota stok.',
      },
    },
  ],
}
