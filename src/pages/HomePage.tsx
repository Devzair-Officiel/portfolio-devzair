import { motion, useScroll, useTransform } from 'framer-motion'
import { Background, Navbar, Marquee } from '@/components'
import { Hero, Skills, Projects, Experience, Contact } from '@/sections'

const WaveDecoration = () => {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 500], [1, 0])

  return (
    <>
      {/* Desktop — ancré en bas */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none hidden sm:block" style={{ zIndex: 1 }}>
        <motion.img
          src="/vague.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="select-none w-full"
          style={{ opacity, mixBlendMode: 'screen', filter: 'opacity(0.4)', display: 'block' }}
        />
      </div>

      {/* Mobile — couvre tout le wrapper */}
      <div className="absolute inset-0 pointer-events-none block sm:hidden" style={{ zIndex: 1 }}>
        <motion.img
          src="/vague_mobile.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="select-none w-full h-full"
          style={{ opacity, mixBlendMode: 'screen', filter: 'opacity(0.18)', objectFit: 'cover', objectPosition: 'top' }}
        />
      </div>
    </>
  )
}

export const HomePage = () => {
  return (
    <>
      <Background />
      <Navbar />
      <main className="pt-16">

        <div className="relative">
          <div className="relative" style={{ zIndex: 2 }}>
            <Hero />
            <Marquee />
          </div>
          <WaveDecoration />
        </div>

        <Skills />

        <div className="relative isolate">
          <img
            src="/line.webp"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="pointer-events-none select-none"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'fill',
              opacity: 0.85,
              mixBlendMode: 'screen',
              zIndex: -1,
            }}
          />
          <Projects />
          <Experience />
        </div>

        <Contact />
      </main>
    </>
  )
}
