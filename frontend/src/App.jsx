import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLogOut, FiUser, FiPlusCircle, FiBookOpen } from 'react-icons/fi'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import BooksPage from './pages/BooksPage.jsx'
import BookDetailsPage from './pages/BookDetailsPage.jsx'
import EditBookPage from './pages/EditBookPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'

function ProtectedRoute({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

function Layout({ children }) {
  const { token, user, logout } = useAuth()
  return (
    <div>
      <div className="animated-bg" />
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <FiBookOpen />
            <span>Bookverse</span>
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              {token && <li className="nav-item"><Link className="nav-link d-flex align-items-center gap-1" to="/books/new"><FiPlusCircle /> Add Book</Link></li>}
            </ul>
            <ul className="navbar-nav">
              {!token && <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>}
              {!token && <li className="nav-item"><Link className="nav-link" to="/signup">Signup</Link></li>}
              {token && (
                <>
                  <li className="nav-item"><Link className="nav-link d-flex align-items-center gap-2" to="/profile"><FiUser /> {user?.name}</Link></li>
                  <li className="nav-item"><button className="btn btn-sm btn-outline-light ms-2 d-flex align-items-center gap-2" onClick={logout}><FiLogOut /> Logout</button></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }} className="container py-4">
        {children}
      </motion.div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<BooksPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/books/:id" element={<BookDetailsPage />} />
          <Route path="/books/new" element={<ProtectedRoute><EditBookPage mode="create" /></ProtectedRoute>} />
          <Route path="/books/:id/edit" element={<ProtectedRoute><EditBookPage mode="edit" /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}


