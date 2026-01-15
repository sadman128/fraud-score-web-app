import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import PostDetailPage from "./pages/PostDetailPage"
import SearchPage from "./pages/SearchPage"
import FraudProfilePage from "./pages/FraudProfilePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import CreatePostPage from "./pages/CreatePostPage"
import AdminDashboard from "./pages/AdminDashboard"
import TrendingPage from "./pages/TrendingPage"

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/fraud-entity/:id" element={<FraudProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/trending" element={<TrendingPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
