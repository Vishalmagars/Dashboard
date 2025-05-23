import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardPlans = () => {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          navigate('/');
          return;
        }

        const response = await axios.get('http://localhost:8080/plans', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setPlans(response.data);
        console.log('Fetched plans:', response.data);
      } catch (err) {
        console.error('Error fetching plans:', err.response || err.message);
        setError(err.response?.data || 'Failed to fetch plans. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [navigate]);

  const handleDelete = async (title) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/plans/${encodeURIComponent(title)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setPlans(plans.filter((plan) => plan.title !== title));
      console.log(`Plan "${title}" deleted successfully`);
    } catch (err) {
      console.error('Error deleting plan:', err.response || err.message);
      setError(err.response?.data || 'Failed to delete plan. Please check the title and try again.');
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
          <h2 className="text-2xl font-bold">Plans Dashboard</h2>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/create-plan')}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Create New Plan
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
          <p className="text-center">Loading plans...</p>
        ) : plans.length === 0 ? (
          <p className="text-center">No plans found. Create one!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <div key={plan.id || plan._id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold">{plan.title}</h3>
                <p className="text-gray-600">{plan.description}</p>
                <p className="text-sm text-gray-500">Category: {plan.category}</p>
                <div className="mt-4 space-x-2">
                  <button
                    onClick={() => navigate(`/edit-plan/${encodeURIComponent(plan.title)}`)}
                    className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan.title)}
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

export default DashboardPlans;