import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

interface FormState { name: string; email: string; message: string }
type Status = 'idle' | 'loading' | 'success' | 'error'

export const Contact = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr'
  const [form, setForm]     = useState<FormState>({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')

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

  return (
    <section id="contact" className="py-24 px-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        className="flex flex-col gap-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55 }}
      >
        <span className="section-label">// contact</span>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--text)',
            lineHeight: 1.15,
          }}
        >
          {t('contact.subtitle')}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Panneau infos */}
        <motion.div
          className="md:col-span-2 flex flex-col gap-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
        >
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: '15px', lineHeight: 1.7 }}>
            {lang === 'fr'
              ? "Une idée de projet, une question, ou juste envie de discuter ? N'hésitez pas."
              : "A project idea, a question, or just want to chat? Feel free to reach out."}
          </p>

          <div className="flex flex-col gap-4">
            {[
              { label: 'Email', value: 'contact@devzair.fr', href: 'mailto:contact@devzair.fr', color: '#818cf8' },
              { label: 'GitHub', value: 'devzair-officiel', href: 'https://github.com/Devzair-Officiel', color: '#67e8f9' },
            ].map(item => (
              <div key={item.label} className="flex flex-col gap-1">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {item.label}
                </span>
                <a
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{ color: item.color, fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500 }}
                  onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                >
                  {item.value}
                </a>
              </div>
            ))}

            <div className="flex items-center gap-2 mt-2">
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#4ade80',
                  boxShadow: '0 0 6px #4ade80',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
                {lang === 'fr' ? 'Disponible · Réponse < 24h' : 'Available · Response < 24h'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Formulaire */}
        <motion.div
          className="md:col-span-3"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {lang === 'fr' ? 'Nom' : 'Name'}
                </label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder={t('contact.name_placeholder')}
                  className="field"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Email
                </label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder={t('contact.email_placeholder')}
                  className="field"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
                Message
              </label>
              <textarea
                name="message" value={form.message} onChange={handleChange}
                placeholder={t('contact.message_placeholder')}
                rows={7}
                className="field"
                style={{ resize: 'none' }}
              />
            </div>

            {status === 'success' && (
              <p style={{ fontSize: '13px', color: '#4ade80', fontFamily: 'var(--font-sans)' }}>
                ✓ {t('contact.success')}
              </p>
            )}
            {status === 'error' && (
              <p style={{ fontSize: '13px', color: '#f87171', fontFamily: 'var(--font-sans)' }}>
                {t('contact.error')}
              </p>
            )}

            <div className="flex justify-end">
              <motion.button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary disabled:opacity-50 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {status === 'loading'
                  ? (lang === 'fr' ? 'Envoi...' : 'Sending...')
                  : t('contact.submit')}
                {status !== 'loading' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
