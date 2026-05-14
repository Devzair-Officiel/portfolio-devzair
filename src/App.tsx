import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { AuthProvider } from '@/context/AuthContext'
import { HomePage, NotFoundPage } from '@/pages'

const AdminLayout         = lazy(() => import('@/components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })))
const AdminLoginPage      = lazy(() => import('@/pages/admin/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })))
const AdminDashboardPage  = lazy(() => import('@/pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })))
const AdminProjectsPage   = lazy(() => import('@/pages/admin/AdminProjectsPage').then(m => ({ default: m.AdminProjectsPage })))
const AdminProjectFormPage = lazy(() => import('@/pages/admin/AdminProjectFormPage').then(m => ({ default: m.AdminProjectFormPage })))
const AdminContentPage    = lazy(() => import('@/pages/admin/AdminContentPage').then(m => ({ default: m.AdminContentPage })))
const AdminSkillsPage     = lazy(() => import('@/pages/admin/AdminSkillsPage').then(m => ({ default: m.AdminSkillsPage })))
const AdminExperiencesPage = lazy(() => import('@/pages/admin/AdminExperiencesPage').then(m => ({ default: m.AdminExperiencesPage })))
const AdminExperienceFormPage = lazy(() => import('@/pages/admin/AdminExperienceFormPage').then(m => ({ default: m.AdminExperienceFormPage })))

const App = () => {
  return (
    <AppProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<HomePage />} />

              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="projects" element={<AdminProjectsPage />} />
                <Route path="projects/new" element={<AdminProjectFormPage />} />
                <Route path="projects/:id/edit" element={<AdminProjectFormPage />} />
                <Route path="content" element={<AdminContentPage />} />
                <Route path="skills" element={<AdminSkillsPage />} />
                <Route path="experiences" element={<AdminExperiencesPage />} />
                <Route path="experiences/new" element={<AdminExperienceFormPage />} />
                <Route path="experiences/:id/edit" element={<AdminExperienceFormPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </AppProvider>
  )
}

export default App
