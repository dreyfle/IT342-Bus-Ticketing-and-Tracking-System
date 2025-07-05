import NavBar from "../components/NavBar";
import { useUser } from "../context/UserContext"
import { useNavigate } from 'react-router-dom'

const PassengerHomePage = () => {
  const {logout} = useUser();
  const navigate = useNavigate()

  const handleTicketBookingClick = () => {
    navigate('/ticket-booking')
  }

  const handleScheduleViewingClick = () => {
    navigate('/schedule-viewing')
  }

  const handleHistoryClick = () => {
    navigate('/transaction-history')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <NavBar/>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Passenger View</h2>
          <p className="text-blue-700">Welcome to your passenger dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-200">
          <div className="grid gap-6 md:grid-cols-1 max-w-md mx-auto">
            {/* Ticket Booking */}
            <div className="group cursor-pointer" onClick={handleTicketBookingClick}>
              <div className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <span className="text-white text-3xl" role="img" aria-label="map">📍</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Ticket Booking</h3>
                <p className="text-blue-100 text-sm">Book your bus tickets easily</p>
              </div>
            </div>

            {/* Schedule Viewing */}
            <div className="group cursor-pointer" onClick={handleScheduleViewingClick}>
              <div className="bg-blue-500 hover:bg-blue-600 transition-colors rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <span className="text-white text-3xl" role="img" aria-label="calendar">📅</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Schedule Viewing</h3>
                <p className="text-blue-100 text-sm">Check bus schedules and routes</p>
              </div>
            </div>


            {/* History */}
            <div className="group cursor-pointer" onClick={handleHistoryClick}>
              <div className="bg-blue-400 hover:bg-blue-500 transition-colors rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <span className="text-white text-3xl" role="img" aria-label="history">🕓</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">History</h3>
                <p className="text-blue-100 text-sm">View your booking history</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PassengerHomePage