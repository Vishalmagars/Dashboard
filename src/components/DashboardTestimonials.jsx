import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          setIsModalOpen(true);
          setTimeout(() => navigate('/'), 2000);
          return;
        }

        const response = await axios.get('https://licapp.onrender.com/testimonials', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const formattedTestimonials = response.data.map((testimonial) => ({
          ...testimonial,
          id: testimonial._id,
        }));
        setTestimonials(formattedTestimonials);
        console.log('Fetched testimonials:', formattedTestimonials);
      } catch (err) {
        console.error('Error fetching testimonials:', err.response || err.message);
        setError(err.response?.data || 'Failed to fetch testimonials. Please try again.');
        setIsModalOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [navigate]);

  const handleDelete = (email) => {
    setTestimonialToDelete(email);
    setError('');
    setSuccess('');
    setIsDeleteConfirm(true);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://licapp.onrender.com/testimonials/${encodeURIComponent(testimonialToDelete)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setTestimonials(testimonials.filter((testimonial) => testimonial.email !== testimonialToDelete));
      setSuccess(`Testimonial with email "${testimonialToDelete}" deleted successfully`);
      setIsDeleteConfirm(false);
      setTimeout(() => setIsModalOpen(false), 2000);
      console.log(`Testimonial with email "${testimonialToDelete}" deleted successfully`);
    } catch (err) {
      console.error('Error deleting testimonial:', err.response || err.message);
      setError(err.response?.data || 'Failed to delete testimonial. Please try again.');
      setIsDeleteConfirm(false);
      setIsModalOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
    setSuccess('');
    setIsDeleteConfirm(false);
    setTestimonialToDelete(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white/90 backdrop-blur-lg shadow-xl transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 p-6 z-50`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 font-serif">Testimonials Dashboard</h2>
          <button
            className="lg:hidden text-gray-600 hover:text-gray-800"
            onClick={toggleSidebar}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="space-y-2">
          {[
            { path: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { path: '/dashboard/plans', label: 'View Plans', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { path: '/dashboard/testimonials', label: 'View Testimonials', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5v2h4m6 0h4v-2h-4m-6-6h.01M9 16h.01' },
            { path: '/dashboard/forms', label: 'View Forms', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
            { path: '/create-blog', label: 'Create Blog', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
            { path: '/create-testimonial', label: 'Create Testimonial', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5v2h4m6 0h4v-2h-4m-6-6h.01M9 16h.01' },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 rounded-lg transition duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              <span>{item.label}</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg transition duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h3a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <button
          className="lg:hidden mb-4 text-gray-600 hover:text-gray-800"
          onClick={toggleSidebar}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 transform transition-all duration-500 hover:shadow-3xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif tracking-tight">
              Testimonials Dashboard
            </h2>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg hover:from-gray-600 hover:to-gray-700 transition duration-300 transform hover:scale-105"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate('/create-testimonial')}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 transform hover:scale-105"
              >
                Create New Testimonial
              </button>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
            </div>
          ) : testimonials.length === 0 ? (
            <p className="text-center text-gray-600 text-lg font-sans">No testimonials found. Create one!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white/90 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <h3 className="text-xl font-bold text-gray-900 font-serif">{testimonial.name}</h3>
                  <p className="text-gray-600 mt-2 line-clamp-3 font-sans">{testimonial.review}</p>
                  <p className="text-sm text-gray-500 mt-2 font-sans">Email: {testimonial.email}</p>
                  <div className="mt-4 flex space-x-2">
                    {/* <button
                      onClick={() => navigate(`/edit-testimonial/${(testimonial.email)}`)}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition duration-300 transform hover:scale-105"
                    >
                      Edit
                    </button> */}
                    <button
                      onClick={() => handleDelete(testimonial.email)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition duration-300 transform hover:scale-105"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal for Error/Success/Delete Confirmation */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full transform transition-all duration-300 scale-95 animate-in">
                <h3 className="text-xl font-bold text-gray-900 font-serif mb-4">
                  {isDeleteConfirm ? 'Confirm Delete' : success ? 'Success' : 'Error'}
                </h3>
                <p className={success ? 'text-green-600' : 'text-red-600 font-sans'}>
                  {isDeleteConfirm
                    ? `Are you sure you want to delete the testimonial for "${testimonialToDelete}"?`
                    : success || error}
                </p>
                {isDeleteConfirm ? (
                  <div className="mt-6 flex space-x-4">
                    <button
                      onClick={confirmDelete}
                      className="flex-1 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition duration-200"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={closeModal}
                    className="mt-6 w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTestimonials;