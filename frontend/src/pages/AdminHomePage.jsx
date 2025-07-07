import { useNavigate } from "react-router-dom"
import { useUser } from "../context/UserContext"
import NavBar from "../components/NavBar"
const AdminHomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <NavBar/>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Transit Admin View</h2>
          <p className="text-blue-700">Manage your transit system efficiently</p>
        </div>

        {/* Feature Cards */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-200">
          <div className="grid gap-6 md:grid-cols-1 max-w-md mx-auto">
            {/* Bus Management */}
            <div className="group cursor-pointer" onClick={()=>{navigate("/bus-management")}}>
              <div className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <span className="text-white text-3xl" role="img" aria-label="route">
                    🚌
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Bus Management</h3>
                <p className="text-blue-100 text-sm">Manage buses</p>
              </div>
            </div>

            {/* Trip Management */}
            <div className="group cursor-pointer" onClick={()=>{navigate("/trip-management")}}>
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
            <div className="group cursor-pointer" onClick={()=>{navigate("/user-control")}}>
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

export default AdminHomePage