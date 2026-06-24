'use client'

import { useEffect, useRef, useState } from 'react'

/* ─── Navbar ─────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        width: 'calc(100% - 48px)',
        maxWidth: 1200,
        borderRadius: 16,
        padding: '0 24px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.4s ease',
        background: scrolled
          ? 'rgba(7, 7, 18, 0.85)'
          : 'rgba(7, 7, 18, 0.4)',
        backdropFilter: scrolled ? 'blur(24px)' : 'blur(12px)',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.01em', color: '#F8F6FF' }}>
        DRIFT
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <a className="nav-link" href="#features">Features</a>
        <a className="nav-link" href="#pricing">Pricing</a>
        <a className="nav-link" href="#mission">About</a>
      </div>

      <a
        href="#waitlist"
        className="btn-primary"
        style={{
          padding: '10px 22px',
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 600,
          color: '#fff',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        Join Waitlist <span style={{ fontSize: 12 }}>→</span>
      </a>
    </nav>
  )
}

/* ─── Hero ───────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      className="hero-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 100,
        paddingBottom: 80,
      }}
    >
      {/* Background orbs */}
      <div
        className="orb"
        style={{
          width: 600,
          height: 600,
          top: '10%',
          left: '5%',
          background: 'radial-gradient(circle, rgba(117,96,255,0.18) 0%, transparent 70%)',
          animation: 'float 10s ease-in-out infinite',
        }}
      />
      <div
        className="orb"
        style={{
          width: 400,
          height: 400,
          bottom: '10%',
          right: '5%',
          background: 'radial-gradient(circle, rgba(90,69,224,0.15) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out 3s infinite',
        }}
      />
      <div
        className="orb"
        style={{
          width: 300,
          height: 300,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(155,143,255,0.08) 0%, transparent 70%)',
          animation: 'float 12s ease-in-out 1s infinite',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: 40,
          maxWidth: 1200,
          width: '100%',
          padding: '0 24px',
        }}
      >
        {/* Left floating card */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div
            className="glass card-hover"
            style={{
              borderRadius: 20,
              padding: '20px 24px',
              maxWidth: 220,
              animation: 'float 6s ease-in-out infinite',
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 10 }}>✈️</div>
            <div style={{ fontSize: 11, color: '#9897B8', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Saved Trip</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#F8F6FF', marginBottom: 12 }}>Santorini Escape</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 13, color: '#9897B8' }}>📅 4 days</div>
              <div style={{ fontSize: 13, color: '#9897B8' }}>💰 $1,200 budget</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(117,96,255,0.2)',
                  border: '1px solid rgba(117,96,255,0.4)',
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#9B8FFF',
                }}>92</div>
                <div style={{ fontSize: 12, color: '#9897B8' }}>Trip Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Center text */}
        <div style={{ textAlign: 'center', maxWidth: 600 }}>
          <div className="section-label" style={{ marginBottom: 20 }}>✦ AI-Powered Travel Community</div>

          <h1
            style={{
              fontSize: 'clamp(44px, 5.5vw, 72px)',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: '#F8F6FF',
              marginBottom: 20,
            }}
          >
            <span className="gradient-text-warm">The world feels</span>
            <br />
            bigger with{' '}
            <span
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #9B8FFF 0%, #7560FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Drift.
            </span>
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.65, color: '#9897B8', marginBottom: 16, maxWidth: 480, margin: '0 auto 24px' }}>
            Discover places. Build memories. Share the journey.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#5C5A7A', marginBottom: 40, maxWidth: 440, margin: '0 auto 40px' }}>
            Drift is the AI-powered travel community where explorers discover trips, create personalized itineraries, and experience the world together.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="#waitlist"
              className="btn-primary"
              style={{
                padding: '15px 32px',
                borderRadius: 14,
                fontSize: 16,
                fontWeight: 700,
                color: '#fff',
                textDecoration: 'none',
              }}
            >
              Join Early Access
            </a>
            <a
              href="#app"
              className="btn-ghost"
              style={{
                padding: '15px 32px',
                borderRadius: 14,
                fontSize: 16,
                fontWeight: 600,
                color: '#9897B8',
                textDecoration: 'none',
                background: 'transparent',
              }}
            >
              Explore Drift ↓
            </a>
          </div>
        </div>

        {/* Right floating card */}
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <div
            className="glass card-hover"
            style={{
              borderRadius: 20,
              padding: '20px 24px',
              maxWidth: 220,
              animation: 'float 6s ease-in-out 2s infinite',
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 10 }}>🔥</div>
            <div style={{ fontSize: 11, color: '#9897B8', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Trending</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#F8F6FF', marginBottom: 12, lineHeight: 1.3 }}>Tokyo Night Food Tour</div>
            <div style={{ fontSize: 13, color: '#9897B8', marginBottom: 8 }}>Created by Alex</div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 10px',
                background: 'rgba(117,96,255,0.12)',
                borderRadius: 8,
                border: '1px solid rgba(117,96,255,0.2)',
              }}
            >
              <span style={{ fontSize: 13, color: '#9B8FFF', fontWeight: 700 }}>+ 438</span>
              <span style={{ fontSize: 12, color: '#9897B8' }}>travelers saved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 160,
          background: 'linear-gradient(to top, #070712, transparent)',
          pointerEvents: 'none',
        }}
      />
    </section>
  )
}

