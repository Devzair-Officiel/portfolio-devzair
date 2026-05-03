import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { LogoPlaceholder } from '@/components'
import { fadeUp, staggerContainer } from '@/utils/animations'

export const Hero = () => {
  const { t } = useTranslation()

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center gap-8 px-6 text-center"
    >
      <motion.div
        className="flex flex-col items-center gap-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp}>
          <LogoPlaceholder />
        </motion.div>

        <motion.div className="flex flex-col gap-3" variants={fadeUp}>
          <p className="text-brand font-semibold tracking-widest uppercase text-sm">
            {t('hero.label')}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold" style={{ color: 'var(--text)' }}>
            {t('hero.name')}
          </h1>
          <h2 className="text-xl sm:text-2xl font-medium" style={{ color: 'var(--text-muted)' }}>
            {t('hero.title')}
          </h2>
        </motion.div>

        <motion.p
          className="max-w-xl text-base sm:text-lg leading-relaxed"
          style={{ color: 'var(--text-muted)' }}
          variants={fadeUp}
        >
          {t('hero.tagline')}
        </motion.p>

        <motion.div className="flex flex-wrap gap-4 justify-center" variants={fadeUp}>
          <a
            href="https://github.com/devzair-officiel"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-brand hover:bg-brand-dark text-white font-semibold transition-colors duration-200"
          >
            {t('hero.cta_github')}
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded-xl border font-semibold transition-colors duration-200"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            {t('hero.cta_contact')}
          </a>
        </motion.div>
      </motion.div>

      <motion.a
        href="#skills"
        aria-label={t('hero.scroll_label')}
        className="absolute bottom-8 transition-colors duration-200"
        style={{ color: 'var(--text-muted)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1, duration: 0.6 } }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.a>
    </section>
  )
}
