import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Zap, User, Calendar, Fuel, MapPin, Hash, Shield, CreditCard, Loader, Gauge, Palette, Download, Phone } from 'lucide-react'
import { sanitizeData } from '../utils/sanitize.js'
import { generateVehiclePDF } from '../utils/pdfGenerator.js'

const API_BASE = 'https://api.codetabs.com/v1/proxy?quest=https%3A%2F%2Fwww.api.masterbhaiyaa.in%2Fapi%3Frc%3D'
const API_KEY = '%26key%3Dtg'

const essentialFields = [
  { keys: ['owner_name', 'ownerName', 'name', 'owner'], label: 'Owner Name', icon: User },
  { keys: ['vehicle_class', 'vehicleClass', 'class', 'type', 'vehicle_type'], label: 'Vehicle Class', icon: Car },
  { keys: ['fuel_type', 'fuelType', 'fuel'], label: 'Fuel Type', icon: Fuel },
  { keys: ['maker', 'manufacturer', 'maker_model', 'makerModel', 'vehicle_manufacturer_name'], label: 'Maker / Model', icon: Gauge },
  { keys: ['model', 'vehicle_model'], label: 'Model', icon: Car },
  { keys: ['color', 'vehicle_color', 'colour'], label: 'Color', icon: Palette },
  { keys: ['reg_date', 'regDate', 'registration_date', 'registrationDate'], label: 'Registration Date', icon: Calendar },
  { keys: ['reg_no', 'regNo', 'registration_number', 'registrationNumber', 'rc_number'], label: 'Reg Number', icon: Hash },
  { keys: ['state', 'reg_state', 'registered_state'], label: 'State', icon: MapPin },
  { keys: ['rto', 'rto_name', 'rtoName', 'office'], label: 'RTO', icon: MapPin },
  { keys: ['insurance_upto', 'insuranceUpto', 'insurance_validity', 'insurance'], label: 'Insurance Valid', icon: Shield },
  { keys: ['fitness_upto', 'fitnessUpto', 'fitness_validity'], label: 'Fitness Valid', icon: Shield },
  { keys: ['father_name', 'fatherName'], label: 'Father Name', icon: User },
  { keys: ['chassis', 'chassis_number', 'chassisNumber'], label: 'Chassis No', icon: CreditCard },
  { keys: ['engine', 'engine_number', 'engineNumber'], label: 'Engine No', icon: CreditCard },
]

function formatKey(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')
    .split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ').trim()
}

function extractAllFields(data) {
  const r = {};
  function traverse(obj) {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) {
      obj.forEach(traverse);
      return;
    }
    for (const [k, v] of Object.entries(obj)) {
      if (['wm', 'telegram', 'source', 'success', 'rc'].includes(k.toLowerCase())) continue;
      if (v && typeof v === 'object') {
        traverse(v);
      } else if (v !== null && v !== undefined && String(v).trim() !== '') {
        let niceKey = formatKey(k);
        if (!r[niceKey] || r[niceKey].toLowerCase().includes('data not available')) {
          r[niceKey] = String(v);
        }
      }
    }
  }
  traverse(data);

  const result = [];
  for (const [k, v] of Object.entries(r)) {
    if (v.toLowerCase().includes('data not available') || k.toLowerCase().includes('error')) continue;
    
    let icon = Hash;
    for (const field of essentialFields) {
      if (field.label.toLowerCase() === k.toLowerCase() || field.keys.some(x => formatKey(x).toLowerCase() === k.toLowerCase())) {
        icon = field.icon;
        break;
      }
    }
    if (icon === Hash) {
      if (k.toLowerCase().includes('name') || k.toLowerCase().includes('owner')) icon = User;
      else if (k.toLowerCase().includes('date') || k.toLowerCase().includes('upto')) icon = Calendar;
      else if (k.toLowerCase().includes('address') || k.toLowerCase().includes('city') || k.toLowerCase().includes('state')) icon = MapPin;
      else if (k.toLowerCase().includes('phone') || k.toLowerCase().includes('mobile')) icon = Phone;
    }
    result.push({ label: k, value: String(v), icon });
  }
  return result;
}

