'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { LucideIcon, Sparkles, ChevronRight, Menu, X } from 'lucide-react'

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className = '' }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0]?.name)
  const [scrolled, setScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track which section is in view for active highlight
  useEffect(() => {
    const sectionIds = items
      .map((item) => {
        if (item.url.startsWith('#')) return item.url.slice(1)
        if (item.url === '/') return 'hero'
        return null
      })
      .filter(Boolean) as string[]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const matchingItem = items.find((item) => {
              const id = item.url.startsWith('#') ? item.url.slice(1) : item.url === '/' ? 'hero' : ''
              return id === entry.target.id
            })
            if (matchingItem) setActiveTab(matchingItem.name)
          }
        })
      },
      { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  const handleNavClick = (item: NavItem) => {
    setActiveTab(item.name)
    setIsMobileOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed left-0 right-0 z-[100] ${className}`}
      style={{ top: 0 }}
    >
      <div
        className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8"
        style={{
          maxWidth: 1280,
          height: 72,
        }}
      >
        {/* ── Logo ─────────────────────────────────────────────── */}
        <motion.div
          className="flex items-center gap-2.5 shrink-0"
          whileHover={{ scale: 1.03 }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
            }}
          >
            <Sparkles size={18} color="#fff" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Content<span className="gradient-text">IQ</span>
          </span>
        </motion.div>

        {/* ── Center pill — Desktop ────────────────────────────── */}
        <div
          className="hidden md:flex items-center gap-1 relative"
          style={{
            background: scrolled
              ? 'rgba(255,255,255,0.04)'
              : 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 100,
            padding: '4px 6px',
            boxShadow: scrolled
              ? '0 4px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
              : '0 2px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04)',
            transition: 'background 0.3s ease, box-shadow 0.3s ease',
          }}
        >
          {items.map((item) => {
            const isActive = activeTab === item.name
            const Icon = item.icon

            return (
              <a
                key={item.name}
                href={item.url}
                onClick={() => handleNavClick(item)}
                className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer select-none"
                style={{
                  color: isActive
                    ? '#ffffff'
                    : 'rgba(255,255,255,0.5)',
                  zIndex: 1,
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="tubelight-highlight"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(139,92,246,0.15))',
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow:
                        '0 0 20px rgba(56,189,248,0.2), 0 0 40px rgba(139,92,246,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon size={16} />
                  <span className="hidden lg:inline">{item.name}</span>
                </span>
              </a>
            )
          })}

          {/* Tubelight glow above the pill */}
          <div
            className="absolute -top-px left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: '40%',
              height: 2,
              background:
                'linear-gradient(90deg, transparent, rgba(56,189,248,0.6), rgba(139,92,246,0.6), transparent)',
              borderRadius: 100,
              filter: 'blur(1px)',
            }}
          />
        </div>

        {/* ── Auth buttons — Desktop ──────────────────────────── */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="text-sm font-semibold cursor-pointer"
              style={{
                padding: '9px 22px',
                color: 'rgba(255,255,255,0.7)',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 10,
              }}
            >
              Sign In
            </motion.button>
          </Link>
          <Link href="/signup">
            <motion.button
              className="glow-btn text-sm font-semibold cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '10px 22px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Get Early Access <ChevronRight size={16} />
            </motion.button>
          </Link>
        </div>

        {/* ── Mobile hamburger ────────────────────────────────── */}
        <motion.button
          className="md:hidden flex items-center justify-center cursor-pointer"
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
          }}
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      {/* ── Mobile dropdown ────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden mx-4 mt-2 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(8,15,32,0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div className="p-4 flex flex-col gap-1">
              {items.map((item) => {
                const isActive = activeTab === item.name
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.url}
                    onClick={() => handleNavClick(item)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                    style={{
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                      background: isActive
                        ? 'rgba(56,189,248,0.08)'
                        : 'transparent',
                    }}
                  >
                    <Icon size={18} />
                    {item.name}
                  </a>
                )
              })}
            </div>

            <div
              className="p-4 pt-2 flex flex-col gap-2"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <Link href="/login" onClick={() => setIsMobileOpen(false)}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="w-full text-sm font-semibold cursor-pointer"
                  style={{
                    padding: '10px',
                    color: 'rgba(255,255,255,0.7)',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 10,
                  }}
                >
                  Sign In
                </motion.button>
              </Link>
              <Link href="/signup" onClick={() => setIsMobileOpen(false)}>
                <motion.button
                  className="glow-btn w-full text-sm font-semibold cursor-pointer"
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '10px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  Get Early Access <ChevronRight size={16} />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Full-width bottom border — appears on scroll ───── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: scrolled
            ? 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.06) 50%, transparent 95%)'
            : 'transparent',
          transition: 'background 0.3s ease',
        }}
      />

      {/* ── Navbar backdrop — appears on scroll ────────────── */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          background: scrolled ? 'rgba(6,6,16,0.8)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          transition: 'all 0.3s ease',
        }}
      />
    </motion.nav>
  )
}
