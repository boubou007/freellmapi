// Per-key usage shown on the Keys page, from GET /api/analytics/by-key — the
// same rows as the Analytics page's "Usage by key" table.
export interface KeyUsageRow {
  keyId: number
  label: string | null
  platform: string | null
  requests: number
  successRate: number
  avgLatencyMs: number
  totalInputTokens: number
  totalOutputTokens: number
}

// Rows by key id, keeping only keys that actually served a request, so a
// lookup miss means "nothing to show" for that key row.
export function indexKeyUsage(rows: readonly KeyUsageRow[]): Map<number, KeyUsageRow> {
  const byId = new Map<number, KeyUsageRow>()
  for (const row of rows) {
    if (row.requests > 0) byId.set(row.keyId, row)
  }
  return byId
}

// Multi-line tooltip body ("Label: value" per line). Built from existing
// analytics strings so no locale file has to grow a key.
export function keyUsageTooltip(
  row: KeyUsageRow,
  t: (key: string) => string,
  formatNumber: (n: number) => string,
): string {
  return [
    t('analytics.rangeLabel7d'),
    `${t('analytics.requests')}: ${formatNumber(row.requests)}`,
    `${t('analytics.successRate')}: ${formatNumber(row.successRate)}%`,
    `${t('analytics.avgLatency')}: ${formatNumber(row.avgLatencyMs)} ms`,
    `${t('analytics.inputTokens')}: ${formatNumber(row.totalInputTokens)}`,
    `${t('analytics.outputTokens')}: ${formatNumber(row.totalOutputTokens)}`,
  ].join('\n')
}
