"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTransactions } from "../context/TransactionContext"
import { formatDate } from "../utils/dateUtils" // Import formatDate function

const TicketBooking = () => {
  const navigate = useNavigate()
  const { transactions } = useTransactions()
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [showSeatSelection, setShowSeatSelection] = useState(false)

  // Generate trips for any date
  const generateTripsForDate = (date) => {
    const destinations = [
      { name: "San Fernando", fare: 175, class: "Aircon" },
      { name: "Naga", fare: 200, class: "Aircon" },
      { name: "Toledo", fare: 225, class: "Ordinary" },
      { name: "Oslob", fare: 275, class: "Aircon" },
      { name: "Badian", fare: 250, class: "Aircon" },
      { name: "Carcar", fare: 150, class: "Ordinary" },
      { name: "Argao", fare: 180, class: "Aircon" },
      { name: "Dalaguete", fare: 190, class: "Ordinary" },
    ]

    const times = ["6:30 AM", "8:00 AM", "10:30 AM", "1:15 PM", "3:45 PM", "6:00 PM"]
    const statuses = ["SCHEDULED", "BOARDING", "DEPARTED", "CANCELLED"]

    const trips = []
    const selectedDateObj = new Date(date)
    const today = new Date()

    destinations.forEach((dest, destIndex) => {
      times.forEach((time, timeIndex) => {
        const tripId = `${Math.floor(Math.random() * 90000) + 10000}`
        const totalSeats = 20
        const bookedSeats = Math.floor(Math.random() * 15) // Random booked seats
        const reservedSeats = Math.floor(Math.random() * 3) // Random reserved seats
        const unavailableSeats = 2 // Driver seat + 1 broken seat
        const availableSeats = totalSeats - bookedSeats - reservedSeats - unavailableSeats

        // Determine status based on date and time
        let status = "SCHEDULED"
        let tripHour = Number.parseInt(time.split(":")[0]) // Use let instead of const
        if (time.includes("PM") && tripHour !== 12) tripHour += 12
        if (selectedDateObj < today) {
          status = Math.random() > 0.8 ? "CANCELLED" : "DEPARTED"
        } else if (selectedDateObj.toDateString() === today.toDateString()) {
          const currentHour = new Date().getHours()
          if (tripHour <= currentHour) {
            status = Math.random() > 0.7 ? "BOARDING" : "DEPARTED"
          }
        }

        trips.push({
          tripId,
          origin: "South Bus Terminal",
          destination: dest.name,
          busClass: dest.class,
          departureDate: date,
          departureTime: time,
          status,
          availableSeats: Math.max(0, availableSeats),
          bookedSeats,
          reservedSeats,
          unavailableSeats,
          totalSeats,
          fare: `₱${dest.fare}.00`,
        })
      })
    })

    return trips.sort((a, b) => {
      const timeA = new Date(`2000/01/01 ${a.departureTime}`)
      const timeB = new Date(`2000/01/01 ${b.departureTime}`)
      return timeA - timeB
    })
  }

  const handleBackClick = () => {
    navigate("/passenger-home")
  }

  const handleBookTrip = (trip) => {
    setSelectedTrip(trip)
    setShowSeatSelection(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800"
      case "BOARDING":
        return "bg-yellow-100 text-yellow-800"
      case "DEPARTED":
        return "bg-gray-100 text-gray-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusDescription = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "Trip created, claiming passengers"
      case "BOARDING":
        return "Boarding passengers on the bus"
      case "DEPARTED":
        return "Bus has departed"
      case "CANCELLED":
        return "Trip cancelled"
      default:
        return status
    }
  }

  const canBook = (status, availableSeats) => {
    return (status === "SCHEDULED" || status === "BOARDING") && availableSeats > 0
  }

  // Get trips for selected date
  const filteredTrips = selectedDate ? generateTripsForDate(selectedDate) : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Seat Selection Modal */}
      {showSeatSelection && selectedTrip && (
        <SeatSelectionModal
          trip={selectedTrip}
          onClose={() => {
            setShowSeatSelection(false)
            setSelectedTrip(null)
          }}
          onSeatSelected={(seatId) => {
            // Navigate to payment with selected trip and seat
            navigate("/payment-upload", {
              state: {
                transactionData: {
                  ...selectedTrip,
                  seatPosition: seatId,
                  status: "RESERVED", // Initial status after booking
                  paymentStatus: "Pending",
                  needsApproval: true,
                },
                isNewBooking: true,
              },
            })
            setShowSeatSelection(false)
            setSelectedTrip(null)
          }}
        />
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={handleBackClick} className="p-2 hover:bg-blue-100 rounded-full transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-blue-900">BTTS</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200">
          {/* Page Title */}
          <div className="px-6 py-6 border-b border-blue-200">
            <h2 className="text-3xl font-bold text-blue-900 text-center mb-6">
              Ticket Booking
              <div className="w-24 h-1 bg-blue-600 mx-auto mt-2"></div>
            </h2>

            {/* Date Filter */}
            <div className="max-w-md mx-auto">
              <label className="block text-sm font-medium text-blue-700 mb-2">Select A Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-900 font-medium"
                  min={new Date().toISOString().split("T")[0]}
                  max="2025-12-31"
                />
              </div>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate("")}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
                >
                  Clear selection
                </button>
              )}
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-200 bg-blue-50">
                  <th className="px-4 py-4 text-left text-sm font-semibold text-blue-900 border-r border-blue-200">
                    Trip ID
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-blue-900 border-r border-blue-200">
                    Origin
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-blue-900 border-r border-blue-200">
                    Destination
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-blue-900 border-r border-blue-200">
                    Bus Class
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-blue-900 border-r border-blue-200">
                    Departure
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-blue-900 border-r border-blue-200">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-blue-900 border-r border-blue-200">
                    Seats
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-blue-900 border-r border-blue-200">
                    Fare
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-blue-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!selectedDate && (
                  <tr>
                    <td colSpan="9" className="px-4 py-12 text-center text-blue-600">
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-16 h-16 text-blue-300 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-lg font-medium">Select a date to view available trips</p>
                        <p className="text-sm text-blue-500 mt-1">Choose your travel date from the calendar above</p>
                      </div>
                    </td>
                  </tr>
                )}
                {filteredTrips.map((trip, index) => (
                  <tr key={trip.tripId} className="border-b border-blue-100 hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-4 text-sm font-bold text-blue-900 border-r border-blue-100">
                      #{trip.tripId}
                    </td>
                    <td className="px-4 py-4 text-sm text-blue-900 border-r border-blue-100">{trip.origin}</td>
                    <td className="px-4 py-4 text-sm text-blue-900 border-r border-blue-100">{trip.destination}</td>
                    <td className="px-4 py-4 text-sm text-blue-900 border-r border-blue-100">{trip.busClass}</td>
                    <td className="px-4 py-4 text-sm text-blue-900 border-r border-blue-100">
                      <div className="flex flex-col">
                        <span className="font-medium">{formatDate(trip.departureDate)}</span>
                        <span className="text-xs text-blue-600">{trip.departureTime}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 border-r border-blue-100">
                      <div className="flex flex-col">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-1 ${getStatusColor(trip.status)}`}
                        >
                          {trip.status}
                        </span>
                        <span className="text-xs text-gray-500">{getStatusDescription(trip.status)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-blue-900 border-r border-blue-100">
                      <div className="flex flex-col">
                        <span className={`${trip.availableSeats === 0 ? "text-red-600" : "text-green-600"}`}>
                          {trip.availableSeats}/{trip.totalSeats}
                        </span>
                        <span className="text-xs text-gray-500">available</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-green-600 border-r border-blue-100">
                      {trip.fare}
                    </td>
                    <td className="px-4 py-4">
                      {canBook(trip.status, trip.availableSeats) ? (
                        <button
                          onClick={() => handleBookTrip(trip)}
                          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Book
                        </button>
                      ) : (
                        <span className="px-4 py-2 bg-gray-300 text-gray-500 text-sm rounded-lg font-medium cursor-not-allowed">
                          {trip.status === "DEPARTED"
                            ? "Departed"
                            : trip.status === "CANCELLED"
                              ? "Cancelled"
                              : trip.availableSeats === 0
                                ? "Full"
                                : "Unavailable"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// Seat Selection Modal Component
const SeatSelectionModal = ({ trip, onClose, onSeatSelected }) => {
  const [selectedSeat, setSelectedSeat] = useState(null)

  // Generate seat layout with different statuses
  const generateSeatLayout = () => {
    const seats = {}
    const rows = ["1", "2", "3", "4", "5"]
    const cols = ["A", "B", "C", "D"]

    // Initialize all seats as OPEN
    rows.forEach((row) => {
      cols.forEach((col) => {
        seats[`${row}${col}`] = "OPEN"
      })
    })

    // Set some seats as BOOKED (based on trip data)
    const bookedCount = trip.bookedSeats || 0
    const bookedSeats = ["1A", "1B", "2C", "3A", "3D", "4B", "5A", "5C"].slice(0, bookedCount)
    bookedSeats.forEach((seat) => {
      seats[seat] = "BOOKED"
    })

    // Set some seats as RESERVED
    const reservedCount = trip.reservedSeats || 0
    const reservedSeats = ["2A", "2D", "4A"].slice(0, reservedCount)
    reservedSeats.forEach((seat) => {
      if (seats[seat] === "OPEN") {
        seats[seat] = "RESERVED"
      }
    })

    // Set unavailable seats (driver seat and broken seat)
    seats["1C"] = "UNAVAILABLE" // Driver area
    seats["5D"] = "UNAVAILABLE" // Broken seat

    return seats
  }

  const seatLayout = generateSeatLayout()

  const getSeatColor = (status, isSelected) => {
    if (isSelected) return "bg-blue-500 text-white border-blue-600"

    switch (status) {
      case "OPEN":
        return "bg-green-100 text-green-800 border-green-300 hover:bg-green-200 cursor-pointer"
      case "BOOKED":
        return "bg-red-100 text-red-800 border-red-300 cursor-not-allowed"
      case "RESERVED":
        return "bg-yellow-100 text-yellow-800 border-yellow-300 cursor-not-allowed"
      case "UNAVAILABLE":
        return "bg-gray-300 text-gray-600 border-gray-400 cursor-not-allowed"
      default:
        return "bg-gray-100 text-gray-600 border-gray-300"
    }
  }

  const handleSeatClick = (seatId) => {
    if (seatLayout[seatId] === "OPEN") {
      setSelectedSeat(seatId)
    }
  }

  const handleConfirmSeat = () => {
    if (selectedSeat) {
      onSeatSelected(selectedSeat)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Your Seat</h3>
          <p className="text-gray-600">
            Trip #{trip.tripId} - {trip.origin} to {trip.destination}
          </p>
          <p className="text-sm text-blue-600">
            {formatDate(trip.departureDate)} at {trip.departureTime}
          </p>
        </div>

        {/* Bus Layout */}
        <div className="relative mb-6">
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
            {["1", "2", "3", "4", "5"].map((row) =>
              ["A", "B", "C", "D"].map((col) => {
                const seatId = `${row}${col}`
                const status = seatLayout[seatId]
                const isSelected = selectedSeat === seatId

                return (
                  <button
                    key={seatId}
                    onClick={() => handleSeatClick(seatId)}
                    disabled={status !== "OPEN"}
                    className={`
                      w-14 h-14 rounded-lg border-2 font-bold text-sm transition-all duration-300 transform hover:scale-105
                      ${getSeatColor(status, isSelected)}
                    `}
                  >
                    {seatId}
                  </button>
                )
              }),
            )}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-gray-600">OPEN - Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 border border-blue-600 rounded"></div>
              <span className="text-gray-600">Selected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span className="text-gray-600">BOOKED - Ticket issued</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
              <span className="text-gray-600">RESERVED - In checkout</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 border border-gray-400 rounded"></div>
              <span className="text-gray-600">UNAVAILABLE - Can't use</span>
            </div>
          </div>
        </div>

        {/* Selected Seat Info */}
        {selectedSeat && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
            <div className="text-center">
              <p className="text-blue-900 font-medium">
                Selected Seat: <strong>{selectedSeat}</strong>
              </p>
              <p className="text-blue-700 text-sm">
                Fare: <strong>{trip.fare}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-xl hover:bg-gray-600 transition-colors font-medium"
          >
            Cancel
          </button>
          {selectedSeat && (
            <button
              onClick={handleConfirmSeat}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Proceed to Payment
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TicketBooking
