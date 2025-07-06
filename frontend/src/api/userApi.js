import axios from 'axios';

const API_BASE = '/api/user'; // Adjust this if backend runs on a different domain or port

// 1. Get all users
export const getAllUsers = (token) =>
  axios.get(API_BASE, {
    headers: { Authorization: `Bearer ${token}` },
  });

// 2. Update user role by email
export const updateUserRole = (token, email, role) =>
  axios.put(`${API_BASE}/role`, { email, role }, {
    headers: { Authorization: `Bearer ${token}` },
  });

// 3. Update user details by ID
export const updateUserDetails = (token, id, userDTO) =>
  axios.put(`${API_BASE}/${id}`, userDTO, {
    headers: { Authorization: `Bearer ${token}` },
  });

// 4. Delete user by ID
export const deleteUser = (token, id) =>
  axios.delete(`${API_BASE}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });