import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTransactions } from "../context/TransactionContext"

const Transaction = () => {
  const navigate = useNavigate()
  const { addTransaction } = useTransactions()

  const handleBackClick = () => {
    navigate("/ticket-booking")
  }

  // State for form fields
  const [formData, setFormData] = useState({
    tripId: "",
    origin: "South Bus Terminal",
    destination: "",
    operator: "",
    busClass: "",
    departure: "",
    status: "",
    seatPosition: "",
    amountPaid: "",
  })

  const [currentStep, setCurrentStep] = useState(1) // 1: Form, 2: Payment
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Options data
  const tripIds = [10201, 10245, 10289, 10334, 10378, 10423, 10467, 10512, 10556, 10601, 10645, 10689]

  const destinations = [
    "Naga",
    "San Fernando",
    "Alcoy",
    "Aloguinsan",
    "Argao",
    "Dalaguete",
    "Oslob",
    "Balamban",
    "Carcar",
    "Sibonga",
    "Barili",
    "Badian",
    "Toledo",
    "Santander",
  ]

  const operators = [
    "Maria Santos Cruz",
    "Juan Carlos Reyes",
    "Ana Beatriz Gonzales",
    "Roberto Miguel Torres",
    "Carmen Rosa Villanueva",
  ]

  const busClasses = ["Aircon", "Ordinary"]

  const departureTimes = [
    "05:30",
    "06:15",
    "07:00",
    "08:30",
    "09:45",
    "11:00",
    "12:30",
    "14:15",
    "15:45",
    "17:00",
    "18:30",
    "20:00",
  ]

  const statuses = ["Available", "Boarding", "Departed", "Cancelled"]

  const seatPositions = [
    "1A",
    "1B",
    "1C",
    "1D",
    "2A",
    "2B",
    "2C",
    "2D",
    "3A",
    "3B",
    "3C",
    "3D",
    "4A",
    "4B",
    "4C",
    "4D",
    "5A",
    "5B",
    "5C",
    "5D",
  ]

  const amountOptions = []
  for (let i = 150; i <= 300; i += 25) {
    amountOptions.push(`₱${i}.00`)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleContinueToPayment = () => {
    // Validate all required fields
    const requiredFields = [
      "tripId",
      "destination",
      "operator",
      "busClass",
      "departure",
      "status",
      "seatPosition",
      "amountPaid",
    ]
    const missingFields = requiredFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`)
      return
    }

    setCurrentStep(2)
  }

  const handleGCashPayment = () => {
    // Navigate to payment upload page with transaction data
    navigate("/payment-upload", { state: { transactionData: formData } })
  }

  const handleBackToForm = () => {
    setCurrentStep(1)
  }

  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        {/* Header */}
        <div className="bg-blue-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={handleBackToForm} className="p-2 hover:bg-blue-700 rounded-full transition-colors">
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

        {/* Payment Method Selection */}
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-blue-600 text-white px-6 py-4 text-center">
              <h2 className="text-lg font-semibold">Choose Payment Method:</h2>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {/* GCash Payment Option */}
                <button
                  onClick={handleGCashPayment}
                  className="w-full bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">G</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">GCash</h3>
                      <p className="text-sm text-gray-500">Pay with GCash QR Code</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 12h-4.01M12 12v4m-4-4h4m0 0V8a4 4 0 118 0v4M3 16l3 3 3-3M3 16h6m6 0l3 3 3-3m-6 0h6"
                      />
                    </svg>
                  </div>
                </button>

                {/* Transaction Summary */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Transaction Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trip ID:</span>
                      <span className="font-medium">{formData.tripId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Route:</span>
                      <span className="font-medium">
                        {formData.origin} → {formData.destination}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seat:</span>
                      <span className="font-medium">{formData.seatPosition}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="text-gray-900 font-semibold">Total Amount:</span>
                      <span className="text-blue-600 font-bold">{formData.amountPaid}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
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

      {/* Transaction Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-4 text-center">
            <h2 className="text-lg font-semibold">Transaction</h2>
          </div>

          {/* Transaction Details */}
          <div className="p-6 space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">TripID*</label>
                <select
                  className="w-full bg-gray-50 rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.tripId}
                  onChange={(e) => handleInputChange("tripId", e.target.value)}
                >
                  <option value="">Select Trip ID</option>
                  {tripIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Bus Class</label>
                <select
                  className="w-full bg-gray-50 rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.busClass}
                  onChange={(e) => handleInputChange("busClass", e.target.value)}
                >
                  <option value="">Select Class</option>
                  {busClasses.map((busClass) => (
                    <option key={busClass} value={busClass}>
                      {busClass}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Origin</label>
                <select
                  className="w-full bg-gray-50 rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.origin}
                  onChange={(e) => handleInputChange("origin", e.target.value)}
                >
                  <option value="South Bus Terminal">South Bus Terminal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Departure</label>
                <select
                  className="w-full bg-gray-50 rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.departure}
                  onChange={(e) => handleInputChange("departure", e.target.value)}
                >
                  <option value="">Select Time</option>
                  {departureTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Destination</label>
                <select
                  className="w-full bg-gray-50 rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.destination}
                  onChange={(e) => handleInputChange("destination", e.target.value)}
                >
                  <option value="">Select Destination</option>
                  {destinations.map((dest) => (
                    <option key={dest} value={dest}>
                      {dest}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                <select
                  className="w-full bg-gray-50 rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                >
                  <option value="">Select Status</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Operator</label>
                <select
                  className="w-full bg-gray-50 rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.operator}
                  onChange={(e) => handleInputChange("operator", e.target.value)}
                >
                  <option value="">Select Operator</option>
                  {operators.map((operator) => (
                    <option key={operator} value={operator}>
                      {operator}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Seat Position</label>
                <select
                  className="w-full bg-gray-50 rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.seatPosition}
                  onChange={(e) => handleInputChange("seatPosition", e.target.value)}
                >
                  <option value="">Select Seat</option>
                  {seatPositions.map((seat) => (
                    <option key={seat} value={seat}>
                      {seat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amount Paid */}
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Amount Paid</label>
              <select
                className="w-full bg-blue-50 rounded-lg px-4 py-3 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.amountPaid}
                onChange={(e) => handleInputChange("amountPaid", e.target.value)}
              >
                <option value="">Select Amount</option>
                {amountOptions.map((amount) => (
                  <option key={amount} value={amount}>
                    {amount}
                  </option>
                ))}
              </select>
            </div>

            {/* Continue Button */}
            <div className="pt-4">
              <button
                onClick={handleContinueToPayment}
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Transaction
