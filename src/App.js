import { Routes, Route } from 'react-router-dom'

import AdminDashboard from './admin/admin-dashboard';
import Landing from './alebrijes/landing/landing';
import Contactanos from './admin/contactanos';
import Nosotros from './admin/Nosotros';
import Lugares from './admin/Lugares';
import LugaresEdit from './admin/Lugares-edit';
import LandingAd from "./admin/landing";
import Map from './alebrijes/map/map';
import Auth from './alebrijes/landing/auth'
import RoutesTester from './Routestester';

export default function App() {
  return (
    <>
    <RoutesTester/>
    <Routes>
      <Route path="/map" element={<Map />} />
      <Route path="/admin-dashboard-que-pro" element={<AdminDashboard />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/contactanos-ad" element={<Contactanos />} />
      <Route path="/nosotros-ad" element={<Nosotros />} />
      <Route path="/lugares-ad" element={<Lugares />} />
      <Route path="/lugares-ad-edit" element={<LugaresEdit />} />
      <Route path="/landing-ad" element={<LandingAd />} />
      <Route path="/login" element={<Auth />} />
    </Routes>
    </>
  )
}