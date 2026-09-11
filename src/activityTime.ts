export const ACTIVITY_POLL_INTERVAL_MS = 5_000
export const MAX_ACTIVITY_SAMPLE_GAP_MS = ACTIVITY_POLL_INTERVAL_MS * 2

/**
 * Return the active time represented by one foreground-app sample.
 *
 * Long gaps are deliberately discarded. They indicate sleep, a suspended event
 * loop, or a stopped monitor and must never be charged as work time.
 */
export function getActivitySampleSeconds(
  previousSampleAtMs: number | null,
  sampledAtMs: number,
  maxGapMs = MAX_ACTIVITY_SAMPLE_GAP_MS
): number {
  if (
    previousSampleAtMs === null ||
    !Number.isFinite(previousSampleAtMs) ||
    !Number.isFinite(sampledAtMs) ||
    !Number.isFinite(maxGapMs)
  ) {
    return 0
  }

  const elapsedMs = sampledAtMs - previousSampleAtMs
  if (elapsedMs <= 0 || elapsedMs > maxGapMs) {
    return 0
  }

  return elapsedMs / 1_000
}

export function addTrackedSeconds(currentSeconds: number, elapsedSeconds: number): number {
  if (!Number.isFinite(elapsedSeconds) || elapsedSeconds <= 0) {
    return currentSeconds
  }

  return currentSeconds + elapsedSeconds
}
