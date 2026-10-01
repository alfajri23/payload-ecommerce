/**
 * Menentukan apakah sistem harus memvalidasi stok (inventory) saat pemilihan varian dan pembelian.
 *
 * - Saat ini: membaca dari NEXT_PUBLIC_ENABLE_INVENTORY_VALIDATION di .env
 * - Besok: fungsi ini dapat dialihkan untuk membaca konfigurasi Global Setting di Payload CMS.
 */
export const isInventoryValidationEnabled = (override?: boolean | null): boolean => {
  if (typeof override === 'boolean') {
    return override
  }
  return process.env.NEXT_PUBLIC_ENABLE_INVENTORY_VALIDATION === 'true'
}
