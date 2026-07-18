export function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function nowParts() {
  const d = new Date()
  const date = d.toLocaleDateString('fr-FR')
  const time = d.toLocaleTimeString('fr-FR')
  return { date, time, iso: d.toISOString() }
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export function isSameDay(iso: string, day = todayKey()): boolean {
  return iso.slice(0, 10) === day
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

export function getClientIp(): string {
  return localStorage.getItem('cf_client_ip') || '127.0.0.1'
}

export function downloadBlob(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function toCsv(rows: Array<Record<string, unknown>>): string {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const escape = (v: unknown) => {
    const s = String(v ?? '')
    return `"${s.replace(/"/g, '""')}"`
  }
  return [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(',')),
  ].join('\n')
}

export function printHtml(title: string, bodyHtml: string) {
  const win = window.open('', '_blank', 'noopener,noreferrer,width=800,height=900')
  if (!win) return
  win.document.write(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; color: #0f172a; padding: 24px; }
    h1 { font-size: 20px; margin: 0 0 8px; }
    h2 { font-size: 16px; margin: 16px 0 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; font-size: 13px; }
    th { background: #f1f5f9; }
    .meta { color: #475569; font-size: 13px; line-height: 1.5; }
    .total { font-weight: bold; font-size: 15px; margin-top: 12px; }
    @media print { button { display: none; } }
  </style>
</head>
<body>
  ${bodyHtml}
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`)
  win.document.close()
}
