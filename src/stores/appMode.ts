export type AppMode = 'boutique' | 'chambre_froide'

const MODE_KEY = 'app_mode_v2'

export function getAppMode(): AppMode | null {
  const mode = localStorage.getItem(MODE_KEY)
  if (mode === 'boutique' || mode === 'chambre_froide') return mode
  return null
}

export function setAppMode(mode: AppMode): void {
  localStorage.setItem(MODE_KEY, mode)
}

export function clearAppMode(): void {
  localStorage.removeItem(MODE_KEY)
}
