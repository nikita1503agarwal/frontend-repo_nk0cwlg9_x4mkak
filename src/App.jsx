import React, { useEffect, useRef, useState } from 'react'
import Spline from '@splinetool/react-spline'
import './index.css'

function App() {
  const headerRef = useRef(null)
  const menuRef = useRef(null)
  const canvasRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  // Header reveal on first scroll and on mount
  useEffect(() => {
    const h = headerRef.current
    const onScroll = () => {
      if (!h) return
      h.classList.add('visible')
      // Also close mobile menu on scroll
      setMenuOpen(false)
      if (menuRef.current) menuRef.current.classList.remove('open')
    }
    // initial show
    requestAnimationFrame(() => h && h.classList.add('visible'))
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Mobile menu toggle
  useEffect(() => {
    if (!menuRef.current) return
    if (menuOpen) menuRef.current.classList.add('open')
    else menuRef.current.classList.remove('open')
  }, [menuOpen])

  // Intersection reveal animations
  useEffect(() => {
    const sr = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('show')
        })
      },
      { threshold: 0.18 }
    )
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => sr.observe(el))
    return () => sr.disconnect()
  }, [])

  // Simple particle background for hero
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w, h, dpr, raf
    const particles = []
    const COUNT = 70

    const rand = (a, b) => a + Math.random() * (b - a)

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.8)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    class P {
      constructor() {
        this.reset(true)
      }
      reset(first = false) {
        this.x = first ? rand(0, canvas.clientWidth) : Math.random() < 0.5 ? 0 : canvas.clientWidth
        this.y = rand(0, canvas.clientHeight)
        const speed = rand(0.2, 0.7)
        const dir = Math.random() < 0.5 ? 1 : -1
        this.vx = speed * dir
        this.vy = rand(-0.25, 0.25)
        this.size = rand(0.6, 1.8)
        this.alpha = rand(0.25, 0.8)
        this.hue = Math.random() < 0.5 ? 188 : 215
      }
      step() {
        this.x += this.vx
        this.y += this.vy
        if (this.x < -20 || this.x > canvas.clientWidth + 20 || this.y < -20 || this.y > canvas.clientHeight + 20) this.reset()
      }
      draw() {
        ctx.beginPath()
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 24)
        const color = `hsla(${this.hue}, 100%, 60%, ${this.alpha})`
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = gradient
        ctx.arc(this.x, this.y, this.size * 2.4, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const init = () => {
      particles.length = 0
      for (let i = 0; i < COUNT; i++) particles.push(new P())
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // subtle grid lines
      ctx.globalAlpha = 0.07
      ctx.strokeStyle = '#1b2640'
      for (let x = 0; x < canvas.clientWidth; x += 48) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.clientHeight); ctx.stroke()
      }
      for (let y = 0; y < canvas.clientHeight; y += 48) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.clientWidth, y); ctx.stroke()
      }
      ctx.globalAlpha = 1
      particles.forEach((p) => { p.step(); p.draw() })
      raf = requestAnimationFrame(tick)
    }

    const onResize = () => { resize(); init() }
    resize(); init(); tick()
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])

  // Testimonials slider
  const [slide, setSlide] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % 3), 5000)
    return () => clearInterval(id)
  }, [])

  const goTo = (i) => setSlide(i)

  return (
    <div id="home">
      {/* Header */}
      <header ref={headerRef} className="header">
        <div className="container nav">
          <a href="#home" className="logo" aria-label="Company home">
            <img src="https://dummyimage.com/72x72/00e5ff/000.png&text=∎" alt="Logo" />
            <span>NovaDigital</span>
          </a>
          <nav ref={menuRef} className="menu">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#why">About</a>
            <a href="#contact">Contact</a>
          </nav>
          <button className="hamburger" aria-label="Toggle menu" onClick={() => setMenuOpen((v) => !v)}>
            <span />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="spline-wrap" aria-hidden>
          <Spline scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        </div>
        <canvas ref={canvasRef} className="hero-canvas" />
        <div className="bg-overlay" />
        <div className="hero-content reveal">
          <h1>Next-Generation Digital Solutions</h1>
          <p>
            Customized online management systems, web development, mobile apps, graphic design, Shopify builds and more — crafted with precision and powered by cutting‑edge tech.
          </p>
          <div className="actions">
            <a href="#contact" className="btn primary">Get Started</a>
            <a href="#services" className="btn ghost">See Our Work</a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="section">
        <div className="container">
          <h2 className="reveal">Our Services</h2>
          <p className="lead reveal">Strategic, scalable, and future‑proof solutions designed for real business impact.</p>
          <div className="services-grid">
            {[
              {
                title: 'Customized Online Management Systems',
                desc: 'Tailored dashboards, automation and analytics that fit your exact workflow and grow with you.',
              },
              {
                title: 'Web Development',
                desc: 'High‑performance sites with modern architectures, accessibility, and SEO baked in.',
              },
              {
                title: 'Graphic Design',
                desc: 'Brand identities, UI assets, and visuals that communicate clearly and look stunning.',
              },
              {
                title: 'Mobile App Development',
                desc: 'iOS and Android experiences that are fast, intuitive, and delightful to use.',
              },
              {
                title: 'Shopify Store Development',
                desc: 'Conversion‑focused storefronts with custom themes, apps, and integrations.',
              },
            ].map((s, i) => (
              <article className="service-card reveal" key={i}>
                <div className="service-icon">
                  <img src={`https://dummyimage.com/48x48/${i % 2 === 0 ? '00e5ff' : '1a75ff'}/000.png&text=✦`} alt="" />
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why" className="section">
        <div className="container">
          <h2 className="reveal">Why Choose Us</h2>
          <p className="lead reveal">We pair design excellence with robust engineering for results you can measure.</p>
          <div className="why-grid">
            {[
              {
                title: 'Tailored Digital Solutions',
                desc: 'Every build is custom‑fit to your goals, workflows, and scale.',
              },
              {
                title: 'Cutting‑Edge Technologies',
                desc: 'Modern stacks and best practices from infrastructure to UI.',
              },
              {
                title: 'Fast Delivery',
                desc: 'Adaptive sprints and clear milestones keep momentum high.',
              },
              {
                title: 'Professional Support',
                desc: 'We partner long‑term with proactive maintenance and insights.',
              },
            ].map((w, i) => (
              <div key={i} className={`why-item ${i % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}>
                <div className="why-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
                  </svg>
                </div>
                <div>
                  <h4>{w.title}</h4>
                  <p>{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <h2 className="reveal">What Clients Say</h2>
          <p className="lead reveal">Trusted by startups and enterprises for quality, speed, and reliability.</p>
          <div className="slider reveal">
            <div className="slides" style={{ transform: `translateX(-${slide * 100}%)` }}>
              {[ 
                { name: 'Avery C.', text: 'They translated our complex operations into a clean system our whole team loves. Delivery was ahead of schedule and support is top‑notch.' },
                { name: 'Jordan M.', text: 'Our new website is blazing fast and conversions jumped within weeks. The process was collaborative and crystal clear.' },
                { name: 'Samira P.', text: 'From design to mobile app, the craftsmanship shows. We finally have a product that feels premium and performs flawlessly.' },
              ].map((t, i) => (
                <div className="slide" key={i}>
                  <div className="avatar" aria-hidden />
                  <div className="content">
                    <h4>{t.name}</h4>
                    <p>“{t.text}”</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="slider-controls">
              {[0,1,2].map((i) => (
                <button aria-label={`Go to slide ${i+1}`} key={i} className={`dot ${slide===i ? 'active' : ''}`} onClick={() => goTo(i)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="section">
        <div className="container">
          <div className="cta reveal">
            <h3>Let’s Build Something Amazing Together</h3>
            <p>Tell us about your challenge and we’ll craft a solution that elevates your business.</p>
            <div>
              <a className="btn primary" href="mailto:hello@novadigital.example">Contact Us</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="logo" style={{gap: 10}}>
            <img src="https://dummyimage.com/72x72/12FEDD/000.png&text=∎" alt="Logo" />
            <strong>NovaDigital</strong>
          </div>
          <div className="quick">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="social">
            <a href="#" aria-label="Twitter" title="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M22 5.8c-.7.3-1.4.5-2.1.6.8-.5 1.3-1.2 1.6-2.1-.7.5-1.6.8-2.4 1-1.4-1.5-3.8-1.4-5.1.1-1 1.1-1.2 2.7-.6 4-3.1-.2-5.9-1.7-7.8-4.1-1 1.8-.5 4.1 1.2 5.2-.6 0-1.1-.2-1.6-.5 0 2.1 1.5 3.9 3.5 4.3-.4.1-.8.1-1.2 0 .4 1.7 2 2.9 3.8 2.9-1.4 1.1-3.1 1.7-4.8 1.7H2c1.8 1.1 3.9 1.7 6 1.7 7.2 0 11.2-6 11.2-11.2v-.5c.8-.5 1.4-1.2 1.8-2z"/>
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn" title="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V23h-4v-7.3c0-1.7 0-3.8-2.3-3.8-2.3 0-2.7 1.8-2.7 3.7V23h-4V8.5z"/>
              </svg>
            </a>
            <a href="#" aria-label="GitHub" title="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 .5C5.7.5.8 5.4.8 11.7c0 4.9 3.1 9 7.5 10.5.6.1.8-.3.8-.6v-2.1c-3.1.7-3.8-1.3-3.8-1.3-.5-1.2-1.2-1.6-1.2-1.6-1-.6.1-.6.1-.6 1.1.1 1.7 1.1 1.7 1.1 1 .1.9-1 .9-1 0-1.2-.8-1.6-.8-1.6-2.5-.2-3.7-1.3-3.7-3.3 0-.8.3-1.5.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .8-.2 2.2.8.7-.2 1.5-.3 2.2-.3s1.5.1 2.2.3c1.4-1 2.2-.8 2.2-.8.5 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 2-1.2 3.1-3.7 3.3 0 0-.8.4-.8 1.6 0 .7 0 1.6 0 1.8v2.7c0 .3.2.7.8.6 4.4-1.5 7.5-5.6 7.5-10.5C23.2 5.4 18.3.5 12 .5z"/>
              </svg>
            </a>
          </div>
        </div>
        <div style={{ textAlign: 'center', color: '#9fb3c8', fontSize: 13, marginTop: 10 }}>© {new Date().getFullYear()} NovaDigital. All rights reserved.</div>
      </footer>
    </div>
  )
}

export default App
