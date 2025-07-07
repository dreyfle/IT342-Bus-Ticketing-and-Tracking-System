"use client"

const UserDetailsCard = ({ user, onEditUser, onUpdateRole, onClear }) => {
  return (
    <div className="bg-white border-2 border-gray-800 rounded-lg p-4 shadow-lg">
      {/* User Info Header */}
      <div className="grid grid-cols-3 gap-4 mb-4 pb-2 border-b border-gray-300">
        <div className="font-bold text-gray-900">Name</div>
        <div className="font-bold text-gray-900">Email</div>
        <div className="font-bold text-gray-900">Role</div>
      </div>

      {/* User Info */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-gray-900">{`${user.firstName} ${user.lastName}`}</div>
        <div className="text-gray-900 text-sm">{user.email}</div>
        <div className="text-gray-900">{user.role}</div>
      </div>

      {/* Action Buttons */}
      <div className="text-center space-y-3">
        <div className="flex justify-center space-x-4">
          <button
            onClick={onEditUser}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-medium"
          >
            Edit User
          </button>
          <button
            onClick={onUpdateRole}
            className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors font-medium"
          >
            Update Role
          </button>
        </div>
        <button
          onClick={onClear}
          className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors font-medium"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export default UserDetailsCard
