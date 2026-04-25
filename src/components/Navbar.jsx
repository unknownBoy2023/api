import { motion } from 'framer-motion'
import { Shield, Cpu } from 'lucide-react'

export default function Navbar() {
  return (
    <motion.nav
      className="navbar"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Cpu size={20} style={{ color: 'var(--neon-blue)' }} />
        <span className="nav-logo neon-text">SDF</span>
      </div>
      <div className="nav-links">
        <a href="#search-section" className="nav-link">Search</a>
        <a href="#" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Shield size={14} />
          Secure
        </a>
      </div>
    </motion.nav>
  )
}
