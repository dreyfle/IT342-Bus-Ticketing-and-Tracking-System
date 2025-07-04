import { useEffect, useState } from 'react';
import { UserProvider } from './context/UserContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AppRoutes from './routes/AppRoutes';
import { TransactionProvider } from './context/TransactionContext';


function App() {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;


  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserProvider>
        <TransactionProvider>
          <AppRoutes />
        </TransactionProvider>
      </UserProvider>
      
    </GoogleOAuthProvider>
  );
}

export default App;