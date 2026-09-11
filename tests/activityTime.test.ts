import { describe, expect, it } from 'vitest'
import { addTrackedSeconds, getActivitySampleSeconds } from '../src/activityTime'

describe('activity time sampling', () => {
  it('measures the real elapsed time between normal samples', () => {
    expect(getActivitySampleSeconds(10_000, 15_250)).toBe(5.25)
  })

  it('does not count the first sample', () => {
    expect(getActivitySampleSeconds(null, 15_000)).toBe(0)
  })

  it('does not count time across sleep or a stalled monitor', () => {
    expect(getActivitySampleSeconds(10_000, 25_000)).toBe(0)
  })

  it('ignores duplicate, backwards, and invalid samples', () => {
    expect(getActivitySampleSeconds(10_000, 10_000)).toBe(0)
    expect(getActivitySampleSeconds(10_000, 9_000)).toBe(0)
    expect(addTrackedSeconds(30, Number.NaN)).toBe(30)
  })

  it('adds a measured sample exactly once', () => {
    const elapsed = getActivitySampleSeconds(10_000, 15_000)
    expect(addTrackedSeconds(30, elapsed)).toBe(35)
  })
})
