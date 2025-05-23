import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePlan = () => {
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found. Please log in.');
      navigate('/');
    }
  }, [navigate]);

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

      console.log('Sending plan data:', planData);
      const response = await axios.post('http://localhost:8080/plans/addplan', planData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccess(response.data);
      setPlan({
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
      navigate('/dashboard/plans');
    } catch (err) {
      console.error('Error posting plan:', err.response || err.message);
      setError(err.response?.data || 'Failed to post plan. Please try again.');
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
          <h2 className="text-2xl font-bold text-center">Create a New Plan</h2>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/dashboard/plans')}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Back to Plans
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
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={plan.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="category">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={plan.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="minAge">
                Minimum Age
              </label>
              <input
                type="number"
                id="minAge"
                name="minAge"
                value={plan.minAge}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="maxAge">
                Maximum Age
              </label>
              <input
                type="number"
                id="maxAge"
                name="maxAge"
                value={plan.maxAge}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="policyTerm">
                Policy Term
              </label>
              <input
                type="text"
                id="policyTerm"
                name="policyTerm"
                value={plan.policyTerm}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="premiumRange">
                Premium Range
              </label>
              <input
                type="text"
                id="premiumRange"
                name="premiumRange"
                value={plan.premiumRange}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="sumAssuredRange">
                Sum Assured Range
              </label>
              <input
                type="text"
                id="sumAssuredRange"
                name="sumAssuredRange"
                value={plan.sumAssuredRange}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="maturityBenefits">
                Maturity Benefits
              </label>
              <input
                type="text"
                id="maturityBenefits"
                name="maturityBenefits"
                value={plan.maturityBenefits}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="taxBenefits">
                Tax Benefits
              </label>
              <input
                type="text"
                id="taxBenefits"
                name="taxBenefits"
                value={plan.taxBenefits}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={plan.description}
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
            {loading ? 'Posting...' : 'Post Plan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePlan;