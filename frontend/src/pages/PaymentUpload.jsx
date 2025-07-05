import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useTransactions } from "../context/TransactionContext"

const PaymentUpload = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { addTransaction } = useTransactions()

  // Add formatDate function here
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { year: "numeric", month: "long", day: "numeric" }
    return date.toLocaleDateString(undefined, options)
  }

  const transactionData = location.state?.transactionData
  const isNewBooking = location.state?.isNewBooking
  const paymentMethod = "GCash" // Default to GCash

  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleBackClick = () => {
    navigate("/ticket-booking")
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png"]
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, JPG, or PNG)")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      setSelectedFile(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a payment screenshot first")
      return
    }

    if (!transactionData) {
      alert("Transaction data not found")
      navigate("/ticket-booking")
      return
    }

    setIsUploading(true)

    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Prepare transaction with payment proof
      const transactionWithPayment = {
        tripId: transactionData.tripId,
        origin: transactionData.origin,
        destination: transactionData.destination,
        operator: "BTTS System",
        busClass: transactionData.busClass,
        departure: `${transactionData.departureDate}T${convertTo24Hour(transactionData.departureTime)}`,
        status: "RESERVED", // Initial status - waiting for staff approval
        seatPosition: transactionData.seatPosition,
        amountPaid: transactionData.fare,
        paymentMethod: paymentMethod,
        paymentProof: selectedFile.name,
        paymentStatus: "Pending Approval",
        needsApproval: true,
        bookingDate: new Date().toISOString(),
      }

      // Add transaction to context
      addTransaction(transactionWithPayment)

      // Show success message with approval info
      alert(
        "Payment uploaded successfully!\n\n" +
          "Your ticket status is now RESERVED.\n" +
          "Please wait for Ticket Staff to approve your payment.\n" +
          "Once approved, your ticket status will change to BOOKED.",
      )

      // Navigate to a waiting/status page
      navigate("/ticket-booking")
    } catch (error) {
      alert("Error uploading payment. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ")
    let [hours, minutes] = time.split(":")
    if (hours === "12") {
      hours = "00"
    }
    if (modifier === "PM") {
      hours = Number.parseInt(hours, 10) + 12
    }
    return `${hours}:${minutes}`
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  if (!transactionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Transaction data not found</h2>
          <button
            onClick={() => navigate("/ticket-booking")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Ticket Booking
          </button>
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
            <span className="text-sm">Passenger</span>
          </div>
        </div>
      </div>

      {/* Payment Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-4 text-center">
            <h2 className="text-lg font-semibold">Online Payment</h2>
            <p className="text-blue-100 text-sm mt-1">Pay with {paymentMethod}</p>
          </div>

          <div className="p-6">
            {/* Booking Summary */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Trip ID:</span>
                  <span className="font-medium">#{transactionData.tripId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Route:</span>
                  <span className="font-medium">
                    {transactionData.origin} → {transactionData.destination}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium">
                    {formatDate(transactionData.departureDate)} at {transactionData.departureTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seat:</span>
                  <span className="font-medium text-blue-600">{transactionData.seatPosition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bus Class:</span>
                  <span className="font-medium">{transactionData.busClass}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="text-gray-900 font-semibold">Total Amount:</span>
                  <span className="text-blue-600 font-bold">{transactionData.fare}</span>
                </div>
              </div>
            </div>

            {/* GCash QR Code Section */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h5 className="font-medium text-green-900 mb-3 text-center">GCash Payment QR Code</h5>
              <div className="text-center">
                <img
                  src="/images/gcash-qr.png"
                  alt="GCash QR Code"
                  className="w-48 h-48 mx-auto rounded-lg shadow-md object-contain"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=200&width=200"
                  }}
                />
                <p className="text-sm text-green-700 mt-3">Scan this QR code with your GCash app</p>
                <p className="text-lg font-bold text-green-600 mt-2">Amount: {transactionData.fare}</p>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="font-medium text-blue-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Payment Instructions:
              </h5>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Scan the QR code above with your GCash app</li>
                <li>
                  Pay the exact amount: <strong>{transactionData.fare}</strong>
                </li>
                <li>Take a screenshot of your payment confirmation</li>
                <li>Upload the screenshot below</li>
                <li>Wait for Ticket Staff approval</li>
              </ol>
            </div>

            {/* File Upload Area */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Payment Screenshot</label>
              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600 mb-1">Click to upload screenshot</p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                  </label>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-900">Payment Screenshot:</span>
                    <button onClick={handleRemoveFile} className="text-red-600 hover:text-red-800 text-sm">
                      Remove
                    </button>
                  </div>
                  {previewUrl && (
                    <div className="mb-3">
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Payment screenshot preview"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                  <p className="text-sm text-gray-600">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              )}
            </div>

            {/* Status Info */}
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h5 className="font-medium text-yellow-900 mb-2">After Payment Upload:</h5>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>
                  • Your ticket status will be <strong>RESERVED</strong>
                </li>
                <li>• Ticket Staff will review your payment</li>
                <li>
                  • Once approved, status changes to <strong>BOOKED</strong>
                </li>
                <li>• You'll receive confirmation notification</li>
              </ul>
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading Payment...
                </div>
              ) : (
                "Submit Payment & Reserve Ticket"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentUpload
