import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiSave } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function EditBookPage({ mode }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { client } = useAuth()
  const [form, setForm] = useState({ title:'', author:'', description:'', genre:'', year:'' })
  const [loading, setLoading] = useState(mode==='edit')
  const [error, setError] = useState('')

  useEffect(() => {
    if (mode === 'edit' && id) {
      client.get(`/books/${id}`).then(({ data }) => {
        setForm({ title:data.title, author:data.author, description:data.description, genre:data.genre, year:data.year })
      }).catch(()=>setError('Failed to load')).finally(()=>setLoading(false))
    }
  }, [client, id, mode])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'create') {
        const { data } = await client.post('/books', { ...form, year: Number(form.year) })
        navigate(`/books/${data._id}`)
      } else {
        await client.put(`/books/${id}`, { ...form, year: Number(form.year) })
        navigate(`/books/${id}`)
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Save failed')
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }} className="glass rounded-4 p-4 text-white">
        <h2>{mode==='create'?'Add Book':'Edit Book'}</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-3">
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input className="form-control" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Author</label>
            <input className="form-control" value={form.author} onChange={e=>setForm({...form, author:e.target.value})} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={5} value={form.description} onChange={e=>setForm({...form, description:e.target.value})} required />
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Genre</label>
              <input className="form-control" value={form.genre} onChange={e=>setForm({...form, genre:e.target.value})} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Published Year</label>
              <input type="number" className="form-control" value={form.year} onChange={e=>setForm({...form, year:e.target.value})} required />
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-info d-flex align-items-center gap-2"><FiSave /> Save</button>
          </div>
        </form>
        </motion.div>
      </div>
    </div>
  )
}


