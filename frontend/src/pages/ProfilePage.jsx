import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiEdit3, FiExternalLink } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProfilePage() {
  const { client, user } = useAuth()
  const [books, setBooks] = useState([])

  useEffect(() => {
    let ignore = false
    client.get('/books', { params: { page: 1 } }).then(({ data }) => {
      if (!ignore) setBooks(data.items.filter(b => b.addedBy === user.id))
    })
    return () => { ignore = true }
  }, [client, user])

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
        <h2>{user?.name}</h2>
        <p className="text-muted">{user?.email}</p>
      </motion.div>
      <h4 className="mt-4">My Books</h4>
      <ul className="list-group">
        {books.map(b => (
          // ADDED p-3 FOR PADDING AND align-items-center FOR VERTICAL ALIGNMENT
          <li className="list-group-item d-flex justify-content-between align-items-center glass p-3" key={b._id}>
            <span>{b.title}</span>
            <div>
              <Link className="btn btn-sm btn-outline-primary me-7 d-flex align-items-center gap-10" to={`/books/${b._id}`}><FiExternalLink /> View</Link>
              <Link className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-10" to={`/books/${b._id}/edit`}><FiEdit3 /> Edit</Link>
            </div>
          </li>
        ))}
        {!books.length && <li className="list-group-item glass">No books yet.</li>}
      </ul>
    </div>
  )
}