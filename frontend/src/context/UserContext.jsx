import { googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Create the context
const UserContext = createContext(null);

// Helper function to change the casing of the Role Name
function toProperCase(text) {
  return text
    .toLowerCase()                         // Make the entire string lowercase
    .replace(/_/g, ' ')                    // Replace underscores with spaces
    .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
}

// 2. Create the provider component
export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [roleDisplay, setRoleDisplay] = useState(null)

  const decodeTokenToUserData = (token) => {
    try {
      const decoded = jwtDecode(token);

      const user_data = {
        user_id: decoded.userId,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        email: decoded.sub,
      };

      setUser(user_data);

      // If token contains a role, you can also extract and store it
      if (decoded.role) {
        setRole(decoded.role);
        setRoleDisplay(toProperCase(decoded.role))
      }

      navigate("/home");
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      setUser(null);
      setRole(null);
      setRoleDisplay(null);
    }
  }

  const logout = () => {
    googleLogout();
    localStorage.removeItem('jwtToken');
    setUser(null);
    setRole(null);
    setRoleDisplay(null);
    navigate("/");
  }

  const login = (token) => {
    localStorage.setItem('jwtToken', token);
    decodeTokenToUserData(token);
  }

  // 3. Load user data from localStorage on mount
  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      try {
        const decoded = jwtDecode(jwtToken);

        const user_data = {
          user_id: decoded.userId,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.sub,
        };

        setUser(user_data);

        // If token contains a role, you can also extract and store it
        if (decoded.role) {
          setRole(decoded.role);
          setRoleDisplay(toProperCase(decoded.role))
        }
      } catch (error) {
        console.error("Failed to decode JWT:", error);
        setUser(null);
        setRole(null);
        setRoleDisplay(null);
      }
    }
  }, []);

  // 3. Determine authentication status (memoized for performance)
  const isAuthenticated = useMemo(() => !!user, [user]);

  return (
    <UserContext.Provider value={
      { user, setUser, 
        role, setRole, 
        roleDisplay, setRoleDisplay, 
        isAuthenticated, 
        login, logout }
      }>
      {children}
    </UserContext.Provider>
  );
};

// 3. Custom hook for easier usage
export const useUser = () => useContext(UserContext);

// 4. Export the context (if needed directly)
export default UserContext;
