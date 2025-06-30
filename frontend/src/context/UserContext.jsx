import { jwtDecode } from 'jwt-decode';
import { createContext, useState, useEffect, useContext, useMemo } from 'react';

// 1. Create the context
const UserContext = createContext(null);

// 2. Create the provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

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
        }
      } catch (error) {
        console.error("Failed to decode JWT:", error);
        setUser(null);
        setRole(null);
      }
    }
  }, []);

  // 3. Determine authentication status (memoized for performance)
  const isAuthenticated = useMemo(() => !!user, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, role, setRole, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};

// 3. Custom hook for easier usage
export const useUser = () => useContext(UserContext);

// 4. Export the context (if needed directly)
export default UserContext;
