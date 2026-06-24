'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Play, Bookmark, Sparkles, MapPin, Globe, Users, Check,
  Zap, Compass, Camera, TrendingUp, Star, Plus, Map, X, Heart,
} from 'lucide-react'

/* ─── Constants ──────────────────────────────────────────────────────────── */
const INDIGO = '#3A36FF'
const DF = "'Clash Display', 'DM Serif Display', sans-serif"

const HERO_IMGS = [
  { src: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1920&h=1080&fit=crop&auto=format', label: 'Bali, Indonesia' },
  { src: 'https://images.unsplash.com/photo-1688229394127-4aca1b1d13d8?w=1920&h=1080&fit=crop&auto=format', label: 'Amalfi Coast, Italy' },
  { src: 'https://images.unsplash.com/photo-1613488328514-e424950c0b0d?w=1920&h=1080&fit=crop&auto=format', label: 'Tokyo, Japan' },
  { src: 'https://images.unsplash.com/photo-1507039915464-9d829b6d2d78?w=1920&h=1080&fit=crop&auto=format', label: 'Swiss Alps' },
  { src: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1920&h=1080&fit=crop&auto=format', label: 'Santorini, Greece' },
]

const FEATURES = [
  {
    label: 'Social Feed', tag: 'Discover',
    title: 'Travelers inspire travelers.',
    body: 'Follow friends, creators, and global explorers. Every scroll is a new destination waiting to become your next trip.',
    img: 'https://images.unsplash.com/photo-1688229394127-4aca1b1d13d8?w=900&h=700&fit=crop&auto=format',
    alt: 'Amalfi Coast Italy', icon: <Globe size={18} />,
  },
  {
    label: 'AI Trip Planner', tag: 'AI-Powered',
    title: 'From inspiration to itinerary in seconds.',
    body: 'Our AI reads your budget, travel style, group size, and dates — then builds a day-by-day plan you\'d actually love.',
    img: 'https://images.unsplash.com/photo-1507039915464-9d829b6d2d78?w=900&h=700&fit=crop&auto=format',
    alt: 'Swiss Alps travel', icon: <Sparkles size={18} />,
  },
  {
    label: 'World Map', tag: 'Your Journey',
    title: 'Fill in the world as you explore.',
    body: 'Every trip you take lights up your personal map. Watch your world grow, compare with friends, and find your next blank spot.',
    img: 'https://images.unsplash.com/photo-1613488328514-e424950c0b0d?w=900&h=700&fit=crop&auto=format',
    alt: 'Tokyo Japan', icon: <Map size={18} />,
  },
  {
    label: 'Group Planning', tag: 'Collaborative',
    title: 'Plan together. Travel together.',
    body: 'Invite your crew to a shared trip workspace. Vote on destinations, split costs, and synchronize itineraries.',
    img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=900&h=700&fit=crop&auto=format',
    alt: 'Bali Indonesia', icon: <Users size={18} />,
  },
]

const CREATORS = [
  {
    name: 'Sofia Reyes', handle: '@sofia_travels', followers: '248k', countries: 63, trips: 142,
    img: 'https://images.unsplash.com/photo-1762170318204-afbc7c5c4e51?w=160&h=160&fit=crop&auto=format',
    preview: 'https://images.unsplash.com/photo-1688229394127-4aca1b1d13d8?w=400&h=260&fit=crop&auto=format',
    dest: 'Amalfi Coast',
  },
  {
    name: 'Kai Morgan', handle: '@wanderwithkai', followers: '192k', countries: 47, trips: 98,
    img: 'https://images.unsplash.com/photo-1568545626986-42913c918a2e?w=160&h=160&fit=crop&auto=format',
    preview: 'https://images.unsplash.com/photo-1507039915464-9d829b6d2d78?w=400&h=260&fit=crop&auto=format',
    dest: 'Swiss Alps',
  },
  {
    name: 'Mayumi Nakano', handle: '@nomadmayumi', followers: '315k', countries: 71, trips: 209,
    img: 'https://images.unsplash.com/photo-1535468850893-d6e543fbd7f5?w=160&h=160&fit=crop&auto=format',
    preview: 'https://images.unsplash.com/photo-1613488328514-e424950c0b0d?w=400&h=260&fit=crop&auto=format',
    dest: 'Tokyo',
  },
]

const TESTIMONIALS = [
  {
    quote: 'I found my Italy trip scrolling Drift at midnight. Saved it, tweaked it with AI, booked it by morning. This is how travel should work.',
    name: 'Priya Sharma', role: 'Solo traveler · 34 countries',
    img: 'https://images.unsplash.com/photo-1762170318204-afbc7c5c4e51?w=120&h=120&fit=crop&auto=format',
  },
  {
    quote: 'My entire study-abroad crew used Drift to plan our Euro trip. The group planning feature is insane — no more 200-message group chats.',
    name: 'Jake Okonkwo', role: 'Student · NYU',
    img: 'https://images.unsplash.com/photo-1621369116334-7913d4cff562?w=120&h=120&fit=crop&auto=format',
  },
  {
    quote: 'I post my itineraries on Drift and 80k people have stolen my trips. It\'s basically become my job now.',
    name: 'Marco Visconti', role: 'Digital nomad · 5 years on the road',
    img: 'https://images.unsplash.com/photo-1568545626986-42913c918a2e?w=120&h=120&fit=crop&auto=format',
  },
  {
    quote: 'Drift suggested a hidden gem in Kyoto that wasn\'t in any guidebook. Our most magical moment came from an AI recommendation.',
    name: 'Elisa & Tom K.', role: 'Couple travelers',
    img: 'https://images.unsplash.com/photo-1535468850893-d6e543fbd7f5?w=120&h=120&fit=crop&auto=format',
  },
]

const WORLD_CITIES = [
  { x: 18, y: 32, name: 'New York' }, { x: 47, y: 27, name: 'London' },
  { x: 50, y: 29, name: 'Paris' }, { x: 55, y: 32, name: 'Rome' },
  { x: 63, y: 36, name: 'Dubai' }, { x: 71, y: 42, name: 'Mumbai' },
  { x: 80, y: 30, name: 'Tokyo' }, { x: 76, y: 47, name: 'Bali' },
  { x: 84, y: 62, name: 'Sydney' }, { x: 28, y: 55, name: 'Rio' },
  { x: 14, y: 22, name: 'Reykjavik' }, { x: 52, y: 44, name: 'Cairo' },
]

/* ─── Primitives ─────────────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-60px' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return <div className="pill">{children}</div>
}

/* ─── Phone shell + app screen mockups ──────────────────────────────────── */
function PhoneShell({ children, width, className = '' }: { children: React.ReactNode; width: number; className?: string }) {
  const height = Math.round(width * (844 / 390))
  return (
    <div className={`phone-shell ${className}`} style={{ width, height }}>
      <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}

function HomeFeedScreen() {
  return (
    <div style={{ background: '#050510', height: '100%', padding: '56px 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, fontFamily: DF }}>Discover</span>
        <div style={{ width: 34, height: 34, borderRadius: 12, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={15} color={INDIGO} />
        </div>
      </div>
      {[
        { name: 'Sofia R.', dest: 'Amalfi Coast', emoji: '🌊', saves: '4.2k', img: 'https://images.unsplash.com/photo-1688229394127-4aca1b1d13d8?w=300&h=160&fit=crop' },
        { name: 'Kai M.', dest: 'Swiss Alps', emoji: '🏔', saves: '2.1k', img: 'https://images.unsplash.com/photo-1507039915464-9d829b6d2d78?w=300&h=160&fit=crop' },
      ].map((post) => (
        <div key={post.dest} style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: '#0d0d14' }}>
          <div style={{ height: 110, backgroundImage: `url(${post.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,20,0.8), transparent)' }} />
            <div style={{ position: 'absolute', bottom: 8, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{post.dest}</div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10 }}>by {post.name}</div>
              </div>
              <div style={{ background: INDIGO, color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 99 }}>Steal</div>
            </div>
          </div>
          <div style={{ padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}><Heart size={11} /> {post.saves}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}><Bookmark size={11} /> Save</span>
            </div>
            <span style={{ color: INDIGO, fontSize: 10, fontWeight: 600 }}>View trip →</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function AIScreen() {
  return (
    <div style={{ background: '#050510', height: '100%', padding: '56px 16px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, fontFamily: DF, marginBottom: 4 }}>AI Planner</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Tell us your vibe</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[{ e: '🌴', l: 'Relaxing' }, { e: '🏔', l: 'Adventure' }, { e: '🏛', l: 'Cultural' }, { e: '✨', l: 'Luxury' }].map((v, i) => (
          <div key={v.l} style={{
            background: i === 1 ? `${INDIGO}25` : 'rgba(255,255,255,0.04)',
            border: `1px solid ${i === 1 ? `${INDIGO}50` : 'rgba(255,255,255,0.07)'}`,
            borderRadius: 14, padding: '14px 8px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{v.e}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: i === 1 ? '#9290ff' : 'rgba(255,255,255,0.6)' }}>{v.l}</div>
          </div>
        ))}
      </div>
      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Budget</div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {['$500', '$1,500', '$3,000', '$5k+'].map((b, i) => (
            <div key={b} style={{
              fontSize: 10, fontWeight: 600, padding: '5px 8px', borderRadius: 8,
              background: i === 1 ? INDIGO : 'transparent',
              color: i === 1 ? '#fff' : 'rgba(255,255,255,0.35)',
            }}>{b}</div>
          ))}
        </div>
      </div>
      <div style={{ background: INDIGO, borderRadius: 14, padding: '14px', textAlign: 'center', boxShadow: `0 0 30px ${INDIGO}40` }}>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Sparkles size={14} /> Build my trip
        </div>
      </div>
      <div style={{ background: 'rgba(58,54,255,0.08)', border: `1px solid ${INDIGO}25`, borderRadius: 14, padding: '12px 14px' }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Generating your itinerary…</div>
        <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <div style={{ width: '65%', height: '100%', background: `linear-gradient(90deg, ${INDIGO}, #7B78FF)`, borderRadius: 99 }} />
        </div>
      </div>
    </div>
  )
}

function TripsScreen() {
  return (
    <div style={{ background: '#050510', height: '100%', padding: '56px 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, fontFamily: DF, marginBottom: 4 }}>My Trips</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
        {['Upcoming', 'Saved', 'Past'].map((t, i) => (
          <div key={t} style={{
            fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 99,
            background: i === 0 ? `${INDIGO}22` : 'transparent',
            color: i === 0 ? '#9290ff' : 'rgba(255,255,255,0.35)',
            border: i === 0 ? `1px solid ${INDIGO}40` : '1px solid transparent',
          }}>{t}</div>
        ))}
      </div>
      {[
        { dest: 'Bali, Indonesia', dates: 'Aug 14–21', days: 8, score: 88, img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=300&h=120&fit=crop', budget: '$1,840' },
        { dest: 'Iceland Ring Road', dates: 'Oct 5–12', days: 7, score: 95, img: 'https://images.unsplash.com/photo-1548919695-6c4d9c03bfbd?w=300&h=120&fit=crop', budget: '$2,100' },
      ].map((trip) => (
        <div key={trip.dest} style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: '#0d0d14' }}>
          <div style={{ height: 80, backgroundImage: `url(${trip.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,20,0.6), transparent)' }} />
            <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '3px 8px', fontSize: 11, fontWeight: 800, color: '#fff' }}>
              {trip.score}
            </div>
          </div>
          <div style={{ padding: '10px 12px' }}>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{trip.dest}</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>📅 {trip.dates}</span>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>💰 {trip.budget}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Email Modal ────────────────────────────────────────────────────────── */
function EmailModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 120); setSubmitted(false); setEmail('') }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md rounded-3xl p-8"
        style={{ background: 'rgba(13,13,18,0.97)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 80px ${INDIGO}22` }}
      >
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <X size={15} />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: `${INDIGO}20` }}>
              <Check size={24} style={{ color: INDIGO }} />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: DF }}>You&apos;re on the list.</h3>
            <p className="text-white/50 text-sm leading-relaxed">We&apos;ll reach out to <span className="text-white/80">{email}</span> when we launch. Get ready to drift.</p>
            <button onClick={onClose} className="mt-6 text-sm font-medium text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity" style={{ background: INDIGO }}>Close</button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${INDIGO}18` }}>
              <Compass size={22} style={{ color: INDIGO }} />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: DF }}>Get Early Access</h3>
            <p className="text-white/45 text-sm leading-relaxed mb-7">Join thousands of travelers already on the waitlist. Be first to discover, steal, and drift.</p>
            <form onSubmit={(e) => { e.preventDefault(); if (email.includes('@')) setSubmitted(true) }} className="flex flex-col gap-3">
              <input
                ref={inputRef} type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" required
                className="w-full px-4 py-3.5 rounded-xl text-white placeholder-white/25 text-sm outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                onFocus={(e) => { e.target.style.borderColor = `${INDIGO}60` }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.10)' }}
              />
              <button type="submit" className="btn-indigo w-full justify-center text-sm py-3.5 rounded-xl" style={{ borderRadius: 12 }}>
                Join the Waitlist <ArrowRight size={15} />
              </button>
            </form>
            <p className="text-center text-white/20 text-xs mt-4">Free during beta · No credit card · iOS & Android</p>
          </>
        )}
      </motion.div>
    </div>
  )
}

/* ─── Navbar ─────────────────────────────────────────────────────────────── */
function NavBar({ onGetAccess }: { onGetAccess: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(5,5,5,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: INDIGO }}>
            <Compass size={14} className="text-white" />
          </div>
          <span className="text-white font-semibold text-[17px] tracking-tight" style={{ fontFamily: DF }}>Drift</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Product', 'Creators', 'Community', 'Pricing'].map((item) => (
            <a key={item} href="#" className="text-sm text-white/50 hover:text-white transition-colors duration-200">{item}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a href="#" className="hidden sm:block text-sm text-white/50 hover:text-white transition-colors">Sign in</a>
          <button onClick={onGetAccess} className="btn-indigo text-sm px-5 py-2.5">Get Early Access</button>
        </div>
      </div>
    </nav>
  )
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */
function HeroSection({ onGetAccess }: { onGetAccess: () => void }) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % HERO_IMGS.length), 5200)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#050505' }}>
      {HERO_IMGS.map((img, i) => (
        <div key={img.src} className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1800ms]"
          style={{ backgroundImage: `url(${img.src})`, opacity: i === active ? 1 : 0 }} aria-hidden />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/85 to-[#050505]/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-16 items-center min-h-[80vh]">

          {/* Left */}
          <div className="flex flex-col gap-6 max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
              <Pill><Sparkles size={11} /> AI-powered social travel</Pill>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(42px,6vw,80px)] font-semibold text-white leading-[1.02] tracking-tight"
              style={{ fontFamily: DF }}
            >
              The world feels bigger with Drift.
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.42 }}
              className="text-lg lg:text-xl text-white/55 leading-relaxed max-w-lg">
              Discover trips from people you trust. Steal their itineraries. Create your next adventure in seconds.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.56 }}
              className="flex flex-wrap gap-3">
              <button onClick={onGetAccess} className="btn-indigo text-sm font-semibold px-7 py-4">
                Get Early Access <ArrowRight size={16} />
              </button>
              <button className="btn-ghost text-sm font-medium px-7 py-4">
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
                  <Play size={9} className="text-white fill-white ml-0.5" />
                </div>
                Watch Demo
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
              className="flex items-center gap-2.5 text-sm text-white/40">
              <MapPin size={13} style={{ color: INDIGO }} />
              <span>Now showing:</span>
              <span className="text-white/70" key={active}>{HERO_IMGS[active].label}</span>
              <div className="flex gap-1.5 ml-1">
                {HERO_IMGS.map((_, i) => (
                  <button key={i} onClick={() => setActive(i)} className="rounded-full transition-all duration-400"
                    style={{ width: i === active ? 18 : 5, height: 5, background: i === active ? INDIGO : 'rgba(255,255,255,0.2)' }} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — 3 stacked phones */}
          <div className="hidden lg:flex justify-center items-center relative h-[620px]">
            <motion.div
              initial={{ opacity: 0, x: -40, rotate: -7 }} animate={{ opacity: 1, x: 0, rotate: -7 }}
              transition={{ duration: 1.3, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 top-20 z-0 opacity-75"
            >
              <PhoneShell width={196}><AIScreen /></PhoneShell>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40, rotate: 9 }} animate={{ opacity: 1, x: 0, rotate: 9 }}
              transition={{ duration: 1.3, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-8 z-0 opacity-75"
            >
              <PhoneShell width={200}><TripsScreen /></PhoneShell>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10"
            >
              <PhoneShell width={252}><HomeFeedScreen /></PhoneShell>
            </motion.div>

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4 }}
              className="absolute bottom-2 left-10 z-20 flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{ background: 'rgba(15,15,20,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            >
              <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1688229394127-4aca1b1d13d8?w=80&h=80&fit=crop" alt="trip" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white text-[11px] font-semibold">7 Days in Italy</p>
                <p className="text-white/40 text-[9px]">4.2k travelers saved this</p>
              </div>
              <div className="text-[10px] font-bold text-white px-2.5 py-1 rounded-full ml-1 flex-shrink-0" style={{ background: INDIGO }}>Steal</div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-px h-10 rounded-full opacity-30" style={{ background: 'linear-gradient(to bottom, transparent, white)' }} />
      </div>
    </section>
  )
}

/* ─── Stats ──────────────────────────────────────────────────────────────── */
function StatsSection() {
  return (
    <section className="py-20 border-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-3 gap-8">
          {[
            { value: '10,000+', label: 'Trips Created' },
            { value: '120+', label: 'Countries Explored' },
            { value: '50,000+', label: 'Places Shared' },
          ].map(({ value, label }, i) => (
            <FadeUp key={label} delay={i * 0.1} className="text-center">
              <p className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-2" style={{ fontFamily: DF }}>{value}</p>
              <p className="text-white/40 text-sm tracking-wide">{label}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── How It Works ───────────────────────────────────────────────────────── */
function HowItWorksSection() {
  const steps = [
    { n: '01', title: 'Discover', body: 'See trips from friends, creators, and travelers around the world. An endless feed of real adventures.', icon: <Compass size={22} />, img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&h=400&fit=crop&auto=format', action: 'Browse trips' },
    { n: '02', title: 'Steal', body: 'One tap to save any itinerary to your collection. No more screenshots or copying notes.', icon: <Bookmark size={22} />, img: 'https://images.unsplash.com/photo-1688229394127-4aca1b1d13d8?w=600&h=400&fit=crop&auto=format', action: 'Save in one tap' },
    { n: '03', title: 'Personalize', body: 'AI instantly adjusts the trip for your budget, travel style, group size, and dates.', icon: <Sparkles size={22} />, img: 'https://images.unsplash.com/photo-1507039915464-9d829b6d2d78?w=600&h=400&fit=crop&auto=format', action: 'Make it yours' },
  ]

  return (
    <section className="py-32" style={{ background: '#050505' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FadeUp className="text-center mb-20">
          <Pill><Zap size={11} /> How it works</Pill>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mt-5 tracking-tight" style={{ fontFamily: DF }}>
            Three steps to your <br /><span style={{ color: INDIGO }}>next adventure.</span>
          </h2>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <FadeUp key={step.title} delay={i * 0.12}>
              <div className="rounded-3xl overflow-hidden drift-card-hover cursor-pointer" style={{ background: '#0d0d12', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="relative h-52 overflow-hidden">
                  <img src={step.img} alt={step.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 text-xs font-bold tracking-widest" style={{ color: INDIGO }}>{step.n}</div>
                </div>
                <div className="p-6">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${INDIGO}18` }}>
                    <span style={{ color: INDIGO }}>{step.icon}</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3" style={{ fontFamily: DF }}>{step.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">{step.body}</p>
                  <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: INDIGO }}>
                    {step.action} <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Feature Showcase ───────────────────────────────────────────────────── */
function FeatureSection() {
  return (
    <section className="py-12" style={{ background: '#050505' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-8">
        {FEATURES.map((f, i) => {
          const isEven = i % 2 === 0
          return (
            <FadeUp key={f.title} delay={0.05}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden" style={{ background: '#0d0d12', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className={`relative overflow-hidden ${isEven ? 'lg:order-last' : ''}`} style={{ minHeight: 360 }}>
                  <img src={f.img} alt={f.alt} className="w-full h-full object-cover absolute inset-0" />
                  <div className={`absolute inset-0 bg-gradient-to-${isEven ? 'l' : 'r'} from-[#0d0d12] via-transparent to-transparent`} />
                </div>
                <div className="flex flex-col justify-center p-10 lg:p-14">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${INDIGO}18` }}>
                      <span style={{ color: INDIGO }}>{f.icon}</span>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: INDIGO }}>{f.tag}</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-semibold text-white mb-4 leading-tight tracking-tight" style={{ fontFamily: DF }}>{f.title}</h3>
                  <p className="text-white/50 leading-relaxed text-[15px] mb-8 max-w-sm">{f.body}</p>
                  <div className="flex items-center gap-2 text-sm font-medium" style={{ color: INDIGO }}>Learn more <ArrowRight size={15} /></div>
                </div>
              </div>
            </FadeUp>
          )
        })}
      </div>
    </section>
  )
}

/* ─── App Preview ────────────────────────────────────────────────────────── */
function AppPreviewSection() {
  return (
    <section className="py-32 overflow-hidden" style={{ background: '#08080f' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FadeUp className="text-center mb-20">
          <Pill><Camera size={11} /> The App</Pill>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mt-5 tracking-tight" style={{ fontFamily: DF }}>
            Built for the way <br />you actually travel.
          </h2>
          <p className="text-white/40 text-lg mt-4 max-w-xl mx-auto leading-relaxed">Every screen crafted to reduce friction and amplify wanderlust.</p>
        </FadeUp>

        <FadeUp delay={0.15}>
          <div className="flex justify-center items-end gap-6 relative">
            <div className="absolute inset-x-1/4 top-1/2 bottom-0 rounded-full blur-3xl -z-10 opacity-15" style={{ background: INDIGO }} />
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0 }} className="opacity-75">
              <PhoneShell width={210}><AIScreen /></PhoneShell>
            </motion.div>
            <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
              <PhoneShell width={252}><HomeFeedScreen /></PhoneShell>
            </motion.div>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="opacity-80">
              <PhoneShell width={220}><TripsScreen /></PhoneShell>
            </motion.div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

/* ─── Creators ───────────────────────────────────────────────────────────── */
function CreatorSection() {
  return (
    <section className="py-32" style={{ background: '#050505' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FadeUp className="max-w-3xl mb-20">
          <Pill><TrendingUp size={11} /> Creator Economy</Pill>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white mt-5 leading-tight tracking-tight" style={{ fontFamily: DF }}>
            Become someone&apos;s <br /><span style={{ color: INDIGO }}>next adventure.</span>
          </h2>
          <p className="text-white/45 text-lg mt-5 leading-relaxed max-w-xl">Share your trips and inspire thousands of travelers. Turn your passport stamps into a following — and a career.</p>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CREATORS.map((c, i) => (
            <FadeUp key={c.handle} delay={i * 0.1}>
              <div className="rounded-3xl overflow-hidden drift-card-hover cursor-pointer" style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="relative h-44 overflow-hidden">
                  <img src={c.preview} alt={c.dest} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-[#0d0d14]/20 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className="text-white/70 text-xs bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">{c.dest}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-5">
                    <img src={c.img} alt={c.name} className="w-12 h-12 rounded-full object-cover" style={{ border: `2px solid ${INDIGO}50` }} />
                    <div>
                      <p className="text-white font-semibold text-sm">{c.name}</p>
                      <p className="text-white/40 text-xs">{c.handle}</p>
                    </div>
                    <button className="ml-auto text-xs font-semibold text-white px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity" style={{ background: INDIGO }}>Follow</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ label: 'Followers', value: c.followers }, { label: 'Countries', value: c.countries }, { label: 'Trips', value: c.trips }].map(({ label, value }) => (
                      <div key={label} className="text-center rounded-xl py-2.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <p className="text-white font-semibold text-sm">{value}</p>
                        <p className="text-white/30 text-[10px]">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonials ───────────────────────────────────────────────────────── */
function TestimonialsSection() {
  return (
    <section className="py-32" style={{ background: '#08080f' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FadeUp className="text-center mb-16">
          <Pill><Star size={11} /> What travelers say</Pill>
          <h2 className="text-4xl md:text-5xl font-semibold text-white mt-5 tracking-tight" style={{ fontFamily: DF }}>People are already drifting.</h2>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.08}>
              <div className="rounded-3xl p-8 h-full flex flex-col" style={{ background: '#0d0d12', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={14} className="fill-current" style={{ color: INDIGO }} />
                  ))}
                </div>
                <p className="text-white/80 text-[15px] leading-relaxed flex-1 mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover" style={{ border: '2px solid rgba(255,255,255,0.1)' }} />
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/35 text-xs mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Final CTA ──────────────────────────────────────────────────────────── */
function FinalCTASection({ onGetAccess }: { onGetAccess: () => void }) {
  return (
    <section className="relative py-40 overflow-hidden" style={{ background: '#050505' }}>
      <div className="absolute inset-0 opacity-[0.18]">
        <svg className="w-full h-full" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={INDIGO} stopOpacity="0.25" />
              <stop offset="100%" stopColor={INDIGO} stopOpacity="0" />
            </radialGradient>
          </defs>
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 70} x2="1000" y2={i * 70} stroke={`${INDIGO}20`} strokeWidth="0.5" />
          ))}
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 72} y1="0" x2={i * 72} y2="560" stroke={`${INDIGO}20`} strokeWidth="0.5" />
          ))}
          <ellipse cx="500" cy="280" rx="420" ry="230" fill="url(#mapGlow)" />
          {[
            'M 180 179 Q 310 80 470 152', 'M 470 152 Q 565 120 630 213',
            'M 630 213 Q 730 130 800 168', 'M 800 168 Q 760 260 760 263',
            'M 180 179 Q 130 310 280 308', 'M 470 152 Q 520 246 520 246',
          ].map((d, i) => (
            <path key={i} d={d} stroke={INDIGO} strokeWidth="1" fill="none" strokeDasharray="8 5" className="flight-path" style={{ animationDelay: `${i * 0.4}s` }} />
          ))}
          {WORLD_CITIES.map((city) => (
            <g key={city.name}>
              <circle cx={city.x * 10} cy={city.y * 5.6} r="5" fill={INDIGO} className="city-dot" style={{ filter: `drop-shadow(0 0 6px ${INDIGO})` }} />
              <circle cx={city.x * 10} cy={city.y * 5.6} r="10" fill={INDIGO} opacity="0.12" />
            </g>
          ))}
        </svg>
      </div>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 20%, #050505 75%)' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 text-center">
        <FadeUp>
          <Pill><Globe size={11} /> Join the waitlist</Pill>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white mt-6 leading-tight tracking-tight" style={{ fontFamily: DF }}>
            Your next trip is already waiting.
          </h2>
          <p className="text-white/45 text-xl mt-6 leading-relaxed max-w-2xl mx-auto">
            Join Drift and discover where your friends, creators, and fellow travelers are going next.
          </p>
        </FadeUp>
        <FadeUp delay={0.15} className="flex flex-wrap justify-center gap-4 mt-10">
          <button onClick={onGetAccess} className="btn-indigo text-sm font-semibold px-8 py-4">
            Get Early Access <ArrowRight size={16} />
          </button>
          <button className="btn-ghost text-sm font-medium px-8 py-4">
            Download App <Plus size={16} />
          </button>
        </FadeUp>
        <FadeUp delay={0.25} className="mt-16">
          <p className="text-white/20 text-sm">No credit card required · Free during beta · iOS & Android</p>
        </FadeUp>
      </div>
    </section>
  )
}

/* ─── Footer ─────────────────────────────────────────────────────────────── */
function Footer() {
  const links = {
    Product: ['Features', 'Creators', 'AI Planner', 'Group Trips'],
    Company: ['About', 'Blog', 'Press', 'Careers'],
    Legal: ['Privacy', 'Terms', 'Cookies'],
  }

  return (
    <footer className="border-t py-16" style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#050505' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: INDIGO }}>
                <Compass size={14} className="text-white" />
              </div>
              <span className="text-white font-semibold text-lg tracking-tight" style={{ fontFamily: DF }}>Drift</span>
            </div>
            <p className="text-white/35 text-sm leading-relaxed max-w-xs">The social network for travel. Discover, steal, and create unforgettable trips.</p>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {Object.entries(links).map(([cat, items]) => (
              <div key={cat}>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">{cat}</p>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li key={item}><a href="#" className="text-sm text-white/30 hover:text-white/70 transition-colors duration-200">{item}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-white/20 text-xs">© 2025 Drift Technologies, Inc. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-white/20 text-xs">
            <MapPin size={11} /> Made for explorers everywhere
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─── App ────────────────────────────────────────────────────────────────── */
export default function Page() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#050505' }}>
      <NavBar onGetAccess={() => setModalOpen(true)} />
      <HeroSection onGetAccess={() => setModalOpen(true)} />
      <StatsSection />
      <HowItWorksSection />
      <FeatureSection />
      <AppPreviewSection />
      <CreatorSection />
      <TestimonialsSection />
      <FinalCTASection onGetAccess={() => setModalOpen(true)} />
      <Footer />
      <AnimatePresence>
        {modalOpen && <EmailModal open={modalOpen} onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}
