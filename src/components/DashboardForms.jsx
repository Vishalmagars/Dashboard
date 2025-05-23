import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardForms = () => {
  const [forms, setForms] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          navigate('/');
          return;
        }

        const response = await axios.get('http://localhost:8080/form', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const formattedForms = response.data.map((form) => ({
          ...form,
          id: form._id, // Keep id for internal use, but use email for API calls
        }));
        setForms(formattedForms);
        console.log('Fetched forms:', formattedForms);
      } catch (err) {
        console.error('Error fetching forms:', err.response || err.message);
        setError(err.response?.data || 'Failed to fetch forms. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [navigate]);

  const handleDelete = async (email) => {
    if (!window.confirm('Are you sure you want to delete this form?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/form/${encodeURIComponent(email)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setForms(forms.filter((form) => form.email !== email));
      console.log(`Form with email "${email}" deleted successfully`);
    } catch (err) {
      console.error('Error deleting form:', err.response || err.message);
      setError(err.response?.data || 'Failed to delete form. Please check the email and try again.');
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
          <h2 className="text-2xl font-bold">Forms Dashboard</h2>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Back to Dashboard
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
          <p className="text-center">Loading forms...</p>
        ) : forms.length === 0 ? (
          <p className="text-center">No forms found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forms.map((form) => (
              <div key={form.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold">{form.name}</h3>
                <p className="text-gray-600">{form.message}</p>
                <p className="text-sm text-gray-500">Email: {form.email} | Phone: {form.number}</p>
                <div className="mt-4">
                  <button
                    onClick={() => handleDelete(form.email)}
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

export default DashboardForms;