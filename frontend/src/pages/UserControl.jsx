"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { getAllUsers } from "../api/userApi"
import { testBackendConnection } from "../api/testApi"
import api from "../axiosConfig"

const UserControl = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState("")
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [message, setMessage] = useState("")
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [data, setData] = useState([]);

  // Get token from localStorage or your UserContext
  const token = localStorage.getItem("authToken") || "mock-token"

  // Check for success messages from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message)
      setTimeout(() => setMessage(""), 3000)
    }
  }, [location.state])

  useEffect(() => {
    // Test backend connection first
    // testBackendConnection()

    // Then try to fetch users
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    setError("")

    try {


      const response = await api.get("/user")
      setData(response.data);


      if (response && response.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data)

      } else {

        throw new Error("Invalid response format")
      }
    } catch (err) {
      console.error("❌ API Error:")
      console.error("Error message:", err.message)
      console.error("Error response:", err.response)
      console.error("Error status:", err.response?.status)
      console.error("Error data:", err.response?.data)

      // Show specific error messages
      if (err.response?.status === 401) {
        setError("Authentication failed. Please check your token.")
      } else if (err.response?.status === 403) {
        setError("Access denied. You don't have permission.")
      } else if (err.response?.status === 404) {
        setError("API endpoint not found. Check if backend is running.")
      } else if (err.code === "NETWORK_ERROR" || err.message.includes("Network Error")) {
        setError("Cannot connect to backend server. Is it running on port 8080?")
      } else {
        setError(`API Error: ${err.message}`)
      }

      // Fallback to static data for demo
      const fallbackUsers = [
        {
          id: 1,
          email: "test@gmail.com",
          firstName: "Test",
          lastName: "User",
          role: "Passenger",
        },
      ]
      setUsers(fallbackUsers)
    } finally {
      setLoading(false)
    }
  }

  const handleBackClick = () => {
    navigate("/admin-home")
  }

  const handleSearch = () => {
    if (!Array.isArray(users)) {
      console.error("Users is not an array:", users)
      return
    }

    const foundUser = users.find(
      (user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    if (foundUser) {
      setSelectedUser(foundUser)
      setShowUserDetails(true)
    } else {
      setShowUserDetails(false)
      setSelectedUser(null)
    }
  }

  const handleSearchInputChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)

    if (value.length > 2 && Array.isArray(users) && users.length > 0) {
      const foundUser = users.find(
        (user) =>
          user.email.toLowerCase().includes(value.toLowerCase()) ||
          user.firstName.toLowerCase().includes(value.toLowerCase()) ||
          user.lastName.toLowerCase().includes(value.toLowerCase()),
      )

      if (foundUser) {
        setSelectedUser(foundUser)
        setShowUserDetails(true)
      }
    } else {
      setShowUserDetails(false)
      setSelectedUser(null)
    }
  }

  const handleEditUser = () => {
    navigate("/edit-user", { state: { user: selectedUser } })
  }

  const handleUpdateRole = () => {
    navigate("/update-role", { state: { user: selectedUser } })
  }

  const handleClearSearch = () => {
    setShowUserDetails(false)
    setSelectedUser(null)
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-gray-300">
      {/* Header */}
      <div className="bg-gray-200 border-b-2 border-gray-400">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">BTTS</h1>
          <button
            onClick={handleBackClick}
            className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Title Bar */}
      <div className="bg-blue-400 border-b-2 border-blue-600 py-4">
        <h2 className="text-xl font-bold text-center text-gray-900 underline">User Control</h2>
      </div>

      {/* Success Message */}
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mx-4 mt-4">
          <p className="text-center font-medium">{message}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 mt-4">
          <p className="text-center font-medium">{error}</p>
          <p className="text-center text-sm mt-2">Check the browser console (F12) for detailed error logs.</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center mt-8">
          <p className="text-gray-600">Loading users...</p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex justify-center pt-12">
        <div className="w-full max-w-md">
          {/* Search Bar */}
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search by Gmail, first name, or last name..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="w-full px-4 py-3 pr-12 border-2 border-gray-800 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* User Details */}
          {showUserDetails && selectedUser && (
            <div className="bg-white border-2 border-gray-800 rounded-lg p-4 shadow-lg">
              {/* User Info Header */}
              <div className="grid grid-cols-3 gap-4 mb-4 pb-2 border-b border-gray-300">
                <div className="font-bold text-gray-700">Name</div>
                <div className="font-bold text-gray-1100">Email</div>
                <div className="font-bold text-gray-900">Role</div>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-gray-700">{`${selectedUser.firstName} ${selectedUser.lastName}`}</div>
                <div className="text-gray-1100 text-sm">{selectedUser.email}</div>
                <div className="text-gray-900">{selectedUser.role}</div>
              </div>

              {/* Action Buttons */}
              <div className="text-center space-y-3">
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleEditUser}
                    className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-medium"
                  >
                    Edit User
                  </button>
                  <button
                    onClick={handleUpdateRole}
                    className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors font-medium"
                  >
                    Update Role
                  </button>
                </div>
                <button
                  onClick={handleClearSearch}
                  className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors font-medium"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserControl
