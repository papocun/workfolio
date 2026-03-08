/**
 * Computes the currently active consecutive-day streak from a set of active submission dates.
 *
 * Rules:
 * - A streak is active if there is activity TODAY or YESTERDAY (relative to the current date/time).
 * - If user solved today, count consecutive active days starting from today backwards.
 * - If user solved yesterday (and not today yet), count consecutive active days starting from yesterday backwards.
 * - If user missed both today and yesterday, the streak is broken (returns 0).
 * - Never returns all-time longest streak or past historical maximums.
 */
export function calculateCurrentActiveStreak(
  activeDates: string[],
  referenceDate: Date = new Date()
): number {
  if (!activeDates || activeDates.length === 0) return 0;

  const dateSet = new Set(activeDates);

  const getIsoDateString = (d: Date): string => {
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayUtc = new Date(referenceDate);
  todayUtc.setUTCHours(0, 0, 0, 0);

  const yesterdayUtc = new Date(todayUtc);
  yesterdayUtc.setUTCDate(yesterdayUtc.getUTCDate() - 1);

  const todayStr = getIsoDateString(todayUtc);
  const yesterdayStr = getIsoDateString(yesterdayUtc);

  let startCursor: Date | null = null;

  if (dateSet.has(todayStr)) {
    startCursor = new Date(todayUtc);
  } else if (dateSet.has(yesterdayStr)) {
    startCursor = new Date(yesterdayUtc);
  } else {
    // Check timezone offset (e.g. IST UTC+5:30)
    const localTime = new Date(referenceDate.getTime() + 5.5 * 3600 * 1000);
    const localTodayStr = getIsoDateString(localTime);
    const localYesterday = new Date(localTime);
    localYesterday.setUTCDate(localYesterday.getUTCDate() - 1);
    const localYesterdayStr = getIsoDateString(localYesterday);

    if (dateSet.has(localTodayStr)) {
      startCursor = new Date(localTime);
    } else if (dateSet.has(localYesterdayStr)) {
      startCursor = new Date(localYesterday);
    } else {
      return 0; // Streak is broken
    }
  }

  let streak = 0;
  const current = new Date(startCursor);

  while (dateSet.has(getIsoDateString(current))) {
    streak++;
    current.setUTCDate(current.getUTCDate() - 1);
  }

  return streak;
}

/**
 * Parses a LeetCode submissionCalendar string and returns the active current streak.
 */
export function calculateLeetCodeActiveStreak(
  submissionCalendarRaw: string | Record<string, number> | undefined,
  referenceDate: Date = new Date()
): number {
  if (!submissionCalendarRaw) return 0;

  try {
    const calendar: Record<string, number> =
      typeof submissionCalendarRaw === 'string'
        ? JSON.parse(submissionCalendarRaw)
        : submissionCalendarRaw;

    const activeDates = Object.keys(calendar)
      .filter((ts) => (calendar[ts] || 0) > 0)
      .map((ts) => {
        const d = new Date(parseInt(ts, 10) * 1000);
        return d.toISOString().split('T')[0];
      });

    return calculateCurrentActiveStreak(activeDates, referenceDate);
  } catch {
    return 0;
  }
}
