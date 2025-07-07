import { UserProvider } from './context/UserContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AppRoutes from './routes/AppRoutes';
import { TransactionProvider } from './context/TransactionContext';
import { BrowserRouter } from 'react-router-dom';

function App() {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <UserProvider>
          <TransactionProvider>
            <AppRoutes />
          </TransactionProvider>
        </UserProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

export default App;