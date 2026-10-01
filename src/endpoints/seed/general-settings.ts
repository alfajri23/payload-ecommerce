import type { GeneralSetting } from '@/payload-types'

export const generalSettingsData: Omit<GeneralSetting, 'id' | 'updatedAt' | 'createdAt'> = {
  storeName: 'The Bakery',
  address: 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan 12190',
  mapsUrl: 'https://maps.google.com/?q=The+Bakery+Senopati',
  phoneNumber: '+62 812-8899-7722',
  secondaryPhone: '(021) 720-8899',
  email: 'kontak@thebakery.id',
  openingHours: 'Buka Setiap Hari: 07.00 - 21.00 WIB',
  instagramUrl: 'https://instagram.com/thebakery',
  tiktokUrl: 'https://tiktok.com/@thebakery',
  enableInventoryValidation: false,
}
