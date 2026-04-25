import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, RefreshCw, ArrowRight, CheckCircle, Loader, Download } from 'lucide-react'
import ResultCard from './ResultCard.jsx'
import { sanitizeData } from '../utils/sanitize.js'
import { generateMobilePDF } from '../utils/pdfGenerator.js'

const API_BASE = 'https://api.codetabs.com/v1/proxy/?quest=https%3A%2F%2Fwww.api.masterbhaiyaa.in%2Fapi%3Fmobile%3D'
const API_KEY = '%26key%3Dtg'

function extractAltNumbers(data, original) {
  const found = new Set()
  const json = JSON.stringify(data)
  
  // Search for 12-digit numbers starting with 91
  const matches12 = json.match(/\b91[6-9]\d{8}\b/g)
  if (matches12) {
    matches12.forEach(m => {
      // Remove the "91" prefix and keep the last 10 digits
      const tenDigit = m.substring(2)
      if (tenDigit !== original) found.add(tenDigit)
    })
  }
  
  // Search for 10-digit numbers starting with 6-9
  const matches10 = json.match(/\b[6-9]\d{9}\b/g)
  if (matches10) {
    matches10.forEach(m => { if (m !== original) found.add(m) })
  }
  
  return [...found]
}

export default function MobileSection() {
  const [mobile, setMobile] = useState('')
  const [mode, setMode] = useState('simple')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [deepResults, setDeepResults] = useState([])
  const [loopLog, setLoopLog] = useState([])
  const [error, setError] = useState('')

  const fetchMobile = useCallback(async (number) => {
    const res = await fetch(`${API_BASE}${number}${API_KEY}`)
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const raw = await res.json()
    return sanitizeData(raw)
  }, [])

  const handleSimple = useCallback(async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) { setError('Enter a valid 10-digit mobile number'); return }
    setError(''); setResults(null); setLoading(true)
    try {
      const data = await fetchMobile(mobile)
      setResults({ number: mobile, data })
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [mobile, fetchMobile])

  const handleDeep = useCallback(async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) { setError('Enter a valid 10-digit mobile number'); return }
    setError(''); setDeepResults([]); setLoopLog([]); setLoading(true)

    const visited = new Set()
    const queue = [mobile]
    const allResults = []

    try {
      while (queue.length > 0) {
        const current = queue.shift()
        if (visited.has(current)) continue
        visited.add(current)

        setLoopLog(prev => [...prev, { number: current, status: 'searching' }])

        const data = await fetchMobile(current)
        const entry = { number: current, data }
        allResults.push(entry)
        setDeepResults([...allResults])

        setLoopLog(prev => prev.map(l => l.number === current ? { ...l, status: 'done' } : l))

        const altNums = extractAltNumbers(data, current)
        altNums.forEach(n => { if (!visited.has(n)) queue.push(n) })
      }
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [mobile, fetchMobile])

  const handleSubmit = () => { mode === 'simple' ? handleSimple() : handleDeep() }

  const handleDownload = () => {
    if (mode === 'simple' && results) {
      generateMobilePDF([results])
    } else if (mode === 'deep' && deepResults.length > 0) {
      generateMobilePDF(deepResults)
    }
  }

  const hasResults = (mode === 'simple' && results) || (mode === 'deep' && deepResults.length > 0)

  return (
    <div className="section-wrapper">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: 32 }}
      >
        <h2 className="section-title neon-text">Mobile Intelligence</h2>
        <p className="section-subtitle">Recursive deep-search across linked mobile identities</p>
      </motion.div>

      {/* Mode Toggle */}
      <motion.div
        className="mode-toggle"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        style={{ maxWidth: 440, margin: '0 auto 24px' }}
      >
        <button
          id="mode-simple"
          className={`mode-btn ${mode === 'simple' ? 'active' : ''}`}
          onClick={() => { setMode('simple'); setResults(null); setDeepResults([]); setLoopLog([]) }}
        >
          <Zap size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
          Simple Mode
        </button>
        <button
          id="mode-deep"
          className={`mode-btn ${mode === 'deep' ? 'active' : ''}`}
          onClick={() => { setMode('deep'); setResults(null); setDeepResults([]); setLoopLog([]) }}
        >
          <RefreshCw size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
          Deep Search Loop
        </button>
      </motion.div>

      {/* Mode Description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          style={{
            textAlign: 'center', fontFamily: 'var(--font-mono)',
            fontSize: 12, color: 'var(--text-muted)', marginBottom: 24, overflow: 'hidden'
          }}
        >
          {mode === 'simple'
            ? '// Single lookup → formatted result'
            : '// Recursive chain → discovers all linked numbers automatically'}
        </motion.div>
      </AnimatePresence>

      {/* Input Card */}
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
              id="mobile-input"
              className="input-cyber"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter 10-digit mobile..."
              value={mobile}
              onChange={e => { setMobile(e.target.value.replace(/\D/g, '').slice(0, 10)); setError('') }}
              onKeyDown={e => { if (e.key === 'Enter' && !loading) handleSubmit() }}
              aria-label="Mobile number input"
            />
          </div>
          <motion.button
            id="btn-power"
            className="btn-neon"
            onClick={handleSubmit}
            disabled={loading || mobile.length < 10}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Zap size={16} />}
            <span>Power</span>
          </motion.button>
        </div>

        {/* Character counter */}
        <div style={{
          marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: 11,
          color: mobile.length === 10 ? 'var(--neon-green)' : 'var(--text-muted)',
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8
        }}>
          <span>{mobile.length}/10 digits</span>
          <span className="status-badge" style={{
            color: mode === 'simple' ? 'var(--neon-green)' : 'var(--neon-purple)',
            borderColor: mode === 'simple' ? 'rgba(34,211,238,0.3)' : 'rgba(168,85,247,0.3)',
            background: mode === 'simple' ? 'rgba(34,211,238,0.1)' : 'rgba(168,85,247,0.1)'
          }}>
            {mode === 'simple' ? 'SIMPLE' : 'DEEP LOOP'}
          </span>
        </div>

        {/* Error */}
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

      {/* Loading animation */}
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

      {/* Deep search loop log */}
      <AnimatePresence>
        {mode === 'deep' && loopLog.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ marginBottom: 32 }}
          >
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 12,
              color: 'var(--neon-purple)', marginBottom: 12, letterSpacing: 1.5
            }}>
              CHAIN TRACE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {loopLog.map((log, i) => (
                <motion.div
                  key={log.number}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="chain-trace-row"
                >
                  {i > 0 && (
                    <ArrowRight size={12} style={{ color: 'var(--neon-purple)' }} />
                  )}
                  <span style={{ color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.number}</span>
                  {log.status === 'done' ? (
                    <CheckCircle size={14} style={{ color: 'var(--neon-green)', marginLeft: 'auto', flexShrink: 0 }} />
                  ) : (
                    <Loader size={14} style={{ color: 'var(--neon-purple)', marginLeft: 'auto', flexShrink: 0, animation: 'spin 1s linear infinite' }} />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download button */}
      <AnimatePresence>
        {hasResults && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}
          >
            <button className="btn-download" onClick={handleDownload}>
              <Download size={15} />
              <span>Download Report</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simple mode result */}
      <AnimatePresence>
        {mode === 'simple' && results && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <ResultCard number={results.number} data={results.data} index={0} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deep mode results */}
      <AnimatePresence>
        {mode === 'deep' && deepResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="aggregated-header">
              <span>AGGREGATED RESULTS</span>
              <span className="count-badge">
                {deepResults.length} {deepResults.length === 1 ? 'identity' : 'identities'} found
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {deepResults.map((r, i) => (
                <motion.div
                  key={r.number}
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                >
                  <ResultCard number={r.number} data={r.data} index={i} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
