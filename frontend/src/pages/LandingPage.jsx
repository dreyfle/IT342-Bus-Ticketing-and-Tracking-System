import { useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';
import { useUser } from '../context/UserContext';

export default function LandingPage() {
  const {user, setUser, role, setRole} = useUser();
  const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwtToken'));
  const [protectedData, setProtectedData] = useState(null);
  const [error, setError] = useState(null);

  // Accessing environment variables
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // If a JWT token exists, try to fetch protected data
    if (jwtToken) {
      fetchProtectedData();
    }
  }, [jwtToken]);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // console.log('Google login success:', credentialResponse);
      // Send the id_token to your backend for verification
      const response = await axios.post(API_BASE_URL+"/auth/google", {
        idToken: credentialResponse.credential // This is the id_token
      });

      // console.log('Backend response:', response.data);
      const { token, user: backendUser, role } = response.data; // Assuming backend returns {token: "...", user: {...}}

      if (token) {
        localStorage.setItem('jwtToken', token);
        setJwtToken(token);
        setUser(backendUser); // Set user info from backend
        setRole(role);
        setError(null);
        // Now that we have the JWT, try fetching protected data
        fetchProtectedData();
      } else {
        setError("Backend did not return a JWT token.");
        console.error("Backend did not return a JWT token.");
      }

    } catch (err) {
      console.error('Error during Google login or backend communication:', err);
      setError("Login failed. Please try again.");
      localStorage.removeItem('jwtToken');
      setJwtToken(null);
      setUser(null);
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    setError("Google login failed. Please try again.");
  };

  const handleLogout = () => {
    googleLogout(); // Clear Google session
    localStorage.removeItem('jwtToken'); // Clear our JWT
    setJwtToken(null);
    setUser(null);
    setRole(null);
    setProtectedData(null);
    setError(null);
    console.log('Logged out');
  };

  const fetchProtectedData = async () => {
    if (!jwtToken) {
      setError("No JWT token available to fetch protected data.");
      return;
    }
    try {
      const response = await axios.get(API_BASE_URL+'/protected', {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      setProtectedData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching protected data:', err);
      setError("Failed to fetch protected data. Your session might have expired. Please log in again.");
      // If 401 or 403, might need to re-login
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        handleLogout(); // Force logout if token is invalid
      }
      setProtectedData(null);
    }
  };

  return (
    <div className="p-5 font-sans"> {/* Outer container: padding, font family */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Bus Ticketing and Tracking System (BTTS)</h1>

      {!jwtToken ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Login with Google</h2>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            locale="en"
          />
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Welcome, {user ? user.email : 'User'}!</h2>
          <p className="text-gray-600 mb-4">You are logged in with your custom JWT.</p>
          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600 transition-colors duration-200"
          >
            Logout
          </button>

          <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-700">Protected Data Area</h3>
          <p className="text-gray-600 mb-4">This data is fetched using your custom JWT.</p>
          {protectedData ? (
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm text-gray-800">
              {JSON.stringify(protectedData, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">No protected data fetched yet or an error occurred.</p>
          )}
          <button
            onClick={fetchProtectedData}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md cursor-pointer hover:bg-green-600 transition-colors duration-200"
          >
            Refresh Protected Data
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      )}
    </div>
  );
}