import { DeepWorkDay } from './types'

export function sumManualHoursForDate(
  entries: Array<{ date: string; hours: number }>,
  date: string
): number {
  return entries.filter((entry) => entry.date === date).reduce((sum, entry) => sum + entry.hours, 0)
}

/**
 * Recover the automatic portion of a stored total. Older records did not keep
 * automatic and manual hours separately, so their prior manual total is
 * subtracted once during migration.
 */
export function getAutomaticHours(
  day: Pick<DeepWorkDay, 'hours'> & Partial<DeepWorkDay>,
  previousManualHours: number
): number {
  if (Number.isFinite(day.automaticHours)) {
    return Math.max(0, day.automaticHours as number)
  }

  return Math.max(0, day.hours - previousManualHours)
}

export function createDeepWorkDay(
  date: string,
  automaticHours: number,
  manualHours: number
): DeepWorkDay {
  return {
    date,
    automaticHours,
    manualHours,
    hours: Number((automaticHours + manualHours).toFixed(2))
  }
}
