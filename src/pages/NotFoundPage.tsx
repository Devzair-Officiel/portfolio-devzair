import { Link } from 'react-router-dom'

export const NotFoundPage = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl text-gray-500">Cette page n'existe pas.</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Retour à l'accueil
      </Link>
    </main>
  )
}
