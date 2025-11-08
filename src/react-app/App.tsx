import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import MenuPage from "@/react-app/pages/Menu";
import SchedulePage from "@/react-app/pages/Schedule";
import DeliveryPage from "@/react-app/pages/Delivery";
import NutritionAssistantPage from "@/react-app/pages/NutritionAssistant";
import Navbar from "@/react-app/components/Navbar";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/nutrition" element={<NutritionAssistantPage />} />
        </Routes>
      </div>
    </Router>
  );
}
