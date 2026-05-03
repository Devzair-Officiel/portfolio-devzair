import type { ProjectType } from '@/types'

export const projects: ProjectType[] = [
  {
    id: 1,
    title: 'Nidemiel',
    description:
      'Site e-commerce de vente de miel. Catalogue produits, panier et gestion des commandes.',
    stack: ['Symfony 8', 'Twig', 'JavaScript', 'EasyAdmin', 'PostgreSQL', 'Docker'],
    liveUrl: 'https://nidemiel.com',
  },
  {
    id: 2,
    title: 'Admin e-commerce démo',
    description:
      'Back-office complet : gestion des commandes, produits, clients et expéditions. Accès libre sans compte.',
    stack: ['Symfony 8', 'EasyAdmin', 'PostgreSQL', 'Docker'],
    liveUrl: 'https://commerce-demo.devzair.fr/',
  },
  {
    id: 3,
    title: 'Kitchen Meat',
    description: 'Site vitrine pour un restaurant de viande à Lyon.',
    stack: ['HTML', 'SCSS'],
    liveUrl: 'https://kitchenmeat.fr/',
  },
  {
    id: 4,
    title: 'Institut Taxi',
    description: "Site vitrine pour une école de formation au métier de taxi.",
    stack: ['Vue.js'],
    liveUrl: 'https://institut-taxi.fr/',
  },
]
