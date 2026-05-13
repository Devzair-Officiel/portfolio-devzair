import type { SkillType } from '@/types'

export const skills: SkillType[] = [
  // Frontend
  { name: 'HTML',         category: 'frontend', icon: 'SiHtml5',       color: '#e34f26' },
  { name: 'CSS',          category: 'frontend', icon: 'SiCss',         color: '#1572b6' },
  { name: 'SCSS',         category: 'frontend', icon: 'SiSass',        color: '#cc6699' },
  { name: 'Bootstrap',    category: 'frontend', icon: 'SiBootstrap',   color: '#7952b3' },
  { name: 'Tailwind CSS', category: 'frontend', icon: 'SiTailwindcss', color: '#06b6d4' },
  { name: 'JavaScript',   category: 'frontend', icon: 'SiJavascript',  color: '#f7df1e' },
  { name: 'TypeScript',   category: 'frontend', icon: 'SiTypescript',  color: '#3178c6' },
  { name: 'Vue.js',       category: 'frontend', icon: 'SiVuedotjs',    color: '#42b883' },
  { name: 'React',        category: 'frontend', icon: 'SiReact',       color: '#61dafb' },
  // Backend
  { name: 'PHP',          category: 'backend',  icon: 'SiPhp',         color: '#777bb4' },
  { name: 'Symfony',      category: 'backend',  icon: 'SiSymfony',     color: '#a0aec0' },
  // DevOps / Outils
  { name: 'Docker',       category: 'devops',   icon: 'SiDocker',      color: '#2496ed' },
  { name: 'Git',          category: 'devops',   icon: 'SiGit',         color: '#f05032' },
  { name: 'Caddy',        category: 'devops',   icon: 'SiCaddy',       color: '#00acd7' },
  // En cours
  { name: 'Python',       category: 'learning', icon: 'SiPython',      color: '#3776ab' },
]
