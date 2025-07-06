import { useNavigate } from "react-router-dom"
import { useUser } from "../context/UserContext"
const AdminHomePage = () => {
  const navigate = useNavigate()

  const handleUserControlClick = () => {
    navigate("/user-control")
  }

  const handleTripManagementClick = () => {
    navigate("/trip-management")
  }
  const { logout } = useUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-900">BTTS</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600 text-xl" role="img" aria-label="shield">🛡️</span>
              </div>
              <button className="p-2 px-4 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
                onClick={logout}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Transit Admin View</h2>
          <p className="text-blue-700">Manage your transit system efficiently</p>
        </div>

        {/* Feature Cards */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-200">
          <div className="grid gap-6 md:grid-cols-1 max-w-md mx-auto">
            {/* Trip Management */}
            <div className="group cursor-pointer" onClick={handleTripManagementClick}>
              <div className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <span className="text-white text-3xl" role="img" aria-label="route">
                    🗺️
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Trip Management</h3>
                <p className="text-blue-100 text-sm">Manage routes and schedules</p>
              </div>
            </div>

            {/* User Control */}
            <div className="group cursor-pointer" onClick={handleUserControlClick}>
              <div className="bg-blue-400 hover:bg-blue-500 transition-colors rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <span className="text-white text-3xl" role="img" aria-label="users">
                    👥
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">User Control</h3>
                <p className="text-blue-100 text-sm">Manage users and permissions</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

//<Link to="/user-control" className="btn">Manage Users</Link>
//<Link to="/update-role" className="btn">Update Role</Link>
//example button

export default AdminHomePage