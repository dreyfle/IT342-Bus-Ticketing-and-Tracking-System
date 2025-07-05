import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useTransactions } from "../context/TransactionContext"

const Transaction = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { addTransaction, updateTransaction } = useTransactions()

  // Check if this is a rebooking operation
  const rebookData = location.state?.rebookData
  const isRebooking = !!rebookData

  const handleBackClick = () => {
    navigate("/ticket-booking")
  }

  // State for form fields
  const [formData, setFormData] = useState({
    origin: "South Bus Terminal",
    destination: "",
    busClass: "",
    departure: "",
    seatPosition: "",
    amountPaid: "",
    status: "RESERVED", // Default status for new bookings
  })

  const [currentStep, setCurrentStep] = useState(1) // 1: Form, 2: Payment
  const [isAnimating, setIsAnimating] = useState(false)
  const [showSeatSelection, setShowSeatSelection] = useState(false)

  // Sample occupied seats (you can make this dynamic based on trip data)
  const [occupiedSeats, setOccupiedSeats] = useState(["1A", "2C", "3B", "4D", "5A"])

  // Pre-fill form if rebooking
  useEffect(() => {
    if (isRebooking && rebookData) {
      setFormData({
        origin: rebookData.origin || "South Bus Terminal",
        destination: rebookData.destination || "",
        busClass: rebookData.busClass || "",
        departure: rebookData.departure || "",
        seatPosition: rebookData.seatPosition || "",
        amountPaid: rebookData.amountPaid || "",
        status: "RESERVED",
      })
    }
  }, [isRebooking, rebookData])

  // Options data
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

  const busClasses = ["Aircon", "Ordinary"]

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

  const handleSeatSelect = (seatId) => {
    if (!occupiedSeats.includes(seatId)) {
      handleInputChange("seatPosition", seatId)
      setShowSeatSelection(false)
    }
  }

  const renderSeatLayout = () => {
    const rows = ["1", "2", "3", "4", "5"]
    const cols = ["A", "B", "C", "D"]

    return (
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-blue-200">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Select Your Seat</h3>
          <p className="text-sm text-gray-600">Click on an available seat to select</p>
        </div>

        {/* Bus Layout */}
        <div className="relative">
          {/* Driver Section */}
          <div className="flex justify-end mb-4">
            <div className="w-16 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>

          {/* Seat Grid */}
          <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
            {rows.map((row) =>
              cols.map((col) => {
                const seatId = `${row}${col}`
                const isOccupied = occupiedSeats.includes(seatId)
                const isSelected = formData.seatPosition === seatId

                return (
                  <button
                    key={seatId}
                    onClick={() => handleSeatSelect(seatId)}
                    disabled={isOccupied}
                    className={`
                      w-14 h-14 rounded-lg border-2 font-bold text-sm transition-all duration-300 transform hover:scale-105
                      ${
                        isSelected
                          ? "bg-blue-500 text-white border-blue-600 shadow-lg"
                          : isOccupied
                            ? "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
                            : "bg-green-100 text-green-800 border-green-300 hover:bg-green-200 hover:border-green-400 cursor-pointer"
                      }
                    `}
                  >
                    {seatId}
                  </button>
                )
              }),
            )}
          </div>

          {/* Legend */}
          <div className="flex justify-center space-x-6 mt-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-gray-600">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 border border-blue-600 rounded"></div>
              <span className="text-gray-600">Selected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 border border-gray-400 rounded"></div>
              <span className="text-gray-600">Occupied</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => setShowSeatSelection(false)}
            className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-xl hover:bg-gray-600 transition-colors font-medium"
          >
            Cancel
          </button>
          {formData.seatPosition && (
            <button
              onClick={() => setShowSeatSelection(false)}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Confirm Seat {formData.seatPosition}
            </button>
          )}
        </div>
      </div>
    )
  }

  const handleContinueToPayment = () => {
    // Validate all required fields
    const requiredFields = ["destination", "busClass", "departure", "seatPosition", "amountPaid"]
    const missingFields = requiredFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`)
      return
    }

    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep(2)
      setIsAnimating(false)
    }, 300)
  }

  const handleGCashPayment = () => {
    // Generate a trip ID for the transaction
    const tripId = Math.floor(Math.random() * 90000) + 10000
    const transactionData = {
      ...formData,
      tripId: tripId,
      operator: "BTTS System", // Default operator
      isRebooking: isRebooking,
      originalTripId: rebookData?.id,
    }

    // Navigate to payment upload page with transaction data
    navigate("/payment-upload", { state: { transactionData } })
  }

  const handleInstapayPayment = () => {
    // Generate a trip ID for the transaction
    const tripId = Math.floor(Math.random() * 90000) + 10000
    const transactionData = {
      ...formData,
      tripId: tripId,
      operator: "BTTS System",
      paymentMethod: "InstaPay",
      isRebooking: isRebooking,
      originalTripId: rebookData?.id,
    }

    // Navigate to payment upload page with transaction data
    navigate("/payment-upload", { state: { transactionData } })
  }

  const handleBackToForm = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep(1)
      setIsAnimating(false)
    }, 300)
  }

  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 bg-white/80 backdrop-blur-xl shadow-lg border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToForm}
                className="group p-3 hover:bg-blue-50 rounded-full transition-all duration-300 hover:scale-110"
              >
                <svg
                  className="w-6 h-6 text-blue-600 group-hover:text-blue-700 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  BTTS
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">P</span>
              </div>
              <span className="text-gray-700 font-medium">Passenger</span>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="relative z-10 max-w-lg mx-auto px-6 py-12">
          <div
            className={`bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-500 ${isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-8 py-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isRebooking ? "Rebooking Payment" : "Choose Payment Method"}
                </h2>
                <p className="text-blue-100">Select your preferred payment option</p>
              </div>
            </div>

            <div className="p-8">
              <div className="space-y-4">
                {/* GCash Payment Option */}
                <button
                  onClick={handleGCashPayment}
                  className="group w-full bg-gradient-to-r from-white to-blue-50 border-2 border-blue-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-xl">G</span>
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900 text-lg">GCash</h3>
                        <p className="text-blue-600 font-medium">Pay with GCash QR Code</p>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                      <svg
                        className="w-6 h-6 text-blue-600 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* InstaPay Payment Option */}
                <button
                  onClick={handleInstapayPayment}
                  className="group w-full bg-gradient-to-r from-white to-orange-50 border-2 border-orange-200 rounded-2xl p-6 hover:border-orange-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-xl">I</span>
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900 text-lg">InstaPay</h3>
                        <p className="text-orange-600 font-medium">Pay with InstaPay QR Code</p>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-300">
                      <svg
                        className="w-6 h-6 text-orange-600 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Transaction Summary */}
                <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {isRebooking ? "Rebooking Summary" : "Transaction Summary"}
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Route:</span>
                      <span className="font-bold text-gray-900">
                        {formData.origin} → {formData.destination}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Date & Time:</span>
                      <span className="font-bold text-gray-900">{new Date(formData.departure).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Seat:</span>
                      <span className="font-bold text-blue-600 text-lg">{formData.seatPosition}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-blue-200 pt-3 mt-3">
                      <span className="text-gray-900 font-bold text-lg">Total Amount:</span>
                      <span className="text-blue-600 font-bold text-2xl">{formData.amountPaid}</span>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Seat Selection Modal */}
      {showSeatSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          {renderSeatLayout()}
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackClick}
              className="group p-3 hover:bg-blue-50 rounded-full transition-all duration-300 hover:scale-110"
            >
              <svg
                className="w-6 h-6 text-blue-600 group-hover:text-blue-700 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                BTTS
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">P</span>
            </div>
            <span className="text-gray-700 font-medium">Passenger</span>
          </div>
        </div>
      </div>

      {/* Transaction Content */}
      <div className="relative z-10 max-w-lg mx-auto px-6 py-12">
        <div
          className={`bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-500 ${isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-8 py-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2-2v-5H8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {isRebooking ? "Rebook Your Trip" : "Book New Trip"}
              </h2>
              {isRebooking && <p className="text-blue-100">Modify your existing booking</p>}
            </div>
          </div>

          {/* Transaction Details */}
          <div className="p-8 space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Origin</label>
                <div className="relative">
                  <select
                    className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-4 py-3 border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 font-medium appearance-none"
                    value={formData.origin}
                    onChange={(e) => handleInputChange("origin", e.target.value)}
                  >
                    <option value="South Bus Terminal">South Bus Terminal</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Bus Class</label>
                <div className="relative">
                  <select
                    className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-4 py-3 border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 font-medium appearance-none"
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
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Destination</label>
                <div className="relative">
                  <select
                    className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-4 py-3 border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 font-medium appearance-none"
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
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Seat Position</label>
                <button
                  type="button"
                  onClick={() => setShowSeatSelection(true)}
                  className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-4 py-3 border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 font-medium text-left flex items-center justify-between hover:from-blue-100 hover:to-indigo-100"
                >
                  <span className={formData.seatPosition ? "text-blue-900" : "text-gray-500"}>
                    {formData.seatPosition || "Choose Seat"}
                  </span>
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Departure Date & Time */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 flex items-center">
                <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Departure Date & Time
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-4 py-4 border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-900 font-medium transition-all duration-300"
                  value={formData.departure}
                  onChange={(e) => handleInputChange("departure", e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  max="2025-12-31T23:59"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Amount Paid */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 flex items-center">
                <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                Amount Paid
              </label>
              <div className="relative">
                <select
                  className="w-full bg-gradient-to-r from-green-50 to-blue-50 rounded-xl px-4 py-4 border-2 border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-900 font-bold text-lg transition-all duration-300 appearance-none"
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
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="pt-4">
              <button
                onClick={handleContinueToPayment}
                className="group w-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:via-blue-600 hover:to-indigo-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>{isRebooking ? "Continue to Rebooking Payment" : "Continue to Payment"}</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Transaction
