import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import  Login  from './pages/Login';
import  Register  from './pages/Register';
import  Movies  from './pages/Movies';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import Shows from './pages/Shows';
import History from './pages/History';
import Navbar from './components/Navbar';
import AddMovie from './pages/AddMovie';
import AddShow from './pages/AddShow';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/shows" element={<Shows />} />
        <Route path="/book/:showId" element={<Booking />} />
       <Route path="/payment/:bookingId" element={<Payment />} />
        <Route path="/history" element={<History />} />
        <Route path="/add-movie" element={<AddMovie />} />
        <Route path="/add-show" element={<AddShow />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;