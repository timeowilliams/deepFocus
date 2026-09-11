import { describe, expect, it } from 'vitest'
import {
  createDeepWorkDay,
  getAutomaticHours,
  sumManualHoursForDate
} from '../src/deepWorkCalculations'

describe('manual and automatic work totals', () => {
  it('adds manual entries for only the requested date', () => {
    expect(
      sumManualHoursForDate(
        [
          { date: '2026-09-09', hours: 1 },
          { date: '2026-09-09', hours: 0.5 },
          { date: '2026-09-08', hours: 8 }
        ],
        '2026-09-09'
      )
    ).toBe(1.5)
  })

  it('uses the stored automatic component without double-counting manual work', () => {
    const previousDay = createDeepWorkDay('2026-09-09', 2, 1)
    const automaticHours = getAutomaticHours(previousDay, 1)

    expect(createDeepWorkDay('2026-09-09', automaticHours, 1.5).hours).toBe(3.5)
  })

  it('migrates a legacy combined total by subtracting its prior manual hours once', () => {
    const automaticHours = getAutomaticHours({ date: '2026-09-09', hours: 3 }, 1)

    expect(createDeepWorkDay('2026-09-09', automaticHours, 0.5).hours).toBe(2.5)
  })
})
