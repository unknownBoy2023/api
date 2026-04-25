/**
 * Sanitize API response data:
 * - Replace all occurrences of "MasterBhaiyaa" / "Wm" / "@MasterBhaiyaa" with "A<>K"
 */
const REPLACEMENTS = [
  /Wm\s*@?\s*MasterBhaiyaa/gi,
  /@MasterBhaiyaa/gi,
  /MasterBhaiyaa/gi,
  /masterbhaiyaa/gi,
  /\bWm\b/g,
]

export function sanitizeValue(val) {
  if (typeof val !== 'string') return val
  let out = val
  for (const regex of REPLACEMENTS) {
    out = out.replace(regex, 'A<>K')
  }
  return out
}

export function sanitizeData(data) {
  if (data === null || data === undefined) return data
  if (typeof data === 'string') return sanitizeValue(data)
  if (Array.isArray(data)) return data.map(sanitizeData)
  if (typeof data === 'object') {
    const result = {}
    for (const [key, value] of Object.entries(data)) {
      result[key] = sanitizeData(value)
    }
    return result
  }
  return data
}
