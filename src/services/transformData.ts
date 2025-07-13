import type { UsageStats } from './api'

export function transformUsageData(stats: UsageStats, cutoff?: string) {
  const cutoffDate = cutoff ? new Date(cutoff) : null
  const usersPerDay: Record<string, Set<string>> = {}
  const totalUsers = new Set<string>()
  const newUsersPerDay: Record<string, number> = {}
  const requestsPerDay: Record<string, number> = {}
  const requestsPerPath: Record<string, number> = {}
  const requestsPerHour: Record<string, number> = {}

  stats.users.forEach(({ time, value }) => {
    const date = time.split(' ')[0] // "2025/05/15"
    if (cutoffDate && new Date(date) < cutoffDate) {
      return
    }
    if (!usersPerDay[date]) usersPerDay[date] = new Set()
    usersPerDay[date].add(value)
    if (!totalUsers.has(value)) {
      totalUsers.add(value)
      newUsersPerDay[date] = (newUsersPerDay[date] || 0) + 1
    }
  })

  stats.paths.forEach(({ time, value }) => {
    //"2025/05/15 11:07:34"
    const date = time.split(' ')[0]
    if (cutoffDate && new Date(date) < cutoffDate) {
      return
    }
    const hourAndMinute = time.split(' ')[1].slice(0, 5) // "11:07"
    requestsPerDay[date] = (requestsPerDay[date] || 0) + 1
    requestsPerPath[value] = (requestsPerPath[value] || 0) + 1
    requestsPerHour[hourAndMinute] = (requestsPerHour[hourAndMinute] || 0) + 1
  })

  return {
    usersPerDay: Object.entries(usersPerDay).map(([label, users]) => ({
      label,
      count: users.size
    })),
    requestsPerDay: Object.entries(requestsPerDay).map(([label, count]) => ({
      label,
      count
    })),
    requestsPerPath: Object.entries(requestsPerPath).map(([label, count]) => ({
      label,
      count
    })),
    requestsPerHour: Object.entries(requestsPerHour).map(([label, count]) => ({
      label,
      count
    })),
    newUsersPerDay: Object.entries(newUsersPerDay).map(([label, count]) => ({
      label,
      count: count
    }))
  }
}
