import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import CustomersPage from './pages/CustomersPage'
import FulfillmentsPage from './pages/FulfillmentsPage'
import Layout from './components/Layout'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/customers" replace />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="fulfillments" element={<FulfillmentsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
