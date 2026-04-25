import { motion } from 'framer-motion'
import { User, Phone, MapPin, Mail, Hash, Building, Calendar, Globe, CreditCard, Shield } from 'lucide-react'

const iconMap = {
  name: User, mobile: Phone, phone: Phone, address: MapPin, city: MapPin,
  state: MapPin, email: Mail, aadhar: Hash, pan: CreditCard, dob: Calendar,
  father: User, gender: User, pincode: MapPin, district: MapPin,
  alternateNumber: Phone, alternate: Phone, company: Building, operator: Globe
}

function formatKey(key) {
  let last = key.split('.').pop()
  last = last.replace(/\[\d+\]/g, '') // remove array brackets
  return last.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')
    .split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ').trim()
}

function getIcon(key) {
  const k = key.toLowerCase()
  for (const [match, Icon] of Object.entries(iconMap)) {
    if (k.includes(match)) return Icon
  }
  return Hash
}

function flattenData(data, prefix = '') {
  const items = []
  if (!data || typeof data !== 'object') return items

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined || value === '') continue
    if (typeof value === 'object' && !Array.isArray(value)) {
      items.push(...flattenData(value, prefix ? `${prefix}.${key}` : key))
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => {
        if (typeof v === 'object') {
          items.push(...flattenData(v, `${key}[${i}]`))
        } else if (v !== null && v !== '' && v !== undefined) {
          items.push({ key: `${key}`, value: String(v) }) // omit index in key
        }
      })
    } else {
      items.push({ key: prefix ? `${prefix}.${key}` : key, value: String(value) })
    }
  }
  return items
}

export default function ResultCard({ number, data, index }) {
  const items = flattenData(data)
  const nameItem = items.find(i => i.key.toLowerCase().includes('name'))

  return (
    <div className="result-card">
      {/* Header */}
      <div className="result-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <motion.div
            style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(168,85,247,0.15))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--border-glass)'
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <User size={20} style={{ color: 'var(--neon-blue)' }} />
          </motion.div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(11px, 2.5vw, 13px)', fontWeight: 700,
              color: 'var(--text-primary)', letterSpacing: 1,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}>
              {nameItem ? nameItem.value : `Record #${index + 1}`}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 12,
              color: 'var(--neon-blue)'
            }}>
              {number}
            </div>
          </div>
        </div>
        <div className="status-badge active">
          <Shield size={10} />
          FOUND
        </div>
      </div>

      {/* Data Grid */}
      <div className="data-grid">
        {items.map((item, i) => {
          const Icon = getIcon(item.key)
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="data-cell"
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4
              }}>
                <Icon size={11} style={{ color: 'var(--neon-blue)', opacity: 0.7 }} />
                <span className="result-label">{formatKey(item.key.split('.').pop())}</span>
              </div>
              <div className="result-value">{item.value}</div>
            </motion.div>
          )
        })}
      </div>

      {items.length === 0 && (
        <div style={{
          textAlign: 'center', padding: 24,
          fontFamily: 'var(--font-mono)', fontSize: 13,
          color: 'var(--text-muted)'
        }}>
          No data returned for this number
        </div>
      )}
    </div>
  )
}
