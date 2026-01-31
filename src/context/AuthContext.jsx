import { createContext, useContext, useState } from "react"
import {deleteCookie} from "../utils/cookieUtils";

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // ✅ Login function now accepts userData with username
  const login = (userData) => {
    setUser({
      username: userData.username,
      email: userData.email || "",
      role: userData.role || "USER",
      phone: userData.phone || "",
      _id: userData._id || "",
    })
    setIsAuthenticated(true)
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    deleteCookie("accessToken")
    deleteCookie("refreshToken")
    deleteCookie("username")
  }

  return (
      <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
        {children}
      </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
