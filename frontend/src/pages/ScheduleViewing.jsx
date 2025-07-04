import { useNavigate } from "react-router-dom"
import { ArrowLeft, User } from "lucide-react"

const ScheduleViewing = () => {
  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate("/passenger-home")
  }

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

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
              <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full">
                <User className="w-4 h-4 text-blue-600" />
              </div>

              <button
                onClick={handleBackClick}
                className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Schedule</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        {/* Schedule Grid */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200 overflow-hidden">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-blue-200">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="bg-blue-600 text-white font-semibold text-center py-4 px-2 border-r border-blue-500 last:border-r-0"
              >
                <span className="text-sm md:text-base">{day}</span>
              </div>
            ))}
          </div>

          {/* Schedule Content Grid */}
          <div className="grid grid-cols-7 min-h-[500px]">
            {daysOfWeek.map((day, index) => (
              <div
                key={day}
                className="border-r border-blue-200 last:border-r-0 p-4 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                {/* You can add schedule items here */}
                <div className="space-y-2">
                  {/* Example schedule items - you can replace with actual data */}
                  {index === 0 && (
                    <>
                      <div className="bg-blue-200 p-2 rounded text-xs text-blue-800">
                        <div className="font-semibold">8:00 AM</div>
                        <div>Cebu - Naga</div>
                      </div>
                      <div className="bg-blue-200 p-2 rounded text-xs text-blue-800">
                        <div className="font-semibold">2:00 PM</div>
                        <div>Cebu - Toledo</div>
                      </div>
                    </>
                  )}
                  {index === 1 && (
                    <div className="bg-blue-200 p-2 rounded text-xs text-blue-800">
                      <div className="font-semibold">10:00 AM</div>
                      <div>Cebu - Argao</div>
                    </div>
                  )}
                  {/* Add more schedule items as needed */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend or Additional Info */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Schedule Information</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <span className="font-medium">Operating Hours:</span> 6:00 AM - 8:00 PM
            </div>
            <div>
              <span className="font-medium">Frequency:</span> Every 30-60 minutes
            </div>
            <div>
              <span className="font-medium">Routes:</span> Multiple destinations available
            </div>
            <div>
              <span className="font-medium">Contact:</span> (032) 123-4567
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ScheduleViewing