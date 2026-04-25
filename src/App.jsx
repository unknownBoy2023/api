import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Smartphone, Car, Zap, Shield, ChevronDown } from 'lucide-react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import MobileSection from './components/MobileSection.jsx'
import VehicleSection from './components/VehicleSection.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [activeTab, setActiveTab] = useState('mobile')

  return (
    <>
      <Navbar />
      <Hero />

      <main className="app-container" style={{ paddingBottom: 80 }}>
        {/* Tab Selector */}
        <motion.div
          id="search-section"
          className="tab-container"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 560, margin: '0 auto 40px' }}
        >
          <button
            id="tab-mobile"
            className={`tab-btn ${activeTab === 'mobile' ? 'active' : ''}`}
            onClick={() => setActiveTab('mobile')}
          >
            <Smartphone size={16} />
            <span>Mobile Lookup</span>
          </button>
          <button
            id="tab-vehicle"
            className={`tab-btn ${activeTab === 'vehicle' ? 'active' : ''}`}
            onClick={() => setActiveTab('vehicle')}
          >
            <Car size={16} />
            <span>RC Lookup</span>
          </button>
        </motion.div>

        {/* Section Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'mobile' ? (
            <motion.div
              key="mobile"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <MobileSection />
            </motion.div>
          ) : (
            <motion.div
              key="vehicle"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <VehicleSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </>
  )
}
