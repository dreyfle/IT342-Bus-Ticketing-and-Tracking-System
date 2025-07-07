"use client"

const UserSearchBar = ({ searchQuery, onSearchChange, onSearch }) => {
  return (
    <div className="relative mb-8">
      <input
        type="text"
        placeholder="Search by Gmail, first name, or last name..."
        value={searchQuery}
        onChange={onSearchChange}
        className="w-full px-4 py-3 pr-12 border-2 border-gray-800 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
      />
      <button
        onClick={onSearch}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-600"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  )
}

export default UserSearchBar
