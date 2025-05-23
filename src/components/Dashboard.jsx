import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          navigate('/');
          return;
        }

        const response = await axios.get('http://localhost:8080/blog', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setBlogs(response.data);
        console.log('Fetched blogs:', response.data);
      } catch (err) {
        console.error('Error fetching blogs:', err.response || err.message);
        setError(err.response?.data || 'Failed to fetch blogs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [navigate]);

  const handleDelete = async (title) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/blog/${encodeURIComponent(title)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setBlogs(blogs.filter((blog) => blog.title !== title));
      console.log(`Blog "${title}" deleted successfully`);
    } catch (err) {
      console.error('Error deleting blog:', err.response || err.message);
      setError(err.response?.data || 'Failed to delete blog. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 font-serif tracking-tight">
            Dashboard
          </h2>
          <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => navigate('/dashboard/plans')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              View Plans
            </button>
            <button
              onClick={() => navigate('/dashboard/testimonials')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              View Testimonials
            </button>
            <button
              onClick={() => navigate('/dashboard/forms')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              View Forms
            </button>
            <button
              onClick={() => navigate('/create-blog')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Create New Blog
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
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
        {loading ? (
          <p className="text-center text-gray-600">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-600">No blogs found. Create one!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300"
              >
                <h3 className="text-xl font-bold text-gray-800 font-sans">
                  {blog.title}
                </h3>
                <p className="text-gray-600 mt-2">{blog.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  By {blog.author} on {blog.postdate}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigate(`/edit-blog/${encodeURIComponent(blog.title)}`)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.title)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
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

export default Dashboard;