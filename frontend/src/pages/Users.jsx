import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../api/userApi';

const Users = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token'); // Make sure token is set after login

  useEffect(() => {
    getAllUsers(token)
      .then(res => setUsers(res.data.data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    deleteUser(token, id)
      .then(() => {
        alert("User deleted.");
        setUsers(prev => prev.filter(u => u.id !== id));
      })
      .catch(err => console.error('Error deleting user:', err));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User List</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="space-y-2">
          {users.map(user => (
            <li key={user.id} className="flex justify-between bg-gray-100 p-3 rounded shadow">
              <div>
                <strong>{user.name}</strong> <br />
                <span>{user.email}</span>
              </div>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Users;