export default function VehicleSection() {
  const [regNo, setRegNo] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleSearch = useCallback(async () => {
    const cleaned = regNo.replace(/\s+/g, '').toUpperCase()
    if (cleaned.length < 4) { setError('Enter a valid vehicle registration number'); return }
    setError(''); setResult(null); setLoading(true)
    try {
      const res = await fetch(`${API_BASE}${cleaned}${API_KEY}`)
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const raw = await res.json()
      const data = sanitizeData(raw)
      setResult({ regNo: cleaned, data, fields: extractAllFields(data) })
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [regNo])

  const handleDownload = () => {
    if (result) generateVehiclePDF(result.regNo, result.fields)
  }

  return (
    <div className="section-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: 32 }}
      >
        <h2 className="section-title neon-text">RC Intelligence</h2>
        <p className="section-subtitle">Instant vehicle registration data lookup and analysis</p>
      </motion.div>

      {/* Input */}
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ padding: 'clamp(16px, 4vw, 32px)', marginBottom: 32 }}
      >
        <div className="input-row">
          <div style={{ flex: 1, minWidth: 0 }}>
            <input
              id="vehicle-input"
              className="input-cyber"
              type="text"
              placeholder="Enter vehicle number (e.g. MH12AB1234)"
              value={regNo}
              onChange={e => { setRegNo(e.target.value.toUpperCase()); setError('') }}
              onKeyDown={e => { if (e.key === 'Enter' && !loading) handleSearch() }}
              style={{ textTransform: 'uppercase', letterSpacing: 2 }}
              aria-label="Vehicle registration number input"
            />
          </div>
          <motion.button
            id="btn-rc-power"
            className="btn-neon"
            onClick={handleSearch}
            disabled={loading || regNo.length < 4}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Zap size={16} />}
            <span>Power</span>
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                marginTop: 12, padding: '10px 16px', borderRadius: 'var(--radius-sm)',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                color: 'var(--neon-red)', fontFamily: 'var(--font-mono)', fontSize: 13
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}
          >
            <div className="loading-dot" />
            <div className="loading-dot" />
            <div className="loading-dot" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download + Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Download button */}
            {result.fields.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                <button className="btn-download" onClick={handleDownload}>
                  <Download size={15} />
                  <span>Download Report</span>
                </button>
              </div>
            )}

            <div className="result-card">
              {/* Vehicle header */}
              <div className="result-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <motion.div
                    style={{
                      width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                      background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.15))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid rgba(245,158,11,0.2)'
                    }}
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  >
                    <Car size={22} style={{ color: 'var(--neon-amber)' }} />
                  </motion.div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--font-heading)', fontSize: 'clamp(13px, 3vw, 16px)', fontWeight: 800,
                      color: 'var(--neon-amber)', letterSpacing: 3,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {result.regNo}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 11,
                      color: 'var(--text-muted)'
                    }}>
                      Vehicle Registration Record
                    </div>
                  </div>
                </div>
                <div className="status-badge active">
                  <Shield size={10} />
                  VERIFIED
                </div>
              </div>

              {/* Essential fields grid */}
              {result.fields.length > 0 ? (
                <div className="data-grid">
                  {result.fields.map((f, i) => {
                    const Icon = f.icon
                    return (
                      <motion.div
                        key={f.label + i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="data-cell"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <Icon size={11} style={{ color: 'var(--neon-amber)', opacity: 0.7 }} />
                          <span className="result-label" style={{ color: 'var(--neon-amber)' }}>{f.label}</span>
                        </div>
                        <div className="result-value">{f.value}</div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center', padding: 24,
                  fontFamily: 'var(--font-mono)', fontSize: 13,
                  color: 'var(--text-muted)'
                }}>
                  No valid vehicle data returned from the API
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
