import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiUserPlus } from 'react-icons/fi'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function SignupPage() {
  // NOTE: Assuming the function in AuthContext is named 'register' as per MERN standard, 
  // but keeping 'signup' as per your provided code.
  const { signup } = useAuth() 
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(form.name, form.email, form.password)
      navigate('/')
    } catch (err) {
      // Accessing error message correctly based on the backend response structure
      setError(err.message || err?.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-7 col-lg-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: .4 }} 
          // --- FIX: Added text-light for visibility against the dark background ---
          className="glass rounded-4 p-4 text-light"
        >
          {/* Ensure the icon and title are clearly visible */}
          <h2 className="d-flex align-items-center gap-2 text-white">
            <FiUserPlus /> Signup
          </h2>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          
          <form onSubmit={handleSubmit} className="mt-3">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input 
                className="form-control text-dark" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control text-dark" 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control text-dark" 
                value={form.password} 
                onChange={e => setForm({...form, password: e.target.value})} 
                required 
                minLength={6} 
              />
            </div>
            
            {/* The button already uses the primary styling */}
            <button 
              className="btn btn-info" 
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Signup'}
            </button>
            
            <p className="mt-3">
              Already have an account? <Link to="/login" className="text-info">Login</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}