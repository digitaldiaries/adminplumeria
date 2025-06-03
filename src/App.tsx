import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Accommodations from './pages/Accommodations';
import AccommodationForm from './pages/AccommodationForm';
import Gallery from './pages/Gallery';
import Services from './pages/Services';
import ServiceForm from './pages/ServiceForm';
import Bookings from './pages/Bookings';
import Calendar from './pages/Calendar';
import CreateBooking from './pages/CreateBooking';
import Coupons from './pages/Coupons';
import Blogs from './pages/Blogs';
import BlogForm from './pages/BlogForm';
import Categories from './pages/Categories';
import CategoryForm from './pages/CategoryForm';
import Packages from './pages/Packages';
import PackageForm from './pages/PackageForm';
import Users from './pages/Users';
import UserForm from './pages/UserForm';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="accommodations" element={<Accommodations />} />
          <Route path="accommodations/new" element={<AccommodationForm />} />
          <Route path="accommodations/:id" element={<AccommodationForm />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="services" element={<Services />} />
          <Route path="services/new" element={<ServiceForm />} />
          <Route path="services/:id" element={<ServiceForm />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="bookings/new" element={<CreateBooking />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="blogs/new" element={<BlogForm />} />
          <Route path="blogs/:id" element={<BlogForm />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/:id" element={<CategoryForm />} />
          <Route path="packages" element={<Packages />} />
          <Route path="packages/new" element={<PackageForm />} />
          <Route path="packages/:id" element={<PackageForm />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserForm />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;