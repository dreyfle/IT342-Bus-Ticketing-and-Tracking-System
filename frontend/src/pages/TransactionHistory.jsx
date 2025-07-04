"use client"
import { useNavigate } from "react-router-dom"
import { useTransactions } from "../context/TransactionContext"

const TransactionHistory = () => {
  const navigate = useNavigate()
  const { transactions, clearTransactions } = useTransactions()

  const handleBackClick = () => {
    navigate("/passenger-home")
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

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={handleBackClick} className="p-2 hover:bg-blue-700 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold">BTTS</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">P</span>
            </div>
            <span className="text-sm">Passenger E</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Page Title */}
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div className="text-center flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                Transaction History
                <div className="w-24 h-1 bg-blue-600 mx-auto mt-2"></div>
              </h2>
            </div>
            {transactions.length > 0 && (
              <button
                onClick={clearTransactions}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Transaction List */}
          <div className="p-6">
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Transaction History</h3>
                <p className="text-gray-500 mb-4">You haven't made any transactions yet.</p>
                <button
                  onClick={() => navigate("/ticket-booking")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Your First Trip
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction, index) => (
                  <div
                    key={transaction.id || index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2-2v-5H8z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Trip #{transaction.tripId}</h3>
                          <p className="text-sm text-gray-500">{formatDate(transaction.timestamp)}</p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                      >
                        {transaction.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Route:</span>
                        <p className="font-medium">
                          {transaction.origin} → {transaction.destination}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Operator:</span>
                        <p className="font-medium">{transaction.operator}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Departure:</span>
                        <p className="font-medium">{transaction.departure}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Seat:</span>
                        <p className="font-medium">{transaction.seatPosition}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Bus Class:</span>
                        <span className="text-sm font-medium">{transaction.busClass}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-blue-600">{transaction.amountPaid}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionHistory
