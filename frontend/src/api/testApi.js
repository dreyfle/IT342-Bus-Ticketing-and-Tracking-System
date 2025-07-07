import axios from "axios"

// Test function to check if backend is reachable
export const testBackendConnection = async () => {
  console.log("🧪 Testing backend connection...")

  try {
    // Test 1: Basic server connection
    console.log("Test 1: Basic server connection")
    const healthResponse = await axios.get("http://localhost:8080")
    console.log("✅ Server is reachable:", healthResponse.status)
  } catch (error) {
    console.error("❌ Server not reachable:", error.message)
  }

  try {
    // Test 2: API endpoint without auth
    console.log("Test 2: API endpoint without auth")
    const apiResponse = await axios.get("http://localhost:8080/api/user")
    console.log("✅ API endpoint works:", apiResponse.data)
  } catch (error) {
    console.error("❌ API endpoint error:")
    console.error("Status:", error.response?.status)
    console.error("Message:", error.response?.data)
  }
}