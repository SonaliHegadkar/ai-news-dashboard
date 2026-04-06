import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage       from './pages/HomePage'
import NewsDetailPage from './pages/NewsDetailPage'

// App.jsx only handles routing.
// Each page manages its own layout and state.

export default function App() {
  return (
    <Routes>
      {/* Home page — shows all news cards with search and filters */}
      <Route path="/" element={<HomePage />} />

      {/* Detail page — /news/5 shows full article for id 5 */}
      {/* :id is a dynamic segment — value is read inside the page with useParams() */}
      <Route path="/news/:id" element={<NewsDetailPage />} />

      {/* Catch-all — any unknown URL redirects back to home instead of showing a 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
