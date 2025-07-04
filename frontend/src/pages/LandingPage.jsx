import { useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
import { useUser } from '../context/UserContext';
import { Navigate } from 'react-router-dom';
import api from '../axiosConfig';

export default function LandingPage() {
  const {user, setUser, role, setRole} = useUser();
  const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwtToken'));
  const [protectedData, setProtectedData] = useState(null);
  const [error, setError] = useState(null);

  // Accessing environment variables
  // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // useEffect(() => {
  //   // If a JWT token exists, try to fetch protected data
  //   if (jwtToken) {
  //     fetchProtectedData();
  //   }
  // }, [jwtToken]);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // console.log('Google login success:', credentialResponse);
      // Send the id_token to your backend for verification
      const response = await api.post("/auth/google", {
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
        // fetchProtectedData();
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

  // const handleLogout = () => {
  //   googleLogout(); // Clear Google session
  //   localStorage.removeItem('jwtToken'); // Clear our JWT
  //   setJwtToken(null);
  //   setUser(null);
  //   setRole(null);
  //   setProtectedData(null);
  //   setError(null);
  //   console.log('Logged out');
  // };

  // const fetchProtectedData = async () => {
  //   if (!jwtToken) {
  //     setError("No JWT token available to fetch protected data.");
  //     return;
  //   }
  //   try {
  //     const response = await axios.get(API_BASE_URL+'/protected', {
  //       headers: {
  //         Authorization: `Bearer ${jwtToken}`
  //       }
  //     });
  //     setProtectedData(response.data);
  //     setError(null);
  //   } catch (err) {
  //     console.error('Error fetching protected data:', err);
  //     setError("Failed to fetch protected data. Your session might have expired. Please log in again.");
  //     // If 401 or 403, might need to re-login
  //     if (err.response && (err.response.status === 401 || err.response.status === 403)) {
  //       handleLogout(); // Force logout if token is invalid
  //     }
  //     setProtectedData(null);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 flex items-center justify-center p-4">
      {!jwtToken ? (
        // Login Layout
        <div className="w-full max-w-4xl flex bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Left Side - Title */}
          <div className="flex-1 flex items-center justify-center p-12 bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 leading-tight">
                Bus Ticketing and<br />
                Tracking System<br />
                <span className="text-blue-600">(BTTS)</span>
              </h1>
            </div>
          </div>
          
          {/* Right Side - Login */}
          <div className="flex-1 flex items-center justify-center p-12 bg-gray-200">
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">
                  Sign in with Google
                </h2>
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                    locale="en"
                    theme="outline"
                    size="large"
                    width="300"
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm text-center mt-4">{error}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        role && (
          role === "PASSENGER" ? (
            <Navigate to="/passenger-home" replace />
          ) : role === "TICKET_STAFF" ? (
            <Navigate to="/staff-home" replace />
          ) : role === "TRANSIT_ADMIN" ? (
            <Navigate to="/admin-home" replace />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        )
    )}
    </div>
  );
}