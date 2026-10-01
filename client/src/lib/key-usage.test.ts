import { describe, it, expect } from 'vitest'
import { indexKeyUsage, keyUsageTooltip, type KeyUsageRow } from './key-usage'

const row = (keyId: number, requests: number): KeyUsageRow => ({
  keyId,
  label: null,
  platform: 'groq',
  requests,
  successRate: 66.7,
  avgLatencyMs: 200,
  totalInputTokens: 1234,
  totalOutputTokens: 56,
})

describe('indexKeyUsage', () => {
  it('maps rows by key id', () => {
    const byId = indexKeyUsage([row(1, 3), row(7, 1)])
    expect(byId.get(1)?.requests).toBe(3)
    expect(byId.get(7)?.requests).toBe(1)
    expect(byId.has(2)).toBe(false)
  })

  it('drops keys with no requests', () => {
    expect(indexKeyUsage([row(1, 0)]).has(1)).toBe(false)
  })
})

describe('keyUsageTooltip', () => {
  it('lists every metric under its label, one per line', () => {
    const t = (key: string) => `<${key}>`
    const text = keyUsageTooltip(row(1, 3), t, n => new Intl.NumberFormat('en').format(n))
    expect(text.split('\n')).toEqual([
      '<analytics.rangeLabel7d>',
      '<analytics.requests>: 3',
      '<analytics.successRate>: 66.7%',
      '<analytics.avgLatency>: 200 ms',
      '<analytics.inputTokens>: 1,234',
      '<analytics.outputTokens>: 56',
    ])
  })
})
