import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import TicketBooking from '../pages/TicketBooking';
import PassengerHomePage from '../pages/PassengerHomePage';
import AdminHomePage from '../pages/AdminHomePage';
import StaffHomePage from '../pages/StaffHomePage';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ticket-booking" element={<TicketBooking />} />
        <Route path="/passenger-home" element={<PassengerHomePage />} />
        <Route path="/admin-home" element={<AdminHomePage />} />
        <Route path="/staff-home" element={<StaffHomePage />} />
      </Routes>
    </Router>
  );
}