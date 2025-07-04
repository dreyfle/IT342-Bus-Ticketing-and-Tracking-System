import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useTransactions } from "../context/TransactionContext"

const PaymentUpload = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { addTransaction } = useTransactions()

  const transactionData = location.state?.transactionData

  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)

  const handleBackClick = () => {
    navigate("/transaction")
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
      navigate("/transaction")
      return
    }

    setIsUploading(true)

    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Add transaction to context with payment proof
      const transactionWithPayment = {
        ...transactionData,
        paymentMethod: "GCash",
        paymentProof: selectedFile.name,
        paymentStatus: "Paid",
      }

      addTransaction(transactionWithPayment)

      // Show success message
      alert("Payment uploaded successfully! Your transaction has been confirmed.")

      // Navigate to transaction history
      navigate("/transaction-history")
    } catch (error) {
      alert("Error uploading payment. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const toggleQRCode = () => {
    setShowQRCode(!showQRCode)
  }

  if (!transactionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Transaction data not found</h2>
          <button
            onClick={() => navigate("/transaction")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Transaction
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
            <span className="text-sm">Passenger E</span>
          </div>
        </div>
      </div>

      {/* Upload Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-4 text-center">
            <h2 className="text-lg font-semibold">Upload Payment Screenshot</h2>
          </div>

          <div className="p-6">
            {/* Transaction Summary */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Payment Details</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Trip ID:</span>
                  <span className="font-medium">{transactionData.tripId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Route:</span>
                  <span className="font-medium">
                    {transactionData.origin} → {transactionData.destination}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium text-blue-600">GCash</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="text-gray-900 font-semibold">Amount:</span>
                  <span className="text-blue-600 font-bold">{transactionData.amountPaid}</span>
                </div>
              </div>
            </div>

            {/* File Upload Area */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Upload Payment Screenshot</label>
                <button
                  onClick={toggleQRCode}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                  title="View GCash QR Code"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 12h-4.01M12 12v4m-4-4h4m0 0V8a4 4 0 118 0v4M3 16l3 3 3-3M3 16h6m6 0l3 3 3-3m-6 0h6"
                    />
                  </svg>
                  <span className="text-xs">QR Code</span>
                </button>
              </div>

              {/* QR Code Modal */}
              {showQRCode && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">GCash Payment QR Code</h3>
                      <button onClick={toggleQRCode} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="text-center">
                      <img
                        src="/images/qrcodegcash.jpg"
                        alt="GCash QR Code"
                        className="w-full max-w-xs mx-auto rounded-lg shadow-md"
                        onError={(e) => {
                          console.log("Image failed to load:", e.target.src)
                          e.target.src = "/placeholder.svg?height=200&width=200"
                        }}
                      />
                      <p className="text-sm text-gray-600 mt-3">
                        Scan this QR code with your GCash app to make the payment
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                    <span className="text-sm font-medium text-gray-900">Selected File:</span>
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

            {/* Instructions */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Instructions:</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Click the QR Code button above to view the payment QR code</li>
                <li>• Scan the QR code with your GCash app to make payment</li>
                <li>• Take a clear screenshot of your GCash payment confirmation</li>
                <li>• Upload the screenshot using the button above</li>
                <li>• Accepted formats: PNG, JPG, JPEG (Max: 5MB)</li>
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
                  Uploading...
                </div>
              ) : (
                "Confirm Payment"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentUpload
