import axios from "axios"
import api from "../axiosConfig"

const API_BASE = "/api/user"

export const getAllUsers = (token) =>
  axios.get(API_BASE, {
    headers: { Authorization: `Bearer ${token}` },
  })

export const updateUserRole = (token, email, role) =>
  api.put(
    `${API_BASE}/role`,
    { email, role },
  )

export const updateUserDetails = (token, id, userDTO) =>
  axios.put(`${API_BASE}/${id}`, userDTO, {
    headers: { Authorization: `Bearer ${token}` },
  })

export const deleteUser = (token, id) =>
  axios.delete(`${API_BASE}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
