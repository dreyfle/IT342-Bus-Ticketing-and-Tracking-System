import { createContext, useState, useContext } from 'react';

// 1. Create the context
const UserContext = createContext(null);

// 2. Create the provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 3. Custom hook for easier usage
export const useUser = () => useContext(UserContext);

// 4. Export the context (if needed directly)
export default UserContext;
