"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { updateUserDetails } from "./user-api"

const EditUser = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = location.state?.user

  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [email, setEmail] = useState(user?.email || "")
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Mock token - in a real app, get this from authentication context/localStorage
  const token = localStorage.getItem("authToken") || "mock-token"

  const handleBackClick = () => {
    navigate("/user-control")
  }

  const validateForm = () => {
    const newErrors = {}

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email format is invalid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (validateForm()) {
      setLoading(true)
      setError("")

      try {
        const userDTO = {
          firstName,
          lastName,
          email,
        }

        await updateUserDetails(token, user.id, userDTO)

        // Navigate back with success message
        navigate("/user-control", {
          state: { message: "Details updated successfully!" },
        })
      } catch (err) {
        setError("Failed to update user details. Please try again.")
        console.error("Error updating user:", err)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCancel = () => {
    navigate("/user-control")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-300 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-900 mb-4">No user data found</p>
          <button
            onClick={handleBackClick}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Back to User Control
          </button>
        </div>
      </div>
    )
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
        <h2 className="text-xl font-bold text-center text-gray-900 underline">Edit User</h2>
      </div>

      {/* Main Content */}
      <div className="flex justify-center pt-12">
        <div className="w-full max-w-md">
          <div className="bg-white border-2 border-gray-800 rounded-lg p-6 shadow-lg">
            <div className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p className="text-center text-sm">{error}</p>
                </div>
              )}

              {/* First Name */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Current Role (Read-only) */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">Current Role</label>
                <input
                  type="text"
                  value={user.role}
                  readOnly
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
                <p className="text-sm text-gray-500 mt-1">Use "Update Role" to change the user's role</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={handleSave}
                disabled={loading}
                className={`px-6 py-2 text-white rounded-full font-medium transition-colors ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditUser