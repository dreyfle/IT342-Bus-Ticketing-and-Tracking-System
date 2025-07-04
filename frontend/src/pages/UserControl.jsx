import { useState } from "react"
import { useNavigate } from "react-router-dom"

const UserControl = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Static user data
  const staticUser = {
    email: "PassengerEx@gmail.com",
    name: "Passenger E",
    role: "Passenger",
  }

  const handleBackClick = () => {
    navigate("/admin-home")
  }

  const handleSearch = () => {
    if (searchQuery.toLowerCase().includes("passengerex") || searchQuery.toLowerCase().includes("passenger")) {
      setSelectedUser(staticUser)
      setShowUserDetails(true)
    } else {
      setShowUserDetails(false)
      setSelectedUser(null)
    }
  }

  const handleSearchInputChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)

    // Auto-populate with static email when typing
    if (value.toLowerCase().includes("pass") || value.toLowerCase().includes("passenger")) {
      setSearchQuery("PassengerEx@gmail.com")
      setSelectedUser(staticUser)
      setShowUserDetails(true)
    }
  }

  const handleAdjustRole = () => {
    setShowRoleModal(true)
  }

  const handleRoleSelection = (newRole) => {
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        role: newRole,
      })
    }
    setShowRoleModal(false)
    alert(`Role updated to ${newRole} successfully!`)
  }

  const handleYesClick = () => {
    handleAdjustRole()
  }

  const handleNoClick = () => {
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

      {/* Main Content */}
      <div className="flex justify-center pt-12">
        <div className="w-full max-w-md">
          {/* Search Bar */}
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search a Gmail..."
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
              <div className="grid grid-cols-2 gap-4 mb-4 pb-2 border-b border-gray-300">
                <div className="font-bold text-gray-900">Name</div>
                <div className="font-bold text-gray-900">Role</div>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-gray-900">{selectedUser.name}</div>
                <div className="text-gray-900">{selectedUser.role}</div>
              </div>

              {/* Adjust Role Section */}
              <div className="text-center">
                <p className="text-gray-900 font-medium mb-4">Adjust Role?</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleYesClick}
                    className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors font-medium"
                  >
                    Yes
                  </button>
                  <button
                    onClick={handleNoClick}
                    className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors font-medium"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Role Selection Modal */}
          {showRoleModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white border-2 border-gray-800 rounded-lg p-6 max-w-sm mx-4 shadow-xl">
                <div className="text-center">
                  <p className="text-gray-900 font-medium mb-6">Choose the new role:</p>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleRoleSelection("Admin")}
                      className="w-full px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors font-medium"
                    >
                      Admin
                    </button>
                    <button
                      onClick={() => handleRoleSelection("Ticket Staff")}
                      className="w-full px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors font-medium"
                    >
                      Ticket Staff
                    </button>
                    <button
                      onClick={() => setShowRoleModal(false)}
                      className="w-full px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserControl
