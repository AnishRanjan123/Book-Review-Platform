import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function BooksPage() {
  const { client } = useAuth()
  const [params, setParams] = useSearchParams()
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 })
  const [loading, setLoading] = useState(true)

  const page = Number(params.get('page') || 1)
  const search = params.get('search') || ''
  const genre = params.get('genre') || ''
  const sortBy = params.get('sortBy') || ''

  useEffect(() => {
    let ignore = false
    setLoading(true)
    client.get('/books', { params: { page, search, genre, sortBy } }).then(({ data }) => {
      if (!ignore) setData(data)
    }).finally(() => setLoading(false))
    return () => { ignore = true }
  }, [client, page, search, genre, sortBy])

  function updateParam(key, value) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value); else next.delete(key)
    if (key !== 'page') next.delete('page')
    setParams(next)
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }} className="glass rounded-4 p-3 mb-4">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <div className="pill flex-grow-1">
            <input className="w-100" placeholder="Search title or author" value={search} onChange={(e)=>updateParam('search', e.target.value)} />
          </div>
          <div className="pill">
            <input placeholder="Genre" value={genre} onChange={(e)=>updateParam('genre', e.target.value)} />
          </div>
          <div className="pill">
            <select value={sortBy} onChange={(e)=>updateParam('sortBy', e.target.value)}>
              <option value="">Sort By</option>
              <option value="year">Newest</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          <button className="btn btn-info">Search</button>
          <button className="btn btn-outline-light" onClick={()=>{ setParams(new URLSearchParams()) }}>Clear Filters</button>
        </div>
      </motion.div>

      {loading ? <p>Loading...</p> : (
        <>
          <div className="row g-3">
            {data.items.map(b => (
              <div className="col-md-6" key={b._id}>
                <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{b.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{b.author} · {b.genre} · {b.year}</h6>
                    <p className="card-text">{b.description.slice(0,140)}{b.description.length>140?'...':''}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="d-flex align-items-center gap-1"><FiStar /> {b.averageRating?.toFixed?.(2) ?? Number(b.averageRating||0).toFixed(2)}</span>
                      <Link className="btn btn-sm btn-outline-primary" to={`/books/${b._id}`}>Details</Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          <nav className="mt-3">
            <ul className="pagination justify-content-center gap-2">
              {Array.from({ length: data.pages }).map((_, i) => (
                <li key={i} className={`page-item ${data.page===i+1?'active':''}`}>
                  <button className="page-link" onClick={()=>updateParam('page', String(i+1))}>{i+1}</button>
                </li>
              ))}
              {data.pages > 5 && <li className="page-item"><span className="page-link">…</span></li>}
            </ul>
          </nav>
        </>
      )}
    </div>
  )
}


