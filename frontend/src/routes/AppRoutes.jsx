import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import TicketBooking from '../pages/TicketBooking';
import PassengerHomePage from '../pages/PassengerHomePage';
import AdminHomePage from '../pages/AdminHomePage';
import StaffHomePage from '../pages/StaffHomePage';
import ScheduleViewing from '../pages/ScheduleViewing';
import TransactionHistory from '../pages/TransactionHistory';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ticket-booking" element={<TicketBooking />} />
        <Route path="/passenger-home" element={<PassengerHomePage />} />
        <Route path="/admin-home" element={<AdminHomePage />} />
        <Route path="/staff-home" element={<StaffHomePage />} />
        <Route path="/schedule-viewing" element={<ScheduleViewing />} /> 
        <Route path="/transaction-history" element={<TransactionHistory />} />
      </Routes>
    </Router>
  );
}