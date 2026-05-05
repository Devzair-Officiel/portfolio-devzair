import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { AuthProvider } from '@/context/AuthContext'
import { HomePage, NotFoundPage } from '@/pages'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { AdminProjectsPage } from '@/pages/admin/AdminProjectsPage'
import { AdminProjectFormPage } from '@/pages/admin/AdminProjectFormPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminContentPage } from '@/pages/admin/AdminContentPage'
import { AdminSkillsPage } from '@/pages/admin/AdminSkillsPage'
import { AdminExperiencesPage } from '@/pages/admin/AdminExperiencesPage'
import { AdminExperienceFormPage } from '@/pages/admin/AdminExperienceFormPage'

const App = () => {
  return (
    <AppProvider>
      <AuthProvider>
        <BrowserRouter>
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
        </BrowserRouter>
      </AuthProvider>
    </AppProvider>
  )
}

export default App