/* ─── Stats ──────────────────────────────────────────────── */
function useCountUp(target: number, duration: number = 1800, start: boolean = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

function StatCard({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const count = useCountUp(target, 1800, started)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect() } },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        textAlign: 'center',
        padding: '32px 24px',
      }}
    >
      <div
        className="stat-number"
        style={{
          fontSize: 'clamp(40px, 5vw, 64px)',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, #F8F6FF 0%, #9B8FFF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
          marginBottom: 12,
        }}
      >
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: 15, color: '#9897B8', fontWeight: 500 }}>{label}</div>
    </div>
  )
}

function Stats() {
  return (
    <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <div
        className="glass"
        style={{
          borderRadius: 24,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 0,
          overflow: 'hidden',
        }}
      >
        {[
          { target: 12400, suffix: '+', label: 'Waitlist Members' },
          { target: 180, suffix: '+', label: 'Countries Covered' },
          { target: 50000, suffix: '+', label: 'Trips Generated' },
          { target: 98, suffix: '%', label: 'Would Recommend' },
        ].map((stat, i) => (
          <div
            key={stat.label}
            style={{
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}
          >
            <StatCard {...stat} />
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Mission / Bourdain ─────────────────────────────────── */
function Mission() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.15 }
    )
    if (ref.current) {
      ref.current.querySelectorAll('.reveal, .reveal-left').forEach(el => observer.observe(el))
    }
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="mission"
      ref={ref}
      style={{
        padding: '120px 24px',
        maxWidth: 1000,
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {/* Background accent */}
      <div
        className="orb"
        style={{
          width: 500,
          height: 500,
          top: '0%',
          right: '-10%',
          background: 'radial-gradient(circle, rgba(117,96,255,0.12) 0%, transparent 70%)',
          position: 'absolute',
          filter: 'blur(80px)',
        }}
      />

      <div className="reveal" style={{ position: 'relative', zIndex: 2 }}>
        <div className="section-label">✦ Why Drift Exists</div>

        <div style={{ position: 'relative', marginBottom: 48 }}>
          <div className="quote-mark" style={{ position: 'absolute', top: -20, left: -10 }}>"</div>
          <blockquote
            style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: '#F8F6FF',
              paddingLeft: 40,
              paddingTop: 20,
              margin: 0,
            }}
          >
            Travel isn't about collecting places.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #9B8FFF 0%, #7560FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              It's about collecting moments.
            </span>
          </blockquote>
        </div>

        <div style={{ maxWidth: 640, paddingLeft: 40 }}>
          <p style={{ fontSize: 18, color: '#9897B8', lineHeight: 1.75, marginBottom: 24 }}>
            <strong style={{ color: '#F8F6FF' }}>Inspired by the way the world was meant to be explored.</strong>
          </p>
          <p style={{ fontSize: 16, color: '#9897B8', lineHeight: 1.8, marginBottom: 16 }}>
            Anthony Bourdain showed us that travel is about curiosity, connection, food, culture, and stories — not checklists and tourist traps.
          </p>
          <p style={{ fontSize: 16, color: '#9897B8', lineHeight: 1.8 }}>
            Drift exists to help people stop planning vacations and start creating experiences. Every itinerary is a story waiting to happen. Every destination is a world waiting to be felt.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─── App Section ────────────────────────────────────────── */
function PhoneScreen({
  icon,
  title,
  description,
  content,
}: {
  icon: string
  title: string
  description: string
  content: React.ReactNode
}) {
  return (
    <div style={{ textAlign: 'center', flexShrink: 0, width: 220 }}>
      <div className="phone-frame" style={{ margin: '0 auto 24px' }}>
        <div className="phone-screen">
          {content}
        </div>
        <div className="phone-tab-bar">
          {['🏠', '🔭', '✨', '🗺', '👤'].map((tab, i) => (
            <div key={i} style={{ fontSize: i === 2 ? 20 : 16, opacity: tab === icon ? 1 : 0.35 }}>{tab}</div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#F8F6FF', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13, color: '#9897B8', lineHeight: 1.6, maxWidth: 180, margin: '0 auto' }}>{description}</div>
    </div>
  )
}

function AppSection() {
  return (
    <section
      id="app"
      style={{
        padding: '100px 0',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #070712 0%, #0d0b25 50%, #070712 100%)',
      }}
    >
      <div style={{ textAlign: 'center', padding: '0 24px', marginBottom: 64 }}>
        <div className="section-label">✦ The App</div>
        <h2
          style={{
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            color: '#F8F6FF',
            marginBottom: 16,
          }}
        >
          Five screens.{' '}
          <span className="gradient-text">One complete platform.</span>
        </h2>
        <p style={{ fontSize: 16, color: '#9897B8', maxWidth: 480, margin: '0 auto' }}>
          Everything you need. Nothing you don't.
        </p>
      </div>

      <div className="phones-scroll">
        <PhoneScreen
          icon="🏠"
          title="Travel Feed"
          description="Every post is a complete adventure. One tap turns inspiration into your itinerary."
          content={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { name: 'Alex R.', dest: 'Tokyo, Japan', emoji: '🗼', saves: '438' },
                { name: 'Maria K.', dest: 'Amalfi Coast', emoji: '🌊', saves: '291' },
                { name: 'James L.', dest: 'Marrakech', emoji: '🕌', saves: '174' },
              ].map((post) => (
                <div
                  key={post.dest}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: 12,
                    padding: '10px 12px',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 8, background: 'rgba(117,96,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>
                      {post.emoji}
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#F8F6FF' }}>{post.name}</div>
                      <div style={{ fontSize: 9, color: '#9897B8' }}>{post.dest}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 9, color: '#7560FF' }}>View trip</span>
                    <span style={{ fontSize: 9, color: '#9897B8' }}>🔖 {post.saves}</span>
                  </div>
                </div>
              ))}
            </div>
          }
        />

        <PhoneScreen
          icon="🔭"
          title="Explore"
          description="Discover destinations, creators, hidden gems, and trending trips."
          content={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '8px 12px', fontSize: 10, color: '#9897B8', border: '1px solid rgba(255,255,255,0.07)' }}>
                🔍  Search destinations...
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {[
                  { label: '🏖 Beach', color: '#1a3a5c' },
                  { label: '🏔 Mountain', color: '#1a2a1a' },
                  { label: '🏛 Culture', color: '#2a1a3a' },
                  { label: '🍜 Food', color: '#3a2a0a' },
                ].map((cat) => (
                  <div
                    key={cat.label}
                    style={{
                      background: cat.color,
                      borderRadius: 10,
                      padding: '12px 8px',
                      fontSize: 10,
                      fontWeight: 600,
                      color: '#F8F6FF',
                      textAlign: 'center',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {cat.label}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 9, color: '#9897B8', marginTop: 4, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Trending Now</div>
              {['🌸 Kyoto in Spring', '🌊 Maldives Escape'].map((item) => (
                <div key={item} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px', fontSize: 10, color: '#F8F6FF', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {item}
                </div>
              ))}
            </div>
          }
        />

        <PhoneScreen
          icon="✨"
          title="AI Planner"
          description="Tell Drift your vibe. Get your perfect trip built around your personality."
          content={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#F8F6FF', marginBottom: 4 }}>Tell Drift your vibe.</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {[
                  { emoji: '🌴', label: 'Relaxing' },
                  { emoji: '🏔', label: 'Adventure' },
                  { emoji: '🏛', label: 'Cultural' },
                  { emoji: '✨', label: 'Luxury' },
                ].map((vibe) => (
                  <div
                    key={vibe.label}
                    style={{
                      background: 'rgba(117,96,255,0.12)',
                      border: '1px solid rgba(117,96,255,0.25)',
                      borderRadius: 10,
                      padding: '10px 6px',
                      textAlign: 'center',
                      fontSize: 10,
                      color: '#9B8FFF',
                      fontWeight: 600,
                    }}
                  >
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{vibe.emoji}</div>
                    {vibe.label}
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(117,96,255,0.08)', borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(117,96,255,0.2)', marginTop: 4 }}>
                <div style={{ fontSize: 9, color: '#9B8FFF', marginBottom: 4 }}>AI is building your trip...</div>
                <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{ width: '70%', height: '100%', background: 'linear-gradient(90deg, #7560FF, #9B8FFF)', borderRadius: 2 }} />
                </div>
              </div>
            </div>
          }
        />

        <PhoneScreen
          icon="🗺"
          title="Itinerary Builder"
          description="Day-by-day plan with live budget tracking and local recommendations."
          content={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                {['Day 1', 'Day 2', 'Day 3'].map((d, i) => (
                  <div
                    key={d}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 8,
                      fontSize: 10,
                      fontWeight: 600,
                      background: i === 0 ? 'rgba(117,96,255,0.3)' : 'rgba(255,255,255,0.05)',
                      color: i === 0 ? '#9B8FFF' : '#9897B8',
                      border: i === 0 ? '1px solid rgba(117,96,255,0.4)' : '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    {d}
                  </div>
                ))}
              </div>
              {[
                { time: '☕ Morning', activity: 'TeamLab Planets', type: 'Museum' },
                { time: '🥘 Lunch', activity: 'Ramen Ichiran', type: 'Restaurant' },
                { time: '🌅 Sunset', activity: 'Shibuya Sky', type: 'Experience' },
                { time: '🎶 Night', activity: 'Golden Gai', type: 'Nightlife' },
              ].map((item) => (
                <div key={item.activity} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: 12, width: 14 }}>{item.time.split(' ')[0]}</div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#F8F6FF' }}>{item.activity}</div>
                    <div style={{ fontSize: 9, color: '#9897B8' }}>{item.type}</div>
                  </div>
                </div>
              ))}
              <div style={{ background: 'rgba(117,96,255,0.08)', borderRadius: 8, padding: '8px 10px', marginTop: 4 }}>
                <div style={{ fontSize: 9, color: '#9897B8', marginBottom: 4 }}>Live Budget</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#F8F6FF' }}>$1,240 / $1,500</div>
                <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)', marginTop: 6, overflow: 'hidden' }}>
                  <div style={{ width: '82%', height: '100%', background: 'linear-gradient(90deg, #7560FF, #9B8FFF)', borderRadius: 2 }} />
                </div>
              </div>
            </div>
          }
        />

        <PhoneScreen
          icon="👤"
          title="My Trips"
          description="Your entire travel history in one place. Upcoming, saved, past."
          content={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                {['Upcoming', 'Saved', 'Past'].map((tab, i) => (
                  <div
                    key={tab}
                    style={{
                      padding: '3px 10px',
                      borderRadius: 8,
                      fontSize: 9,
                      fontWeight: 600,
                      background: i === 0 ? 'rgba(117,96,255,0.25)' : 'transparent',
                      color: i === 0 ? '#9B8FFF' : '#9897B8',
                      border: i === 0 ? '1px solid rgba(117,96,255,0.4)' : '1px solid transparent',
                    }}
                  >
                    {tab}
                  </div>
                ))}
              </div>
              {[
                { dest: 'Bali, Indonesia', dates: 'Aug 14–21', score: 88, emoji: '🌴' },
                { dest: 'Iceland', dates: 'Oct 5–12', score: 95, emoji: '🌋' },
              ].map((trip) => (
                <div
                  key={trip.dest}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: 12,
                    padding: '12px',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 18, marginBottom: 4 }}>{trip.emoji}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#F8F6FF' }}>{trip.dest}</div>
                      <div style={{ fontSize: 9, color: '#9897B8', marginTop: 2 }}>{trip.dates}</div>
                    </div>
                    <div style={{
                      width: 32, height: 32, borderRadius: 10,
                      background: 'rgba(117,96,255,0.2)', border: '1px solid rgba(117,96,255,0.35)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 800, color: '#9B8FFF',
                    }}>
                      {trip.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        />
      </div>
    </section>
  )
}

/* ─── Feature Grid ───────────────────────────────────────── */
function FeatureGrid() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.1 }
    )
    if (ref.current) {
      ref.current.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    }
    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: '📱',
      title: 'Travel Feed',
      description: 'Every post is a stealable adventure. Follow creators, get inspired, and one-tap any trip into yours.',
    },
    {
      icon: '✨',
      title: 'AI Planner',
      description: 'Trips built around your personality, pace, and budget. Not generic templates — your perfect trip.',
    },
    {
      icon: '🎯',
      title: 'Trip Score',
      description: 'A personal-fit score, not just reviews. How well does this trip match you, specifically?',
      extra: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: 'rgba(117,96,255,0.2)',
            border: '1px solid rgba(117,96,255,0.4)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#9B8FFF',
          }}>92</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#F8F6FF' }}>Perfect match</div>
            <div style={{ fontSize: 11, color: '#9897B8' }}>for your style</div>
          </div>
        </div>
      ),
    },
    {
      icon: '🌍',
      title: 'World Map',
      description: 'Every country you visit becomes a memory. Watch your map fill up as your story unfolds.',
    },
    {
      icon: '👥',
      title: 'Group Planning',
      description: 'Plan together. Vote on destinations. Split budgets. Make the trip a team effort.',
    },
    {
      icon: '🤝',
      title: 'Community',
      description: 'Travel with people who inspire you. Find your crew, join trips, build lasting connections.',
    },
  ]

  return (
    <section
      id="features"
      ref={ref}
      style={{ padding: '80px 24px 100px', maxWidth: 1200, margin: '0 auto' }}
    >
      <div style={{ textAlign: 'center', marginBottom: 64 }} className="reveal">
        <div className="section-label">✦ Features</div>
        <h2
          style={{
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            color: '#F8F6FF',
          }}
        >
          Built for real explorers
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}
      >
        {features.map((f, i) => (
          <div
            key={f.title}
            className="glass card-hover reveal"
            style={{
              borderRadius: 20,
              padding: '28px 24px',
              transitionDelay: `${i * 80}ms`,
            }}
          >
            <div className="feature-icon" style={{ marginBottom: 18 }}>{f.icon}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#F8F6FF', marginBottom: 10 }}>{f.title}</div>
            <div style={{ fontSize: 14, color: '#9897B8', lineHeight: 1.65 }}>{f.description}</div>
            {f.extra}
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Pricing ────────────────────────────────────────────── */
function Pricing() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.1 }
    )
    if (ref.current) ref.current.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="pricing" ref={ref} style={{ padding: '80px 24px 100px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 64 }} className="reveal">
        <div className="section-label">✦ Pricing</div>
        <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#F8F6FF', marginBottom: 16 }}>
          Choose your journey
        </h2>
        <p style={{ fontSize: 16, color: '#9897B8' }}>Start free. Upgrade when you're ready to go deeper.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Explorer */}
        <div
          className="glass card-hover reveal"
          style={{ borderRadius: 24, padding: '36px 32px', transitionDelay: '0ms' }}
        >
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#9897B8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Explorer</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 48, fontWeight: 900, color: '#F8F6FF', letterSpacing: '-0.03em' }}>$0</span>
              <span style={{ fontSize: 16, color: '#9897B8' }}>/month</span>
            </div>
            <div style={{ fontSize: 14, color: '#9897B8', marginTop: 8 }}>For curious travelers.</div>
          </div>

          <a
            href="#waitlist"
            className="btn-ghost"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '13px 24px',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              color: '#F8F6FF',
              textDecoration: 'none',
              marginBottom: 28,
            }}
          >
            Get Started Free
          </a>

          <ul className="check-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {['Travel Feed', 'Explore', '2 AI trips / month', 'Basic profile'].map(f => (
              <li key={f}>
                <span className="check">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Drift Plus */}
        <div
          className="glass pricing-popular card-hover reveal"
          style={{ borderRadius: 24, padding: '36px 32px', position: 'relative', transitionDelay: '100ms' }}
        >
          <div
            style={{
              position: 'absolute',
              top: -1,
              right: 28,
              background: 'linear-gradient(135deg, #7560FF, #9B8FFF)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              padding: '5px 14px',
              borderRadius: '0 0 10px 10px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Most Popular
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#9B8FFF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Drift Plus</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 48, fontWeight: 900, color: '#F8F6FF', letterSpacing: '-0.03em' }}>$7</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#9897B8', alignSelf: 'flex-start', paddingTop: 8 }}>.19</span>
              <span style={{ fontSize: 16, color: '#9897B8' }}>/month</span>
            </div>
            <div style={{ fontSize: 14, color: '#9897B8', marginTop: 8 }}>For people who never stop exploring.</div>
          </div>

          <a
            href="#waitlist"
            className="btn-primary"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '13px 24px',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              color: '#fff',
              textDecoration: 'none',
              marginBottom: 28,
            }}
          >
            Start Exploring →
          </a>

          <ul className="check-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              'Unlimited AI trips',
              'Trip Score',
              'World Map',
              'Group planning',
              'Offline itineraries',
              'Priority features',
            ].map(f => (
              <li key={f}>
                <span className="check">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ─── Final CTA ──────────────────────────────────────────── */
function FinalCTA() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section
      id="waitlist"
      className="cta-bg"
      style={{
        padding: '140px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="orb"
        style={{
          width: 700,
          height: 700,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(117,96,255,0.2) 0%, transparent 65%)',
          animation: 'float 10s ease-in-out infinite',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 640, margin: '0 auto' }}>
        <div className="section-label" style={{ marginBottom: 24 }}>✦ Join the Movement</div>

        <h2
          style={{
            fontSize: 'clamp(32px, 5vw, 64px)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            color: '#F8F6FF',
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          Everything is a win when the goal is to{' '}
          <span className="gradient-text">experience.</span>
        </h2>

        <p style={{ fontSize: 18, color: '#9897B8', lineHeight: 1.7, marginBottom: 48, maxWidth: 480, margin: '0 auto 48px' }}>
          Join the travelers building the future of exploration.
          Early access. No credit card required.
        </p>

        {submitted ? (
          <div
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              padding: '28px 40px',
              borderRadius: 20,
              background: 'rgba(117,96,255,0.15)',
              border: '1px solid rgba(117,96,255,0.35)',
            }}
          >
            <span style={{ fontSize: 36 }}>✈️</span>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#F8F6FF' }}>You're on the list!</div>
            <div style={{ fontSize: 14, color: '#9897B8' }}>We'll reach out when your early access is ready.</div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
              maxWidth: 520,
              margin: '0 auto',
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                flex: 1,
                minWidth: 260,
                padding: '15px 20px',
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
                color: '#F8F6FF',
                fontSize: 15,
                outline: 'none',
                backdropFilter: 'blur(12px)',
              }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{
                padding: '15px 28px',
                borderRadius: 14,
                fontSize: 15,
                fontWeight: 700,
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Get Early Access
            </button>
          </form>
        )}

        <p style={{ fontSize: 13, color: '#5C5A7A', marginTop: 20 }}>
          12,400+ explorers already joined · No spam, ever
        </p>
      </div>
    </section>
  )
}

/* ─── Footer ─────────────────────────────────────────────── */
function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '48px 24px',
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 32,
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em', color: '#F8F6FF', marginBottom: 8 }}>
            DRIFT
          </div>
          <div style={{ fontSize: 14, color: '#9897B8', maxWidth: 220, lineHeight: 1.6 }}>
            The AI-powered travel community for explorers.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
          {[
            { label: 'Product', links: ['Features', 'Pricing', 'App'] },
            { label: 'Community', links: ['Explore', 'Feed', 'Creators'] },
            { label: 'Company', links: ['About', 'Blog', 'Contact'] },
          ].map((group) => (
            <div key={group.label}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#5C5A7A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
                {group.label}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {group.links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    style={{ fontSize: 14, color: '#9897B8', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#F8F6FF')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#9897B8')}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: 48,
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ fontSize: 13, color: '#5C5A7A' }}>
          © {new Date().getFullYear()} Drift. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'Cookies'].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: '#5C5A7A', textDecoration: 'none' }}>
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

/* ─── Page ───────────────────────────────────────────────── */
export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Mission />
        <AppSection />
        <FeatureGrid />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
