import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditTestimonial = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    review: '',
  });
  const [status, setStatus] = useState({
    loading: false,
    error: '',
    success: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchTestimonial = async () => {
      setStatus({ loading: true, error: '', success: '' });
      const token = localStorage.getItem('token');
      if (!token) {
        setStatus({
          loading: false,
          error: 'Please log in to edit a testimonial.',
          success: '',
        });
        setIsModalOpen(true);
        setTimeout(() => navigate('/'), 2000);
        return;
      }

      try {
        console.log('Fetching testimonial with email:', email);
        const response = await axios.get(
          `https://licapp.onrender.com/testimonials/${encodeURIComponent(email)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const { data } = response;
        console.log('Fetched testimonial data:', data);
        setFormData({
          name: data.name || '',
          email: data.email || email,
          review: data.review || '',
        });
      } catch (err) {
        console.error('Fetch error:', err.response || err.message);
        setStatus({
          loading: false,
          error: err.response?.data || 'Testimonial not found. Please try again.',
          success: '',
        });
        setIsModalOpen(true);
      } finally {
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchTestimonial();
  }, [email, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    if (!formData.name || !formData.review) {
      setStatus({
        loading: false,
        error: 'Please fill in all required fields (Name, Review).',
        success: '',
      });
      setIsModalOpen(true);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setStatus({
        loading: false,
        error: 'Please log in to edit a testimonial.',
        success: '',
      });
      setIsModalOpen(true);
      navigate('/');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        review: formData.review,
      };

      console.log('Updating testimonial with payload:', payload);
      const response = await axios.put(
        `https://licapp.onrender.com/testimonials/${encodeURIComponent(email)}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setStatus({
        loading: false,
        error: '',
        success: response.data || 'Testimonial updated successfully!',
      });
      setIsModalOpen(true);
      setTimeout(() => navigate('/dashboard/testimonials'), 2000);
    } catch (err) {
      console.error('Update error:', err.response || err.message);
      setStatus({
        loading: false,
        error: err.response?.data || 'Failed to update testimonial. Please try again.',
        success: '',
      });
      setIsModalOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setStatus((prev) => ({ ...prev, error: '', success: '' }));
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
          <h2 className="text-2xl font-bold text-gray-900 font-serif">Edit Testimonial</h2>
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
        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 transform transition-all duration-500 hover:shadow-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif tracking-tight mb-8">
            Edit Testimonial
          </h2>
          {status.loading && !formData.name ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  { id: 'name', label: 'Name', type: 'text', required: true },
                  { id: 'email', label: 'Email', type: 'email', readOnly: true },
                ].map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="block text-sm font-medium text-gray-700 font-sans mb-1"
                    >
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      value={formData[field.id]}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 text-gray-800 placeholder-gray-400"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      required={field.required}
                      readOnly={field.readOnly}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label
                  htmlFor="review"
                  className="block text-sm font-medium text-gray-700 font-sans mb-1"
                >
                  Review
                </label>
                <textarea
                  id="review"
                  name="review"
                  value={formData.review}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 text-gray-800 placeholder-gray-400"
                  rows="5"
                  placeholder="Enter testimonial review"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={status.loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-3 rounded-lg hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 transition duration-300 font-medium text-lg tracking-wide transform hover:scale-105"
              >
                {status.loading ? 'Updating...' : 'Update Testimonial'}
              </button>
            </form>
          )}

          {/* Modal for Error/Success */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full transform transition-all duration-300 scale-95 animate-in">
                <h3 className="text-xl font-bold text-gray-900 font-serif mb-4">
                  {status.success ? 'Success' : 'Error'}
                </h3>
                <p className={status.success ? 'text-green-600 font-sans' : 'text-red-600 font-sans'}>
                  {status.success || status.error}
                </p>
                <button
                  onClick={closeModal}
                  className="mt-6 w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditTestimonial;