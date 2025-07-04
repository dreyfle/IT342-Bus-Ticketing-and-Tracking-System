import { useState } from "react"
import { useNavigate } from "react-router-dom"

const TripManagement = () => {
  const navigate = useNavigate()
  const [currentView, setCurrentView] = useState("main") // main, create, seats, addPassenger
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRemovePassenger, setShowRemovePassenger] = useState(false)
  const [showApprovePassenger, setShowApprovePassenger] = useState(false)
  const [selectedPassenger, setSelectedPassenger] = useState(null)
  const [selectedSeat, setSelectedSeat] = useState(null)

  // Static trip data
  const [trips, setTrips] = useState([
    {
      tripId: "10202",
      origin: "South Bus Terminal",
      destination: "Naga",
      operator: "Maria Santos Cruz",
      busClass: "Aircon",
      departure: "05:30",
      status: "Available",
      seats: "0/20",
      fare: "₱200.00",
    },
    {
      tripId: "10245",
      origin: "South Bus Terminal",
      destination: "San Fernando",
      operator: "Juan Carlos Reyes",
      busClass: "Ordinary",
      departure: "06:15",
      status: "Boarding",
      seats: "5/20",
      fare: "₱175.00",
    },
  ])

  // Static seat data
  const [seats, setSeats] = useState({
    "1A": "Available",
    "1B": "Available",
    "1C": "Available",
    "1D": "Available",
    "2A": "Available",
    "2B": "Available",
    "2C": "Available",
    "2D": "Available",
    "3A": "Available",
    "3B": "Available",
    "3C": "Available",
    "3D": "Available",
    "4A": "Available",
    "4B": "Available",
    "4C": "Available",
    "4D": "Available",
    "5A": "Available",
    "5B": "Available",
    "5C": "Available",
    "5D": "Available",
  })

  // Static passenger data
  const passengers = [
    {
      username: "Passenger E",
      desiredSeat: "1A",
      paymentCode: "XXX-XXX",
    },
    {
      username: "Space Taker",
      desiredSeat: "1A",
      paymentCode: "YYY-YYY",
    },
  ]

  // Form data for create trip with dropdown options
  const [formData, setFormData] = useState({
    tripId: "10203",
    origin: "",
    destination: "",
    operator: "",
    busClass: "",
    departure: "",
    status: "",
    seats: "",
    fare: "",
  })

  // Dropdown options (same as Transaction.jsx)
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

  const seatOptions = ["0/20", "5/20", "10/20", "15/20", "20/20"]

  const amountOptions = []
  for (let i = 150; i <= 300; i += 25) {
    amountOptions.push(`₱${i}.00`)
  }

  const handleBackClick = () => {
    if (currentView === "main") {
      navigate("/admin-home")
    } else {
      setCurrentView("main")
    }
  }

  const handleCreateTrip = () => {
    setCurrentView("create")
  }

  const handleUpdateTrip = (trip) => {
    setSelectedTrip(trip)
    alert("Trip updated, Notification sent")
  }

  const handleDeleteTrip = (trip) => {
    setSelectedTrip(trip)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    alert("Trip deleted successfully")
    setShowDeleteConfirm(false)
    setSelectedTrip(null)
  }

  const handleMonitorSeats = () => {
    setCurrentView("seats")
  }

  const handleCreateTripSubmit = () => {
    alert("Trip Successfully Created")
    setCurrentView("main")
  }

  const handleAddPassenger = () => {
    setCurrentView("addPassenger")
  }

  const handleRemovePassenger = () => {
    if (selectedSeat) {
      setShowRemovePassenger(true)
    } else {
      alert("Please select a seat first")
    }
  }

  const confirmRemovePassenger = () => {
    if (selectedSeat) {
      setSeats((prev) => ({
        ...prev,
        [selectedSeat]: "Available",
      }))
      alert("Passenger removed successfully")
      setSelectedSeat(null)
    }
    setShowRemovePassenger(false)
  }

  const handlePassengerSelect = (passenger) => {
    setSelectedPassenger(passenger)
    setShowApprovePassenger(true)
  }

  const handleApprovePassenger = () => {
    alert("Passenger approved successfully")
    setShowApprovePassenger(false)
  }

  const handleSeatClick = (seatId) => {
    setSelectedSeat(seatId)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const renderSeatGrid = () => {
    const rows = ["1", "2", "3", "4", "5"]
    const cols = ["A", "B", "C", "D"]

    return (
      <div className="grid grid-cols-4 gap-2 border-4 border-black p-8 bg-white max-w-2xl">
        {rows.map((row) =>
          cols.map((col) => {
            const seatId = `${row}${col}`
            const isOccupied = seats[seatId] === "Occupied"
            const isSelected = selectedSeat === seatId
            return (
              <div
                key={seatId}
                onClick={() => handleSeatClick(seatId)}
                className={`w-24 h-24 border-2 border-black flex items-center justify-center text-lg font-bold cursor-pointer transition-all ${
                  isSelected
                    ? "bg-blue-500 text-white"
                    : isOccupied
                      ? "bg-gray-400 text-white"
                      : "bg-white hover:bg-blue-100"
                }`}
              >
                {seatId}
              </div>
            )
          }),
        )}
      </div>
    )
  }

  // Main Admin View
  if (currentView === "main") {
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
          <h2 className="text-xl font-bold text-center text-gray-900 underline">Admin View</h2>
        </div>

        {/* Main Content */}
        <div className="flex">
          {/* Table Section */}
          <div className="flex-1 p-4">
            <div className="bg-white border-2 border-black">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="border-r border-black px-2 py-2 text-sm font-bold">TripID</th>
                    <th className="border-r border-black px-2 py-2 text-sm font-bold">Origin</th>
                    <th className="border-r border-black px-2 py-2 text-sm font-bold">Destination</th>
                    <th className="border-r border-black px-2 py-2 text-sm font-bold">Operator</th>
                    <th className="border-r border-black px-2 py-2 text-sm font-bold">Bus Class</th>
                    <th className="border-r border-black px-2 py-2 text-sm font-bold">Departure</th>
                    <th className="border-r border-black px-2 py-2 text-sm font-bold">Status</th>
                    <th className="border-r border-black px-2 py-2 text-sm font-bold">Seats</th>
                    <th className="px-2 py-2 text-sm font-bold">Fare</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip, index) => (
                    <tr
                      key={index}
                      className="border-b border-black cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => setSelectedTrip(trip)}
                    >
                      <td className="border-r border-black px-2 py-2 text-sm">{trip.tripId}</td>
                      <td className="border-r border-black px-2 py-2 text-sm">{trip.origin}</td>
                      <td className="border-r border-black px-2 py-2 text-sm">{trip.destination}</td>
                      <td className="border-r border-black px-2 py-2 text-sm">{trip.operator}</td>
                      <td className="border-r border-black px-2 py-2 text-sm">{trip.busClass}</td>
                      <td className="border-r border-black px-2 py-2 text-sm">{trip.departure}</td>
                      <td className="border-r border-black px-2 py-2 text-sm">{trip.status}</td>
                      <td className="border-r border-black px-2 py-2 text-sm">{trip.seats}</td>
                      <td className="px-2 py-2 text-sm">{trip.fare}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Buttons Section */}
          <div className="w-48 p-4 space-y-4">
            <button
              onClick={handleCreateTrip}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Create Trip
            </button>
            <button
              onClick={() => (selectedTrip ? handleUpdateTrip(selectedTrip) : alert("Please select a trip first"))}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Update Trip
            </button>
            <button
              onClick={() => (selectedTrip ? handleDeleteTrip(selectedTrip) : alert("Please select a trip first"))}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Delete Trip
            </button>
            <button
              onClick={handleMonitorSeats}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Monitor Seats
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white border-2 border-black rounded-lg p-6 max-w-sm mx-4">
              <p className="text-gray-900 font-medium mb-6 text-center">Are you Sure?</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Create Trip View
  if (currentView === "create") {
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

        {/* Form Content */}
        <div className="p-8">
          <div className="max-w-2xl mx-auto bg-gray-200 p-6 rounded-lg">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <label className="text-gray-900 font-medium w-20">TripID*</label>
                  <select
                    value={formData.tripId}
                    onChange={(e) => handleInputChange("tripId", e.target.value)}
                    className="flex-1 px-3 py-2 bg-white rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Trip ID</option>
                    {tripIds.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <label className="text-gray-900 font-medium w-20">Origin</label>
                  <select
                    value={formData.origin}
                    onChange={(e) => handleInputChange("origin", e.target.value)}
                    className="flex-1 px-3 py-2 bg-white rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Origin</option>
                    <option value="South Bus Terminal">South Bus Terminal</option>
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <label className="text-gray-900 font-medium w-20">Destination</label>
                  <select
                    value={formData.destination}
                    onChange={(e) => handleInputChange("destination", e.target.value)}
                    className="flex-1 px-3 py-2 bg-white rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Destination</option>
                    {destinations.map((dest) => (
                      <option key={dest} value={dest}>
                        {dest}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <label className="text-gray-900 font-medium w-20">Operator</label>
                  <select
                    value={formData.operator}
                    onChange={(e) => handleInputChange("operator", e.target.value)}
                    className="flex-1 px-3 py-2 bg-white rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Operator</option>
                    {operators.map((operator) => (
                      <option key={operator} value={operator}>
                        {operator}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <label className="text-gray-900 font-medium w-20">Bus Class</label>
                  <select
                    value={formData.busClass}
                    onChange={(e) => handleInputChange("busClass", e.target.value)}
                    className="flex-1 px-3 py-2 bg-white rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Class</option>
                    {busClasses.map((busClass) => (
                      <option key={busClass} value={busClass}>
                        {busClass}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <label className="text-gray-900 font-medium w-20">Departure</label>
                  <select
                    value={formData.departure}
                    onChange={(e) => handleInputChange("departure", e.target.value)}
                    className="flex-1 px-3 py-2 bg-white rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Time</option>
                    {departureTimes.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <label className="text-gray-900 font-medium w-20">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="flex-1 px-3 py-2 bg-white rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <label className="text-gray-900 font-medium w-20">Seats</label>
                  <select
                    value={formData.seats}
                    onChange={(e) => handleInputChange("seats", e.target.value)}
                    className="flex-1 px-3 py-2 bg-white rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Seats</option>
                    {seatOptions.map((seat) => (
                      <option key={seat} value={seat}>
                        {seat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Fare Field */}
            <div className="mt-6 flex items-center justify-center space-x-3">
              <label className="text-gray-900 font-medium">Fare</label>
              <select
                value={formData.fare}
                onChange={(e) => handleInputChange("fare", e.target.value)}
                className="px-3 py-2 bg-white rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Amount</option>
                {amountOptions.map((amount) => (
                  <option key={amount} value={amount}>
                    {amount}
                  </option>
                ))}
              </select>
            </div>

            {/* Create Trip Button */}
            <div className="mt-8 bg-blue-400 p-4 rounded-lg">
              <button
                onClick={handleCreateTripSubmit}
                className="w-full bg-white text-gray-900 py-3 px-6 rounded-full font-bold hover:bg-gray-100 transition-colors"
              >
                Create Trip
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Seat Selection View
  if (currentView === "seats") {
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
          <h2 className="text-xl font-bold text-center text-gray-900 underline">Seat Selection</h2>
        </div>

        {/* Main Content */}
        <div className="flex p-8">
          {/* Seat Grid */}
          <div className="flex-1 flex justify-center">{renderSeatGrid()}</div>

          {/* Right Panel */}
          <div className="w-64 ml-8 space-y-6">
            {/* Instructions */}
            <div className="bg-gray-200 p-4 rounded border border-black">
              <p className="text-sm text-gray-900 mb-2">
                <strong>Lower numbers are closer to the front of the bus</strong>
              </p>
              <p className="text-sm text-gray-900">
                <strong>Lower letters are closer to the left of the bus</strong>
              </p>
            </div>

            {/* Selected Seat Info */}
            {selectedSeat && (
              <div className="bg-blue-100 p-4 rounded border border-blue-500">
                <p className="text-sm text-blue-900 font-medium">
                  Selected Seat: <strong>{selectedSeat}</strong>
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddPassenger}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Add Passenger
              </button>
              <button
                onClick={handleRemovePassenger}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Remove Passenger
              </button>
            </div>
          </div>
        </div>

        {/* Remove Passenger Modal */}
        {showRemovePassenger && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white border-2 border-black rounded-lg p-6 max-w-sm mx-4">
              <p className="text-gray-900 font-medium mb-6 text-center">Remove Passenger?</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={confirmRemovePassenger}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowRemovePassenger(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Add Passenger View
  if (currentView === "addPassenger") {
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
          <h2 className="text-xl font-bold text-center text-gray-900 underline">Add Passenger</h2>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <div className="max-w-2xl mx-auto bg-white border-2 border-black">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="border-r border-black px-4 py-3 text-left font-bold">Username</th>
                  <th className="border-r border-black px-4 py-3 text-left font-bold">Desired Seat</th>
                  <th className="px-4 py-3 text-left font-bold">Payment Code</th>
                </tr>
              </thead>
              <tbody>
                {passengers.map((passenger, index) => (
                  <tr
                    key={index}
                    className="border-b border-black cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handlePassengerSelect(passenger)}
                  >
                    <td className="border-r border-black px-4 py-3">{passenger.username}</td>
                    <td className="border-r border-black px-4 py-3">{passenger.desiredSeat}</td>
                    <td className="px-4 py-3">{passenger.paymentCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Approve Passenger Modal */}
        {showApprovePassenger && selectedPassenger && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-400 border-2 border-black rounded-lg p-6 max-w-sm mx-4">
              <div className="text-center">
                <p className="text-gray-900 font-medium mb-2">Payment meets Fare.</p>
                <p className="text-gray-900 font-medium mb-2">Seat is available.</p>
                <p className="text-gray-900 font-medium mb-6">Approve Passenger?</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleApprovePassenger}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowApprovePassenger(false)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return null
}

export default TripManagement
