import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ProjectCard } from '@/components'
import { useProjects } from '@/hooks'
import type { ProjectType } from '@/types'

const ACCENT_COLORS = ['#8b5cf6', '#06b6d4', '#f43f5e', '#f59e0b', '#34d399', '#a78bfa']
const SIDE_ROTATE   = 25
const SIDE_SCALE    = 0.82
const SIDE_OPACITY  = 0.72

/* ── CarouselItem ─────────────────────────────────────────────
   Chaque carte dérive ses transforms en temps réel depuis
   carouselPos (MotionValue<float>). Pas de re-render React
   pendant le drag — tout passe par Framer Motion.
──────────────────────────────────────────────────────────────── */
interface ItemProps {
  project: ProjectType
  idx: number
  active: number          // committed active (pour pointer-events)
  n: number
  carouselPos: MotionValue<number>
  cardW: number
  sideX: number
  accent: string
  onNavigateTo: (idx: number) => void
}

const CarouselItem = ({ project, idx, active, n, carouselPos, cardW, sideX, accent, onNavigateTo }: ItemProps) => {
  // floatPos = position relative au centre (0 = active, ±1 = côté, ...)
  const floatPos = useTransform(carouselPos, val => {
    let p = idx - val
    p -= Math.round(p / n) * n   // wrap correct quel que soit le nombre de tours
    return p
  })

  const x       = useTransform(floatPos, p => p * sideX)
  const rotY    = useTransform(floatPos, p => Math.max(-SIDE_ROTATE, Math.min(SIDE_ROTATE, p * SIDE_ROTATE)))
  const scale   = useTransform(floatPos, p => 1 - (1 - SIDE_SCALE) * Math.min(Math.abs(p), 1))
  const opacity = useTransform(floatPos, p => {
    const a = Math.abs(p)
    if (a <= 1)   return 1 - (1 - SIDE_OPACITY) * a
    if (a <= 1.7) return SIDE_OPACITY * (1.7 - a) / 0.7
    return 0
  })
  const zIdx = useTransform(floatPos, p => Math.round(10 - Math.abs(p) * 5))

  // Utilise active (discret) pour les pointer-events — pas de re-render pendant le drag
  let dp = idx - active
  if (dp >  n / 2) dp -= n
  if (dp < -n / 2) dp += n
  const isActive = dp === 0
  const isSide   = Math.abs(dp) === 1

  return (
    <motion.div
      className="absolute"
      style={{
        width: cardW, height: '100%',
        left: '50%', marginLeft: -cardW / 2,
        transformStyle: 'preserve-3d',
        x: x, rotateY: rotY, scale, opacity, zIndex: zIdx,
        cursor: isSide ? 'pointer' : 'grab',
      }}
      onClick={() => !isActive && onNavigateTo(idx)}
    >
      {isActive && (
        <div
          className="absolute bottom-0 left-6 right-6 h-10 blur-2xl pointer-events-none"
          style={{ background: accent + '55', transform: 'translateY(16px)' }}
        />
      )}
      <div style={{ height: '100%', pointerEvents: isActive ? 'auto' : 'none' }}>
        <ProjectCard project={project} accentColor={accent} index={idx} isActive={isActive} />
      </div>
    </motion.div>
  )
}

/* ── Section Projects ─────────────────────────────────────────── */
export const Projects = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr'
  const { projects, loading, error } = useProjects()

  const [active, setActive] = useState(0)
  const [cardW,  setCardW]  = useState(380)
  const [sideX,  setSideX]  = useState(365)

  // carouselPos est le float continu ; committed = l'index validé
  const carouselPos = useMotionValue(0)
  const committed   = useRef(0)        // active index sans attendre React
  const animCtrl    = useRef<{ stop: () => void } | null>(null)

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth
      if (vw < 640)       { setCardW(Math.min(vw - 32, 300)); setSideX(vw * 0.75) }
      else if (vw < 1024) { setCardW(330); setSideX(295) }
      else                { setCardW(380); setSideX(365) }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const n = projects.length
  useEffect(() => { if (n > 0) { committed.current = 0; setActive(0); carouselPos.set(0) } }, [n])

  /* navigateTo : spring fluide vers la carte cible */
  const navigateTo = useCallback((target: number) => {
    let delta = target - committed.current
    if (delta >  n / 2) delta -= n
    if (delta < -n / 2) delta += n
    committed.current = target
    setActive(target)
    if (animCtrl.current) animCtrl.current.stop()
    animCtrl.current = animate(carouselPos, carouselPos.get() + delta, {
      type: 'spring', stiffness: 380, damping: 36, mass: 0.8,
    })
  }, [carouselPos, n])

  const prev = () => navigateTo(((committed.current - 1) + n) % n)
  const next = () => navigateTo((committed.current + 1) % n)

  /* ── Drag : suit la souris pixel-par-pixel ────────────────── */
  const dragStartX  = useRef<number | null>(null)
  const dragBasePos = useRef(0)

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (animCtrl.current) animCtrl.current.stop()
    dragStartX.current  = e.clientX
    dragBasePos.current = carouselPos.get()
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return
    carouselPos.set(dragBasePos.current - (e.clientX - dragStartX.current) / cardW)
  }

  const onPointerUp = () => {
    if (dragStartX.current === null) return
    dragStartX.current = null
    const rounded   = Math.round(carouselPos.get())
    const newActive = ((rounded % n) + n) % n
    committed.current = newActive
    setActive(newActive)
    animCtrl.current = animate(carouselPos, rounded, {
      type: 'spring', stiffness: 400, damping: 40, mass: 0.7,
    })
  }


  /* ── Bouton ───────────────────────────────────────────────── */
  const NavBtn = ({ dir }: { dir: 1 | -1 }) => (
    <button
      onClick={dir === 1 ? next : prev}
      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
    >
      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d={dir === -1 ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
      </svg>
    </button>
  )

  return (
    <section className="py-16 sm:py-32 overflow-hidden">

      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 text-center mb-12 sm:mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="section-label mb-4">{lang === 'en' ? 'Selected work' : 'Mes projets'}</p>
        <h2
          className="text-4xl sm:text-5xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
        >
          {t('projects.title')}
        </h2>
      </motion.div>

      {loading && (
        <div className="flex justify-center">
          <div className="rounded-2xl animate-pulse" style={{ width: cardW, height: 460, background: 'var(--surface)', border: '1px solid var(--border)' }} />
        </div>
      )}
      {error && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-sm px-5 py-3 rounded-xl" style={{ background: 'rgba(244,63,94,0.08)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)' }}>
            Impossible de charger les projets.
          </p>
        </div>
      )}

      {!loading && !error && n > 0 && (
        <>
          <div
            className="relative mx-auto select-none"
            style={{ perspective: '1800px', height: 500, touchAction: 'pan-y' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}

          >
            {projects.map((project, idx) => (
              <CarouselItem
                key={project.id}
                project={project}
                idx={idx}
                active={active}
                n={n}
                carouselPos={carouselPos}
                cardW={cardW}
                sideX={sideX}
                accent={ACCENT_COLORS[idx % ACCENT_COLORS.length]}
                onNavigateTo={navigateTo}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <NavBtn dir={-1} />
            <div className="flex items-center gap-2">
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => navigateTo(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    height: '6px',
                    width: i === active ? '28px' : '6px',
                    background: i === active ? 'var(--color-brand)' : 'var(--border)',
                  }}
                  aria-label={`Projet ${i + 1}`}
                />
              ))}
            </div>
            <NavBtn dir={1} />
          </div>
        </>
      )}
    </section>
  )
}
