"use client"

const PageHeader = ({ title, onBackClick }) => {
  return (
    <>
      {/* Header */}
      <div className="bg-gray-200 border-b-2 border-gray-400">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">BTTS</h1>
          <button
            onClick={onBackClick}
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
        <h2 className="text-xl font-bold text-center text-gray-900 underline">{title}</h2>
      </div>
    </>
  )
}

export default PageHeader