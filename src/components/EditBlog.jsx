import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import parseJwt from '../utils/parseJwt';

const EditBlog = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    img: '',
    tags: '',
    content: '',
    author: '',
    postdate: '',
    controller: '',
  });
  const [status, setStatus] = useState({
    loading: false,
    error: '',
    success: '',
  });

  // Fetch blog data on mount
  useEffect(() => {
    const fetchBlog = async () => {
      setStatus({ loading: true, error: '', success: '' });
      const token = localStorage.getItem('token');
      if (!token) {
        setStatus((prev) => ({
          ...prev,
          error: 'Please log in to edit a blog.',
          loading: false,
        }));
        navigate('/');
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/blog/${encodeURIComponent(title)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const { data } = response;
        setFormData({
          title: data.title || '',
          description: data.description || '',
          img: data.img || '',
          tags: data.tags ? data.tags.join(', ') : '',
          content: data.content || '',
          author: data.author || '',
          postdate: data.postdate ? data.postdate.split('T')[0] : '',
          controller: data.controller || '',
        });
        console.log('Fetched blog:', data);
      } catch (err) {
        console.error('Fetch error:', err.response || err.message);
        setStatus((prev) => ({
          ...prev,
          error: err.response?.data || 'Failed to load blog. Please try again.',
          loading: false,
        }));
      } finally {
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchBlog();
  }, [title, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    // Basic validation
    if (!formData.title || !formData.description || !formData.content || !formData.author) {
      setStatus({
        loading: false,
        error: 'Please fill in all required fields (Title, Description, Content, Author).',
        success: '',
      });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setStatus({
        loading: false,
        error: 'Please log in to edit a blog.',
        success: '',
      });
      navigate('/');
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        img: formData.img || null,
        tags: formData.tags
          ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
          : [],
        content: formData.content,
        author: formData.author,
        postdate: formData.postdate || new Date().toISOString().split('T')[0],
        controller: formData.controller || null,
      };

      console.log('Updating blog:', payload);
      const response = await axios.put(
        `http://localhost:8080/blog/${encodeURIComponent(title)}`,
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
        success: response.data || 'Blog updated successfully!',
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Update error:', err.response || err.message);
      setStatus({
        loading: false,
        error: err.response?.data || 'Failed to update blog. Please try again.',
        success: '',
      });
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Blog Post</h2>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {status.error && (
          <p className="text-red-500 text-center mb-4">{status.error}</p>
        )}
        {status.success && (
          <p className="text-green-500 text-center mb-4">{status.success}</p>
        )}

        {status.loading && !formData.title ? (
          <p className="text-center">Loading blog...</p>
        ) : (
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
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="author">
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="img">
                  Image URL
                </label>
                <input
                  type="text"
                  id="img"
                  name="img"
                  value={formData.img}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="postdate">
                  Post Date
                </label>
                <input
                  type="date"
                  id="postdate"
                  name="postdate"
                  value={formData.postdate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="tags">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Travel, Nature"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="controller">
                  Controller
                </label>
                <input
                  type="text"
                  id="controller"
                  name="controller"
                  value={formData.controller}
                  onChange={handleChange}
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
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="content">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="8"
                required
              />
            </div>
            <button
              type="submit"
              disabled={status.loading}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {status.loading ? 'Updating...' : 'Update Blog'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditBlog;