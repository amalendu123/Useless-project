import React, { useState, useEffect } from 'react';
import axios from 'axios';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);

  // Fetch news from the API
  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/news/');
      setNews(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch news');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate new news items
  const generateNews = async () => {
    try {
      setGenerating(true);
      const response = await axios.post('http://127.0.0.1:8000/news/generate/', {
        number_of_news: 10
      });
      fetchNews(); // Refresh the news list after generating
      setError(null);
    } catch (err) {
      setError('Failed to generate news');
      console.error('Error generating news:', err);
    } finally {
      setGenerating(false);
    }
  };

  // Fetch news on component mount
  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="flex flex-col w-screen text-center">
      <h1 className="mt-10 text-5xl">Latest News</h1>
      
      {/* Generate News Button */}
      <div className="mt-6 mb-8">
        <button
          onClick={generateNews}
          disabled={generating}
          className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
        >
          {generating ? 'Generating...' : 'Generate New Stories'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-auto mb-4 text-red-500">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center mt-10">
          <div className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      ) : (
        /* News Grid */
        <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* News Image */}
              <div className="relative h-48">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x450';
                  }}
                />
              </div>
              
              {/* News Content */}
              <div className="p-4">
                <h2 className="mb-2 text-xl font-semibold text-gray-800">
                  {item.title}
                </h2>
                <p className="text-gray-600">
                  {item.content}
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && news.length === 0 && (
        <div className="mt-10 text-gray-500">
          No news articles available. Generate some news to get started!
        </div>
      )}
    </div>
  );
};

export default News;