import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          navigate('/');
          return;
        }

        const response = await axios.get('http://localhost:8080/testimonials', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const formattedTestimonials = response.data.map((testimonial) => ({
          ...testimonial,
          id: testimonial._id, // Keep id for internal use, but use email for API calls
        }));
        setTestimonials(formattedTestimonials);
        console.log('Fetched testimonials:', formattedTestimonials);
      } catch (err) {
        console.error('Error fetching testimonials:', err.response || err.message);
        setError(err.response?.data || 'Failed to fetch testimonials. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [navigate]);

  const handleDelete = async (email) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/testimonials/${encodeURIComponent(email)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setTestimonials(testimonials.filter((testimonial) => testimonial.email !== email));
      console.log(`Testimonial with email "${email}" deleted successfully`);
    } catch (err) {
      console.error('Error deleting testimonial:', err.response || err.message);
      setError(err.response?.data || 'Failed to delete testimonial. Please check the email and try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Testimonials Dashboard</h2>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/create-testimonial')}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Create New Testimonial
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {loading ? (
          <p className="text-center">Loading testimonials...</p>
        ) : testimonials.length === 0 ? (
          <p className="text-center">No testimonials found. Create one!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold">{testimonial.name}</h3>
                <p className="text-gray-600">{testimonial.review}</p>
                <p className="text-sm text-gray-500">Email: {testimonial.email}</p>
                <div className="mt-4 space-x-2">
                  <button
                    onClick={() => navigate(`/edit-testimonial/${encodeURIComponent(testimonial.email)}`)}
                    className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.email)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTestimonials;