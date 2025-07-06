const MessageAlert = ({ message, type = "success" }) => {
  if (!message) return null

  const alertClasses = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
  }

  return (
    <div className={`${alertClasses[type]} border px-4 py-3 rounded mx-4 mt-4`}>
      <p className="text-center font-medium">{message}</p>
    </div>
  )
}

export default MessageAlert
