import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardPlans = () => {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          setIsModalOpen(true);
          navigate('/');
          return;
        }

        const response = await axios.get('https://licapp.onrender.com/plans', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setPlans(response.data);
      } catch (err) {
        console.error('Error fetching plans:', err.response || err.message);
        setError(err.response?.data || 'Failed to fetch plans. Please try again.');
        setIsModalOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [navigate]);

  const handleDelete = async (title) => {
    setPlanToDelete(title);
    setModalMessage(`Are you sure you want to delete the plan "${title}"?`);
    setIsDeleteConfirm(true);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://licapp.onrender.com/plans/${encodeURIComponent(planToDelete)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setPlans(plans.filter((plan) => plan.title !== planToDelete));
      setModalMessage(`Plan "${planToDelete}" deleted successfully`);
      setIsDeleteConfirm(false);
      setTimeout(() => setIsModalOpen(false), 2000);
    } catch (err) {
      console.error('Error deleting plan:', err.response || err.message);
      setModalMessage(err.response?.data || 'Failed to delete plan. Please try again.');
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
    setModalMessage('');
    setIsDeleteConfirm(false);
    setPlanToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 transform transition-all duration-500 hover:shadow-3xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif tracking-tight">
            Plans Dashboard
          </h2>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300 text-sm sm:text-base transform hover:scale-105"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/create-plan')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 text-sm sm:text-base transform hover:scale-105"
            >
              Create New Plan
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 text-sm sm:text-base transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
          </div>
        ) : plans.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No plans found. Create one!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id || plan._id}
                className="bg-white/90 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-gray-900">{plan.title}</h3>
                <p className="text-gray-600 mt-2 line-clamp-3">{plan.description}</p>
                <p className="text-sm text-gray-500 mt-2">Category: {plan.category}</p>
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => navigate(`/edit-plan/${encodeURIComponent(plan.title)}`)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300 text-sm transform hover:scale-105"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan.title)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 text-sm transform hover:scale-105"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Error/Delete Confirmation */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full transform transition-all duration-300 scale-95 animate-in">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {isDeleteConfirm ? 'Confirm Delete' : error ? 'Error' : 'Success'}
              </h3>
              <p className={error ? 'text-red-600' : 'text-green-600'}>
                {modalMessage || error}
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
  );
};

export default DashboardPlans;