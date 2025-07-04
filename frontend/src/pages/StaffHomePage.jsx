const StaffHomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-900">BTTS</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600 text-xl" role="img" aria-label="user">👤</span>
              </div>
              <button className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Ticket Staff View</h2>
          <p className="text-blue-700">Assist customers with ticketing services</p>
        </div>

        {/* Feature Cards */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-200">
          <div className="grid gap-6 md:grid-cols-1 max-w-md mx-auto">
            {/* Walk-in Booking */}
            <div className="group cursor-pointer">
              <div className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <span className="text-white text-3xl" role="img" aria-label="ticket">🎫</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Walk-in Booking</h3>
                <p className="text-blue-100 text-sm">Process walk-in customer bookings</p>
              </div>
            </div>

            {/* Seat Tracking */}
            <div className="group cursor-pointer">
              <div className="bg-blue-500 hover:bg-blue-600 transition-colors rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <span className="text-white text-3xl" role="img" aria-label="seat">💺</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Payment Approval</h3>
                <p className="text-blue-100 text-sm">Monitor payment status and approvals</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffHomePage;