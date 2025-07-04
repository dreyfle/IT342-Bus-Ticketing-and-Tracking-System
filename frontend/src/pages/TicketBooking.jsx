import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { X } from "lucide-react"
import { useTransactions } from "../context/TransactionContext"

const TicketBooking = () => {
  const [timeFilter, setTimeFilter] = useState("")
  const navigate = useNavigate()

  const { transactions } = useTransactions()

  const handleBackClick = () => {
    navigate("/passenger-home")
  }

  const handleTransactionClick = () => {
    navigate("/transaction")
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800"
      case "Boarding":
        return "bg-yellow-100 text-yellow-800"
      case "Departed":
        return "bg-blue-100 text-blue-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={handleBackClick} className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">BTTS</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Page Title */}
          <div className="px-6 py-4 border-b">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Ticket Booking
              <div className="w-24 h-1 bg-blue-600 mx-auto mt-2"></div>
            </h2>
          </div>

          <div className="flex">
            {/* Table Section */}
            <div className="flex-1 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                      TripID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                      Origin
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                      Destination
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                      Operator
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                      Bus Class
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                      Departure
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                      Seats
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Fare</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                        No bus trips booked yet. Click "Transaction" to book your first trip.
                      </td>
                    </tr>
                  )}
                  {transactions.map((trip, index) => (
                    <tr key={trip.id || index} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200">{trip.tripId}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200">{trip.origin}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200">{trip.destination}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200">{trip.operator}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200">{trip.busClass}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200">{trip.departure}</td>
                      <td className="px-4 py-4 border-r border-gray-200">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}
                        >
                          {trip.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200">{trip.seatPosition}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900">{trip.amountPaid}</td>
                    </tr>
                  ))}
                  {/* Empty rows for spacing when there are transactions */}
                  {transactions.length > 0 &&
                    Array.from({ length: Math.max(0, 10 - transactions.length) }).map((_, index) => (
                      <tr key={`empty-${index}`} className="border-b border-gray-200">
                        <td className="px-4 py-4 border-r border-gray-200">&nbsp;</td>
                        <td className="px-4 py-4 border-r border-gray-200">&nbsp;</td>
                        <td className="px-4 py-4 border-r border-gray-200">&nbsp;</td>
                        <td className="px-4 py-4 border-r border-gray-200">&nbsp;</td>
                        <td className="px-4 py-4 border-r border-gray-200">&nbsp;</td>
                        <td className="px-4 py-4 border-r border-gray-200">&nbsp;</td>
                        <td className="px-4 py-4 border-r border-gray-200">&nbsp;</td>
                        <td className="px-4 py-4 border-r border-gray-200">&nbsp;</td>
                        <td className="px-4 py-4">&nbsp;</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Filters Section */}
            <div className="w-64 border-l border-gray-200 bg-gray-50">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Departure Time</label>
                    <div className="relative">
                      <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg px-3 py-2">
                        <span className="text-sm text-gray-900">{timeFilter}</span>
                        <button onClick={() => setTimeFilter("")} className="text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Origin</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="South Bus Terminal">South Bus Terminal</option> 
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">All Destinations</option>
                      <option value="Naga">Naga</option>
                      <option value="San Fernando">San Fernando</option>
                      <option value="Alcoy">Alcoy</option>
                      <option value="Aloguinsan">Aloguinsan</option>
                      <option value="Argao">Argao</option>
                      <option value="Dalaguete">Dalaguete</option>
                      <option value="Oslob">Oslob</option>
                      <option value="Balamban">Balamban</option>
                      <option value="Carcar">Carcar</option>
                      <option value="Sibonga">Sibonga</option>
                      <option value="Barili">Barili</option>
                      <option value="Badian">Badian</option>
                      <option value="Toledo">Toledo</option>
                      <option value="Santander">Santander</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bus Class</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">All Classes</option>
                      <option value="Aircon">Aircon</option>
                      <option value="Ordinary">Ordinary</option>
                    </select>
                  </div>

                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Apply Filters
                  </button>
                  <button
                    onClick={handleTransactionClick}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Transaction
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketBooking