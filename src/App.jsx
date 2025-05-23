import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DashboardPlans from './components/DashboardPlans';
import CreatePlan from './components/CreatePlans';
import EditPlan from './components/EditPlans';
import DashboardTestimonials from './components/DashboardTestimonials';
import CreateTestimonial from './components/CreateTestimonial';
import EditTestimonial from './components/EditTestimonials';
import DashboardForms from './components/DashboardForms';
import CreateBlog from './components/CreateBlog';
import EditBlog from './components/Editblog';

const App = () => {
  console.log('App component rendered');
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
        <Route path="/dashboard/plans" element={<ProtectedRoute component={DashboardPlans} />} />
        <Route path="/dashboard/testimonials" element={<ProtectedRoute component={DashboardTestimonials} />} />
        <Route path="/dashboard/forms" element={<ProtectedRoute component={DashboardForms} />} />
         <Route path="/create-blog" element={<ProtectedRoute component={CreateBlog} />} /> 
      <Route path="/edit-blog/:title" element={<ProtectedRoute component={EditBlog} />} /> 
         <Route path="/create-plan" element={<ProtectedRoute component={CreatePlan} />} />
       <Route path="/edit-plan/:title" element={<ProtectedRoute component={EditPlan} />} />
     <Route path="/create-testimonial" element={<ProtectedRoute component={CreateTestimonial} />} />
           <Route path="/edit-testimonial/:id" element={<ProtectedRoute component={EditTestimonial} />} />
        <Route path="*" element={<div className="text-center p-6">404: Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

const ProtectedRoute = ({ component: Component }) => {
  const token = localStorage.getItem('token');
  console.log('ProtectedRoute: Token exists:', !!token);
  return token ? <Component /> : <Navigate to="/" />;
};

export default App;