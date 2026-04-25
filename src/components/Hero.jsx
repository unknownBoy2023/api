import { motion } from 'framer-motion'
import { ChevronDown, Zap } from 'lucide-react'

export default function Hero() {
  return (
    <section className="hero">
      {/* Floating orbs */}
      <motion.div
        style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)',
          top: '10%', left: '10%', filter: 'blur(40px)'
        }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute', width: 250, height: 250, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
          bottom: '10%', right: '15%', filter: 'blur(40px)'
        }}
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <motion.div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 999,
            border: '1px solid var(--border-glass)',
            background: 'rgba(0,212,255,0.05)',
            marginBottom: 24, fontFamily: 'var(--font-mono)',
            fontSize: 12, color: 'var(--neon-blue)', letterSpacing: 1.5
          }}
          animate={{ boxShadow: ['0 0 10px rgba(0,212,255,0.1)', '0 0 20px rgba(0,212,255,0.2)', '0 0 10px rgba(0,212,255,0.1)'] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Zap size={12} />
          INTELLIGENCE PLATFORM v2.0
        </motion.div>

        <h1 className="hero-title">
          <span className="neon-text">DEEP</span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>SEARCH</span>
        </h1>

        <p className="hero-sub">
          Advanced lookup engine for mobile intelligence and vehicle registration data.
          Powered by recursive deep-search algorithms.
        </p>

        <motion.a
          href="#search-section"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginTop: 36, color: 'var(--neon-blue)',
            fontFamily: 'var(--font-mono)', fontSize: 13,
            textDecoration: 'none', cursor: 'pointer'
          }}
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={18} />
          Begin Search
        </motion.a>
      </motion.div>
    </section>
  )
}
