import { Background, Navbar } from '@/components'
import { Hero, Skills, Projects, Experience, Contact } from '@/sections'

export const HomePage = () => {
  return (
    <>
      <Background />
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </>
  )
}
