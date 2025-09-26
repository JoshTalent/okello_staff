import { Routes, Route } from "react-router-dom";

// import main page
import Login from "./pages/login"
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import ProfilePage from "./pages/Profile";
const App = () => {
  return (
    <>
      <Routes>
        {/* Public route */}

        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/bookings" element={<Booking />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
};

export default App;
