import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SubmitPage from './submit/SubmitPage'
import DashboardPage from './dashboard/DashboardPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/submit/:slug" element={<SubmitPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
