import axios from "axios"
import api from "../axiosConfig"

const API_BASE = "http://localhost:8080/api/user"

//http://localhost:8080/api/ + http://localhost:8080/api/user

console.log("🌐 API_BASE URL:", API_BASE)

export const getAllUsers = async (token) => {
  console.log("🚀 getAllUsers called with token:", token)

  try {
    // 🔥 TRY WITHOUT AUTHENTICATION FIRST
    const config = {
      headers: {
        "Content-Type": "application/json",
        // Comment out authorization for testing
        // Authorization: `Bearer ${token}`,
      },
    }

    console.log("📋 Request config:", config)
    console.log("🎯 Making request to:", API_BASE)

    const response = await axios.get(API_BASE, config)

    console.log("✅ Success! Response:", response)
    return response
  } catch (error) {
    console.error("❌ API Error Details:")
    console.error("Error message:", error.message)
    console.error("Error code:", error.code)
    console.error("Response status:", error.response?.status)
    console.error("Response data:", error.response?.data)
    console.error("Response headers:", error.response?.headers)

    // If 401/403, try again without auth
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log("🔄 Trying without authentication...")
      try {
        const noAuthResponse = await axios.get(API_BASE)
        console.log("✅ Success without auth:", noAuthResponse)
        return noAuthResponse
      } catch (noAuthError) {
        console.error("❌ Still failed without auth:", noAuthError)
      }
    }

    throw error
  }
}

export const updateUserRole = (token, email, role) =>
  api.put(
    `${API_BASE}/role`,
    { email, role },
  )

export const updateUserDetails = (token, id, userDTO) =>
  api.put(`${API_BASE}/${id}`, userDTO)

export const deleteUser = (token, id) =>
  api.delete(`${API_BASE}/${id}`)