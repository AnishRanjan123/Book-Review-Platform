# Book Review Platform (MERN)

MERN app where users sign up, log in, add books, and review them. Includes JWT auth, CRUD, pagination, search/filter/sort, and a React UI.

## Setup

### Backend
```
cd backend
cp .env.example .env
npm install
npm run dev
```
Edit `.env` with: `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL=http://localhost:5173`.

### Frontend
```
cd frontend
npm install
npm run dev
```
Optional: create `frontend/.env` with `VITE_API_BASE=http://localhost:5000/api`.

## API (Base: /api)
- POST `/auth/signup` { name, email, password } → { token, user }
- POST `/auth/login` { email, password } → { token, user }
- GET `/books` ?page&search&genre&sortBy(year|rating)
- GET `/books/:id`
- POST `/books` (auth)
- PUT `/books/:id` (auth owner)
- DELETE `/books/:id` (auth owner)
- POST `/reviews` (auth) { bookId, rating(1-5), reviewText }
- PUT `/reviews/:id` (auth owner)
- DELETE `/reviews/:id` (auth owner)

## Notes
- One review per user per book (unique index).
- Average rating stored on `Book.averageRating` and recalculated on review changes.
