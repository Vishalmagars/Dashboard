import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditPlan = () => {
  const [plan, setPlan] = useState({
    title: '',
    category: '',
    description: '',
    minAge: '',
    maxAge: '',
    policyTerm: '',
    premiumRange: '',
    sumAssuredRange: '',
    maturityBenefits: '',
    taxBenefits: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { title } = useParams();

  // Predefined categories for the dropdown
  const categories = [
    'Life Insurance',
    'Health Insurance',
    'Investment Plan',
    'Retirement Plan',
    'Other',
  ];

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          navigate('/');
          return;
        }

        const response = await axios.get(`http://localhost:8080/plans/${encodeURIComponent(title)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const planData = response.data;
        setPlan({
          title: planData.title || '',
          category: planData.category || '',
          description: planData.description || '',
          minAge: planData.minAge || '',
          maxAge: planData.maxAge || '',
          policyTerm: planData.policyTerm || '',
          premiumRange: planData.premiumRange || '',
          sumAssuredRange: planData.sumAssuredRange || '',
          maturityBenefits: planData.maturityBenefits || '',
          taxBenefits: planData.taxBenefits || '',
        });
        console.log('Fetched plan for editing:', planData);
      } catch (err) {
        console.error('Error fetching plan:', err.response || err.message);
        setError(err.response?.data || 'Failed to fetch plan. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [title, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlan((prev) => ({ ...prev, [name]: value }));
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

      const planData = {
        title: plan.title,
        category: plan.category,
        description: plan.description,
        minAge: plan.minAge ? parseInt(plan.minAge) : null,
        maxAge: plan.maxAge ? parseInt(plan.maxAge) : null,
        policyTerm: plan.policyTerm,
        premiumRange: plan.premiumRange,
        sumAssuredRange: plan.sumAssuredRange,
        maturityBenefits: plan.maturityBenefits,
        taxBenefits: plan.taxBenefits,
        updatedAt: new Date().toISOString(),
      };

      console.log('Updating plan data:', planData);
      const response = await axios.put(`http://localhost:8080/plans/${encodeURIComponent(title)}`, planData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccess(response.data);
      navigate('/dashboard/plans');
    } catch (err) {
      console.error('Error updating plan:', err.response || err.message);
      setError(err.response?.data || 'Failed to update plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 font-serif tracking-tight">
            Edit Plan
          </h2>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/dashboard/plans')}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Back to Plans
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
        {error && (
          <p className="text-red-500 text-sm text-center mb-6 animate-pulse">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-500 text-sm text-center mb-6">
            {success}
          </p>
        )}
        {loading ? (
          <p className="text-center text-gray-600">Loading plan...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 font-sans"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={plan.title}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                  placeholder="Enter plan title"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 font-sans"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={plan.category}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 bg-gray-50 text-gray-800"
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="minAge"
                  className="block text-sm font-medium text-gray-700 font-sans"
                >
                  Minimum Age
                </label>
                <input
                  type="number"
                  id="minAge"
                  name="minAge"
                  value={plan.minAge}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                  placeholder="Enter minimum age"
                />
              </div>
              <div>
                <label
                  htmlFor="maxAge"
                  className="block text-sm font-medium text-gray-700 font-sans"
                >
                  Maximum Age
                </label>
                <input
                  type="number"
                  id="maxAge"
                  name="maxAge"
                  value={plan.maxAge}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                  placeholder="Enter maximum age"
                />
              </div>
              <div>
                <label
                  htmlFor="policyTerm"
                  className="block text-sm font-medium text-gray-700 font-sans"
                >
                  Policy Term
                </label>
                <input
                  type="text"
                  id="policyTerm"
                  name="policyTerm"
                  value={plan.policyTerm}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                  placeholder="Enter policy term"
                />
              </div>
              <div>
                <label
                  htmlFor="premiumRange"
                  className="block text-sm font-medium text-gray-700 font-sans"
                >
                  Premium Range
                </label>
                <input
                  type="text"
                  id="premiumRange"
                  name="premiumRange"
                  value={plan.premiumRange}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                  placeholder="Enter premium range"
                />
              </div>
              <div>
                <label
                  htmlFor="sumAssuredRange"
                  className="block text-sm font-medium text-gray-700 font-sans"
                >
                  Sum Assured Range
                </label>
                <input
                  type="text"
                  id="sumAssuredRange"
                  name="sumAssuredRange"
                  value={plan.sumAssuredRange}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                  placeholder="Enter sum assured range"
                />
              </div>
              <div>
                <label
                  htmlFor="maturityBenefits"
                  className="block text-sm font-medium text-gray-700 font-sans"
                >
                  Maturity Benefits
                </label>
                <input
                  type="text"
                  id="maturityBenefits"
                  name="maturityBenefits"
                  value={plan.maturityBenefits}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                  placeholder="Enter maturity benefits"
                />
              </div>
              <div>
                <label
                  htmlFor="taxBenefits"
                  className="block text-sm font-medium text-gray-700 font-sans"
                >
                  Tax Benefits
                </label>
                <input
                  type="text"
                  id="taxBenefits"
                  name="taxBenefits"
                  value={plan.taxBenefits}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                  placeholder="Enter tax benefits"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 font-sans"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={plan.description}
                onChange={handleInputChange}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                rows="4"
                placeholder="Enter plan description"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition duration-300 font-medium text-lg tracking-wide"
            >
              {loading ? 'Updating...' : 'Update Plan'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditPlan;