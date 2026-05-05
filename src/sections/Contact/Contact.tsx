import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { fadeUp, staggerContainer } from '@/utils/animations'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

interface FormState {
  name: string
  email: string
  message: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export const Contact = () => {
  const { t } = useTranslation()
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [focused, setFocused] = useState<string | null>(null)
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

  const fieldStyle = (name: string) => ({
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    backgroundColor: 'var(--surface-card)',
    backdropFilter: 'var(--glass)',
    WebkitBackdropFilter: 'var(--glass)',
    border: `1px solid ${focused === name ? 'rgba(124,111,255,0.6)' : 'var(--border)'}`,
    boxShadow: focused === name ? '0 0 0 3px rgba(124,111,255,0.1)' : 'none',
    color: 'var(--text)',
  })

  return (
    <section id="contact" className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        className="text-center mb-16"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-brand mb-3">
          {t('contact.title')}
        </p>
        <h2 className="text-4xl sm:text-5xl font-extrabold" style={{ color: 'var(--text)' }}>
          {t('contact.subtitle')}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

        {/* Colonne info */}
        <motion.div
          className="md:col-span-2 flex flex-col gap-8 justify-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Email</p>
            <a
              href="mailto:contact@devzair.fr"
              className="text-sm font-medium transition-colors duration-200 text-brand"
            >
              contact@devzair.fr
            </a>
          </div>

          <div
            className="w-full h-px"
            style={{ backgroundColor: 'var(--border)' }}
          />

          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>GitHub</p>
            <a
              href="https://github.com/Devzair-Officiel"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium transition-colors duration-200 text-brand"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.755-1.755-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23A11.52 11.52 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Devzair-Officiel
            </a>
          </div>

          <div
            className="w-full h-px"
            style={{ backgroundColor: 'var(--border)' }}
          />

          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Disponible pour des missions freelance, des projets sur mesure ou une collaboration à long terme.
          </p>
        </motion.div>

        {/* Formulaire */}
        <motion.form
          onSubmit={handleSubmit}
          className="md:col-span-3 flex flex-col gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <motion.div className="flex flex-col gap-1.5" variants={fadeUp}>
              <label className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
                {t('contact.name')}
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
            </motion.div>

            <motion.div className="flex flex-col gap-1.5" variants={fadeUp}>
              <label className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
                {t('contact.email')}
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
            </motion.div>
          </div>

          <motion.div className="flex flex-col gap-1.5" variants={fadeUp}>
            <label className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
              {t('contact.message')}
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
          </motion.div>

          {status === 'success' && (
            <motion.p
              variants={fadeUp}
              className="text-sm px-4 py-3 rounded-xl"
              style={{ background: '#34d39922', color: '#34d399', border: '1px solid #34d39944' }}
            >
              {t('contact.success')}
            </motion.p>
          )}
          {status === 'error' && (
            <motion.p
              variants={fadeUp}
              className="text-sm px-4 py-3 rounded-xl"
              style={{ background: '#f8717122', color: '#f87171', border: '1px solid #f8717144' }}
            >
              {t('contact.error')}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={status === 'loading'}
            className="self-end px-8 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 cursor-pointer disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #7c6fff, #a78bfa)',
              boxShadow: 'var(--glow-md)',
            }}
            variants={fadeUp}
            whileHover={{ boxShadow: '0 0 36px #7c6fff66' }}
          >
            {status === 'loading' ? '…' : `${t('contact.submit')} →`}
          </motion.button>
        </motion.form>
      </div>
    </section>
  )
}
