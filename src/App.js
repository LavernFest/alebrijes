import { Routes, Route, Navigate } from 'react-router-dom'

import AdminDashboard from './admin/admin-dashboard';
import Landing from './alebrijes/landing/landing';
import Contactanos from './admin/contactanos';
import NosotrosAd from './admin/Nosotros';
import Lugares from './admin/Lugares';
import LugaresEdit from './admin/Lugares-edit';
import LandingAd from "./admin/landing";
import Map from './alebrijes/map/map';
import Auth from './alebrijes/landing/auth';
import RoutesTester from './Routestester';
import Nosotros from './alebrijes/components/alebrijesnosotros';
import UserProfile from './alebrijes/perfil/userProfile';
import Galeria from './alebrijes/components/galeria';
import Contacto from './alebrijes/components/alebrijescontactanos';

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user || user.role !== "admin") return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <>
    <RoutesTester/>
    <Routes>
      {/* Rutas públicas */}
        <Route path="/"        element={<Landing />} />
        <Route path="/map"     element={<Map />} />
        <Route path="/login"   element={<Auth />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/perfil-edit" element={<UserProfile />} />
        <Route path="/galeria" element={<Galeria />} />
        <Route path="/contactanos" element={<Contacto />} />
        


        {/* Rutas protegidas admin */}
        <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/contactanos-ad"  element={<AdminRoute><Contactanos /></AdminRoute>} />
        <Route path="/nosotros-ad"     element={<AdminRoute><NosotrosAd /></AdminRoute>} />
        <Route path="/lugares-ad"      element={<AdminRoute><Lugares /></AdminRoute>} />
        <Route path="/lugares-ad-edit" element={<AdminRoute><LugaresEdit /></AdminRoute>} />
        <Route path="/landing-ad"      element={<AdminRoute><LandingAd /></AdminRoute>} />
      </Routes>
    </>
  )
}