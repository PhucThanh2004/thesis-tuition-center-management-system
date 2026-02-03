export function daysSince(date?: string) {
  if (!date) return Infinity

  const last = new Date(date).getTime()
  const now = Date.now()
  return Math.floor((now - last) / (1000 * 60 * 60 * 24))
}