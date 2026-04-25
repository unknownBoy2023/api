import { motion } from 'framer-motion'
import { Cpu, Shield } from 'lucide-react'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      style={{
        textAlign: 'center',
        padding: '40px 24px 32px',
        borderTop: '1px solid var(--border-glass)',
        marginTop: 60
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
        <Cpu size={14} style={{ color: 'var(--neon-blue)' }} />
        <span style={{
          fontFamily: 'var(--font-heading)', fontSize: 13,
          fontWeight: 700, letterSpacing: 3
        }} className="neon-text">
          SDF DEEP SEARCH
        </span>
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: 'var(--text-muted)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', gap: 6
      }}>
        <Shield size={10} />
        Encrypted Lookups &middot; Zero Logs
      </div>
    </motion.footer>
  )
}
