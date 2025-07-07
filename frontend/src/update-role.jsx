"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { updateUserRole } from "./user-api"

const UpdateRole = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = location.state?.user

  const [selectedRole, setSelectedRole] = useState(user?.role || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Mock token - in a real app, get this from authentication context/localStorage
  const token = localStorage.getItem("authToken") || "mock-token"

  const availableRoles = ["Admin", "Ticket Staff", "Passenger"]

  const handleBackClick = () => {
    navigate("/user-control")
  }

  const handleRoleSelection = (role) => {
    setSelectedRole(role)
  }

  const handleSave = async () => {
    if (selectedRole && selectedRole !== user.role) {
      setLoading(true)
      setError("")

      try {
        await updateUserRole(token, user.email, selectedRole)

        // Navigate back with success message
        navigate("/user-control", {
          state: { message: `Role updated to ${selectedRole} successfully!` },
        })
      } catch (err) {
        setError("Failed to update user role. Please try again.")
        console.error("Error updating role:", err)
      } finally {
        setLoading(false)
      }
    } else if (selectedRole === user.role) {
      // No change made
      navigate("/user-control", {
        state: { message: "No changes made to user role." },
      })
    } else {
      setError("Please select a role")
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
        <h2 className="text-xl font-bold text-center text-gray-900 underline">Update Role</h2>
      </div>

      {/* Main Content */}
      <div className="flex justify-center pt-12">
        <div className="w-full max-w-md">
          <div className="bg-white border-2 border-gray-800 rounded-lg p-6 shadow-lg">
            {/* User Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-bold text-gray-900 mb-2">User Information</h3>
              <p className="text-gray-700">
                <span className="font-medium">Name:</span> {`${user.firstName} ${user.lastName}`}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Current Role:</span> {user.role}
              </p>
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-4 text-center">Choose the new role:</h3>
              <div className="space-y-3">
                {availableRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleSelection(role)}
                    className={`w-full px-6 py-3 rounded-full font-medium transition-colors border-2 ${
                      selectedRole === role
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {role}
                    {role === user.role && <span className="ml-2 text-sm">(Current)</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p className="text-center text-sm">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className={`px-6 py-2 text-white rounded-full font-medium transition-colors ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {loading ? "Updating..." : "Update Role"}
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

export default UpdateRole
