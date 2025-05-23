import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import parseJwt from '../utils/parseJwt';

const CreateBlog = () => {
  const [blog, setBlog] = useState({
    title: '',
    description: '',
    img: '',
    tags: '',
    content: '',
    author: '',
    postdate: '',
    controller: '',
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
    setBlog((prev) => ({ ...prev, [name]: value }));
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

      let username;
      try {
        username = parseJwt(token).sub;
        console.log('Username sent in URL:', username);
      } catch (jwtError) {
        console.error('JWT parsing error:', jwtError);
        setError('Invalid authentication token. Please log in again.');
        localStorage.removeItem('token');
        navigate('/');
        return;
      }

      const blogData = {
        title: blog.title,
        description: blog.description,
        img: blog.img || null,
        tags: blog.tags ? blog.tags.split(',').map((tag) => tag.trim()) : [],
        content: blog.content,
        author: blog.author,
        postdate: blog.postdate || new Date().toISOString().split('T')[0],
        controller: blog.controller || null,
      };

      console.log('Sending blog data:', blogData);
      const response = await axios.post(`http://localhost:8080/blog/${username}/addblog`, blogData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccess(response.data);
      setBlog({
        title: '',
        description: '',
        img: '',
        tags: '',
        content: '',
        author: '',
        postdate: '',
        controller: '',
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Error posting blog:', err.response || err.message);
      setError(err.response?.data || 'Failed to post blog. Please try again.');
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
          <h2 className="text-2xl font-bold text-center">Create a New Blog Post</h2>
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
                value={blog.title}
                onChange={handleInputChange}
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
                value={blog.author}
                onChange={handleInputChange}
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
                value={blog.img}
                onChange={handleInputChange}
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
                value={blog.postdate}
                onChange={handleInputChange}
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
                value={blog.tags}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Travel, Nature, Adventure"
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
                value={blog.controller}
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
              value={blog.description}
              onChange={handleInputChange}
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
              value={blog.content}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="8"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Posting...' : 'Post Blog'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;