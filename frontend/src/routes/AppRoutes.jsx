import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import { useUser } from '../context/UserContext';


export default function AppRoutes() {
  const { role } = useUser();


  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/home" element={<div>Home Page</div>} />
        

    
    
      </Routes>
    </Router>
  )
}