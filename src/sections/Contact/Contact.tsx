import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

interface FormState { name: string; email: string; message: string }
type Status = 'idle' | 'loading' | 'success' | 'error'

export const Contact = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr'
  const [form, setForm]       = useState<FormState>({ name: '', email: '', message: '' })
  const [focused, setFocused] = useState<string | null>(null)
  const [status, setStatus]   = useState<Status>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch(`${API_URL}/api/v1/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const fieldStyle = (name: string): React.CSSProperties => ({
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    backgroundColor: 'var(--surface)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: `1px solid ${focused === name ? 'rgba(139,92,246,0.5)' : 'var(--border)'}`,
    boxShadow: focused === name ? '0 0 0 3px rgba(139,92,246,0.1)' : 'none',
    color: 'var(--text)',
  })

  return (
    <section id="contact" className="py-24 px-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="section-label mb-3">// contact</p>
        <h2
          className="gradient-text-alt"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          {t('contact.subtitle')}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Panneau infos */}
        <motion.div
          className="md:col-span-2 flex flex-col gap-6"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="glass-card p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Email
              </span>
              <a
                href="mailto:contact@devzair.fr"
                style={{ color: '#c4b5fd', fontSize: '14px', fontWeight: 500, fontFamily: 'var(--font-sans)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#a78bfa')}
                onMouseLeave={e => (e.currentTarget.style.color = '#c4b5fd')}
              >
                contact@devzair.fr
              </a>
            </div>

            <div style={{ height: '1px', background: 'var(--border)' }} />

            <div className="flex flex-col gap-1">
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                GitHub
              </span>
              <a
                href="https://github.com/Devzair-Officiel"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#67e8f9', fontSize: '14px', fontWeight: 500, fontFamily: 'var(--font-sans)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#22d3ee')}
                onMouseLeave={e => (e.currentTarget.style.color = '#67e8f9')}
              >
                devzair-officiel
              </a>
            </div>
          </div>

          {/* Badge disponibilité */}
          <div
            className="glass-card p-5"
            style={{
              borderImage: 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(6,182,212,0.4)) 1',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: '18px',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#4ade80',
                  boxShadow: '0 0 8px #4ade80',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                {lang === 'fr' ? 'Disponible' : 'Available'}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}>
              {lang === 'fr'
                ? 'Réponse garantie en moins de 24h. Ouvert aux missions freelance et collaborations.'
                : 'Response guaranteed in less than 24h. Open to freelance missions and collaborations.'}
            </p>
          </div>
        </motion.div>

        {/* Formulaire */}
        <motion.div
          className="md:col-span-3"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="glass-card p-8 flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  {lang === 'fr' ? 'Nom' : 'Name'}
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  placeholder={t('contact.name_placeholder')}
                  style={fieldStyle('name')}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  placeholder={t('contact.email_placeholder')}
                  style={fieldStyle('email')}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                onFocus={() => setFocused('message')}
                onBlur={() => setFocused(null)}
                placeholder={t('contact.message_placeholder')}
                rows={7}
                style={{ ...fieldStyle('message'), resize: 'none' }}
              />
            </div>

            {status === 'success' && (
              <p style={{ fontSize: '13px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>
                ✓ {t('contact.success')}
              </p>
            )}
            {status === 'error' && (
              <p style={{ fontSize: '13px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
                {t('contact.error')}
              </p>
            )}

            <div className="flex justify-end">
              <motion.button
                type="submit"
                disabled={status === 'loading'}
                className="btn-gradient px-8 py-3 cursor-pointer disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>
                  {status === 'loading'
                    ? (lang === 'fr' ? 'Envoi…' : 'Sending…')
                    : t('contact.submit')}
                </span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
