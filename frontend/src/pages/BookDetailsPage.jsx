import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiEdit2, FiTrash2, FiStar } from 'react-icons/fi'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function BookDetailsPage() {
  const { id } = useParams()
  const { client, user, token } = useAuth()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let ignore = false
    setLoading(true)
    client.get(`/books/${id}`).then(({ data }) => { if (!ignore) setBook(data) }).catch(e=>setError('Failed to load')).finally(()=>setLoading(false))
    return () => { ignore = true }
  }, [client, id])

  const isOwner = useMemo(() => !!user && book && book.addedBy === user.id, [user, book])

  async function handleDelete() {
    if (!confirm('Delete this book?')) return
    await client.delete(`/books/${id}`)
    navigate('/')
  }

  async function submitReview(e) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const rating = Number(formData.get('rating'))
    const reviewText = String(formData.get('reviewText'))
    await client.post('/reviews', { bookId: id, rating, reviewText })
    const { data } = await client.get(`/books/${id}`)
    setBook(data)
    e.currentTarget.reset()
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-danger">{error}</p>
  if (!book) return <p>Not found</p>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 text-white">
        <h2>{book.title}</h2>
        {isOwner && (
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-secondary d-flex align-items-center gap-2" to={`/books/${id}/edit`}><FiEdit2 /> Edit</Link>
            <button className="btn btn-outline-danger d-flex align-items-center gap-2" onClick={handleDelete}><FiTrash2 /> Delete</button>
          </div>
        )}
      </div>
      <p className="text-light">{book.author} · {book.genre} · {book.year}</p>
      <p className='text-light'>{book.description}</p>
      <p className="fw-bold d-flex align-items-center gap-2 text-light">Average Rating: <FiStar /> {Number(book.averageRating||0).toFixed(2)}</p>

      <hr />
      <h4 className='text-white'>Reviews</h4>
      {book.reviews?.length ? (
        <ul className="list-group mb-3 text-light">
          {book.reviews.map(r => (
            <li key={r._id} className="list-group-item glass text-light">
              <div className="d-flex justify-content-between text-light">
                <div>
                  <strong>{r.userId?.name || 'User'}</strong> · <FiStar /> {r.rating}
                  <p className="mb-0">{r.reviewText}</p>
                </div>
                {token && user?.id === r.userId?._id && (
                  <ReviewActions review={r} onUpdated={async()=>{
                    const { data } = await client.get(`/books/${id}`)
                    setBook(data)
                  }} />
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : <p className='text-light'>No reviews yet.</p>}

      {token ? (
        <form className="card card-body glass" onSubmit={submitReview}>
          <div className="row g-2 align-items-end">
            <div className="col-md-2">
              <label className="form-label">Rating</label>
              <select name="rating" className="form-select" required defaultValue="5">
                {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="col-md-8">
              <label className="form-label">Review</label>
              <input name="reviewText" className="form-control" placeholder="Write a review" required />
            </div>
            <div className="col-md-2">
              <button className="btn btn-info w-100">Submit</button>
            </div>
          </div>
        </form>
      ) : (<p className="text-muted">Login to add a review.</p>)}
    </div>
  )
}

function ReviewActions({ review, onUpdated }) {
  const { client } = useAuth()
  const [editing, setEditing] = useState(false)
  const [rating, setRating] = useState(review.rating)
  const [text, setText] = useState(review.reviewText)

  async function save() {
    await client.put(`/reviews/${review._id}`, { rating, reviewText: text })
    setEditing(false)
    onUpdated?.()
  }

  async function remove() {
    if (!confirm('Delete review?')) return
    await client.delete(`/reviews/${review._id}`)
    onUpdated?.()
  }

  if (!editing) return (
    <div className="d-flex gap-2">
      <button className="btn btn-sm btn-outline-secondary" onClick={()=>setEditing(true)}>Edit</button>
      <button className="btn btn-sm btn-outline-danger" onClick={remove}>Delete</button>
    </div>
  )

  return (
    <div className="d-flex gap-2">
      <select className="form-select form-select-sm" value={rating} onChange={e=>setRating(Number(e.target.value))}>
        {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
      </select>
      <input className="form-control form-control-sm" value={text} onChange={e=>setText(e.target.value)} />
      <button className="btn btn-sm btn-info" onClick={save}>Save</button>
      <button className="btn btn-sm btn-danger" onClick={()=>setEditing(false)}>Cancel</button>
    </div>
  )
}


