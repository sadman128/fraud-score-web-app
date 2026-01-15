import mockData from "../data/mock-data.json"

const API_BASE_URL = "/api"

async function fetchWithFallback(endpoint, mockDataKey) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)
    if (!response.ok) throw new Error("API request failed")
    return await response.json()
  } catch (error) {
    console.log(`API unavailable, using mock data for: ${endpoint}`)
    return mockData[mockDataKey]
  }
}

export const apiService = {
  async getPosts() {
    return fetchWithFallback("/posts", "posts")
  },

  async getPost(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`)
      if (!response.ok) throw new Error("API request failed")
      return await response.json()
    } catch (error) {
      return mockData.posts.find((p) => p._id === id)
    }
  },

  async getPendingPosts() {
    return fetchWithFallback("/admin/posts/pending", "pendingPosts")
  },

  async getComments(postId) {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${postId}`)
      if (!response.ok) throw new Error("API request failed")
      return await response.json()
    } catch (error) {
      return mockData.comments.filter((c) => c.postId === postId)
    }
  },

  async getFraudEntity(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/fraud-entity/${id}`)
      if (!response.ok) throw new Error("API request failed")
      return await response.json()
    } catch (error) {
      return mockData.fraudEntities.find((e) => e._id === id)
    }
  },

  async getEntityPosts(entityId) {
    try {
      const response = await fetch(`${API_BASE_URL}/fraud-entity/${entityId}/posts`)
      if (!response.ok) throw new Error("API request failed")
      return await response.json()
    } catch (error) {
      return mockData.posts.filter((p) => p.fraudEntityId === entityId)
    }
  },

  async getTrendingEntities(timeRange = "7d") {
    try {
      const response = await fetch(`${API_BASE_URL}/trending?range=${timeRange}`)
      if (!response.ok) throw new Error("API request failed")
      return await response.json()
    } catch (error) {
      return mockData.fraudEntities.sort((a, b) => b.fraudScore - a.fraudScore)
    }
  },

  async search(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error("API request failed")
      return await response.json()
    } catch (error) {
      const q = query.toLowerCase()
      return {
        entities: mockData.fraudEntities.filter(
          (e) => e.name.toLowerCase().includes(q) || e.email?.toLowerCase().includes(q) || e.phone?.includes(q),
        ),
        posts: mockData.posts.filter(
          (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
        ),
      }
    }
  },

  async getAdminStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`)
      if (!response.ok) throw new Error("API request failed")
      return await response.json()
    } catch (error) {
      return mockData.adminStats
    }
  },
}
