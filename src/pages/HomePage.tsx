import { Background, Navbar, Marquee } from '@/components'
import { Hero, Skills, Projects, Experience, Contact } from '@/sections'

export const HomePage = () => {
  return (
    <>
      <Background />
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Marquee />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </>
  )
}
