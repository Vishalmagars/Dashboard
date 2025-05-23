import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditTestimonial = () => {
  const [testimonial, setTestimonial] = useState({
    name: '',
    review: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { email } = useParams();

  useEffect(() => {
    const fetchTestimonial = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          navigate('/');
          return;
        }

        const response = await axios.get(`http://localhost:8080/testimonials/${encodeURIComponent(email)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const testimonialData = response.data;
        setTestimonial({
          name: testimonialData.name,
          review: testimonialData.review,
          email: testimonialData.email || '',
        });
        console.log('Fetched testimonial for editing:', testimonialData);
      } catch (err) {
        console.error('Error fetching testimonial:', err.response || err.message);
        setError(err.response?.data || 'Failed to fetch testimonial. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonial();
  }, [email, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestimonial((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        navigate('/');
        return;
      }

      const testimonialData = {
        name: testimonial.name,
        review: testimonial.review,
        email: testimonial.email, // Include email for compatibility, backend ignores it
      };

      console.log('Updating testimonial data:', testimonialData);
      const response = await axios.put(`http://localhost:8080/testimonials/${encodeURIComponent(email)}`, testimonialData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccess(response.data);
      navigate('/dashboard/testimonials');
    } catch (err) {
      console.error('Error updating testimonial:', err.response || err.message);
      setError(err.response?.data || 'Failed to update testimonial. Please check the fields and try again.');
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl font-bold text-center">Edit Testimonial</h2>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/dashboard/testimonials')}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Back to Testimonials
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
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        {loading ? (
          <p className="text-center">Loading testimonial...</p>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={testimonial.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={testimonial.email}
                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="review">
                Review
              </label>
              <textarea
                id="review"
                name="review"
                value={testimonial.review}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? 'Updating...' : 'Update Testimonial'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditTestimonial;