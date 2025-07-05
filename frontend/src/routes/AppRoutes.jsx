import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import { useUser } from '../context/UserContext';

import TicketBooking from '../pages/TicketBooking';
import PassengerHomePage from '../pages/PassengerHomePage';
import AdminHomePage from '../pages/AdminHomePage';
import StaffHomePage from '../pages/StaffHomePage';
import ProtectedRoute from './ProtectedRoute';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import ScheduleViewing from '../pages/ScheduleViewing';
import TransactionHistory from '../pages/TransactionHistory';
import Transaction from '../pages/Transaction';
import PaymentUpload from '../pages/PaymentUpload';
import UserControl from '../pages/UserControl';
import TripManagement from '../pages/TripManagement';
import HomeRedirectRoute from './HomeRedirectRoute';


export default function AppRoutes() {
  const {role} = useUser()

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomeRedirectRoute />} />
      <Route path="/*" element={<h1>Page Not Found</h1>} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected route for role: 'PASSENGER' */}
      <Route element={<ProtectedRoute allowedRoles={['PASSENGER']} />}>
        <Route path="/passenger-home" element={<PassengerHomePage />} />
        <Route path="/ticket-booking" element={<TicketBooking />} />
        <Route path="/schedule-viewing" element={<ScheduleViewing />} /> 
        <Route path="/transaction-history" element={<TransactionHistory />} />
      </Route>

      {/* Protected route for role: 'TICKET_STAFF' */}
      <Route element={<ProtectedRoute allowedRoles={['TICKET_STAFF']} />}>
        <Route path="/staff-home" element={<StaffHomePage />} />
      </Route>

      {/* Protected route for role: 'TRANSIT_ADMIN' */}
      <Route element={<ProtectedRoute allowedRoles={['TRANSIT_ADMIN']} />}>
        <Route path="/admin-home" element={<AdminHomePage />} />
      </Route>

      <Route path="/transaction" element={<Transaction />} />
      <Route path="/payment-upload" element={<PaymentUpload />} />
      <Route path="/user-control" element={<UserControl />} />
      <Route path="/trip-management" element={<TripManagement />} />

    </Routes>
  );
}