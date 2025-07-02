import { useNavigate } from "react-router-dom"

const TransactionHistory = () => {
  const navigate = useNavigate()

  const transactions = []

  const handleBackClick = () => {
    navigate("/passenger-home")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">BTTS</h1>
          </div>

          <div className="flex items-center">
            <button
              onClick={handleBackClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back to passenger home"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Transaction History
              <div className="w-32 h-1 bg-blue-600 mx-auto mt-2"></div>
            </h2>
          </div>

          <div className="p-6">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-r border-gray-300">
                        Transaction ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-r border-gray-300">
                        Date Paid
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <svg
                              className="w-12 h-12 text-gray-300 mb-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <p className="text-lg font-medium text-gray-900 mb-1">No transactions found</p>
                            <p className="text-sm text-gray-500">
                              Your transaction history will appear here once you make your first booking.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      transactions.map((transaction, index) => (
                        <tr key={index} className="hover:bg-blue-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">
                            {transaction.transactionId}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">
                            {transaction.datePaid}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">{transaction.amountPaid}</td>
                        </tr>
                      ))
                    )}

                    {transactions.length > 0 &&
                      Array.from({ length: Math.max(0, 8 - transactions.length) }).map((_, index) => (
                        <tr key={`empty-${index}`} className="bg-gray-50">
                          <td className="px-6 py-4 border-r border-gray-200">&nbsp;</td>
                          <td className="px-6 py-4 border-r border-gray-200">&nbsp;</td>
                          <td className="px-6 py-4">&nbsp;</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Total Transactions: {transactions.length}</span>
              <span>
                Total Amount: ₱
                {transactions
                  .reduce((sum, transaction) => {
                    const amount = Number.parseFloat(transaction?.amountPaid?.replace("₱", "") || "0")
                    return sum + amount
                  }, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionHistory