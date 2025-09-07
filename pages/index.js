import { useState, useEffect } from 'react';
import Head from 'next/head';

const API_BASE_URL = '/api';

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchQuestions(token);
    }
  }, []);

  const fetchQuestions = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/questions`, {
        headers: {
          'x-auth-token': token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      } else {
        console.error('Failed to fetch questions');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAuth = async (e, endpoint) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        fetchQuestions(data.token);
        setUsername('');
        setPassword('');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setQuestions([]);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (title.trim() === '') return;
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE_URL}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      body: JSON.stringify({ title, link }),
    });
    setTitle('');
    setLink('');
    fetchQuestions(token);
  };

  const handleUpdateStatus = async (id, field, value) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE_URL}/questions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      body: JSON.stringify({ [field]: value }),
    });
    fetchQuestions(token);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE_URL}/questions/${id}`, {
      method: 'DELETE',
      headers: {
        'x-auth-token': token,
      },
    });
    fetchQuestions(token);
  };

  const filteredQuestions = questions.filter((q) => {
    if (currentFilter === 'completed') {
      return q.completed;
    }
    if (currentFilter === 'pending') {
      return !q.completed && !q.forReview;
    }
    if (currentFilter === 'review') {
      return q.forReview;
    }
    return true;
  });

  const totalQuestions = questions.length;
  const completedQuestions = questions.filter(q => q.completed).length;
  const reviewQuestions = questions.filter(q => q.forReview).length;
  const progressPercentage = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

  if (!isLoggedIn) {
    return (
      <div className="container auth-container">
        <Head>
            <title>Interview Prep Tracker - Login</title>
        </Head>
        <h1>Interview Prep Tracker</h1>
        <h2>{isRegistering ? 'Register' : 'Login'} to continue</h2>
        <form onSubmit={(e) => handleAuth(e, isRegistering ? 'register' : 'login')}>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
        </form>
        <button className="toggle-auth" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <Head>
          <title>Interview Prep Tracker</title>
      </Head>
      <div className="header">
        <h1>Interview Prep Tracker</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard">
        <div className="card">
          <h3>Total Questions</h3>
          <p>{totalQuestions}</p>
        </div>
        <div className="card">
          <h3>Completed</h3>
          <p>{completedQuestions}</p>
        </div>
        <div className="card">
          <h3>To Review</h3>
          <p>{reviewQuestions}</p>
        </div>
        <div className="card progress-card">
          <h3>Progress</h3>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <p>{progressPercentage}%</p>
        </div>
      </div>

      <div className="filter-buttons">
        <button onClick={() => setCurrentFilter('all')} className={currentFilter === 'all' ? 'active' : ''}>All</button>
        <button onClick={() => setCurrentFilter('pending')} className={currentFilter === 'pending' ? 'active' : ''}>Pending</button>
        <button onClick={() => setCurrentFilter('completed')} className={currentFilter === 'completed' ? 'active' : ''}>Completed</button>
        <button onClick={() => setCurrentFilter('review')} className={currentFilter === 'review' ? 'active' : ''}>For Review</button>
      </div>

      <form onSubmit={handleAddQuestion}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a question..." required />
        <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Optional link..." />
        <button type="submit">Add Question</button>
      </form>

      <div className="questions-list">
        {filteredQuestions.map((q) => (
          <div key={q._id} className="question-item">
            <div className="content">
              <h4>{q.title}</h4>
              {q.link && <a href={q.link} target="_blank" rel="noopener noreferrer">Link</a>}
            </div>
            <div className="actions">
              <button
                onClick={() => handleUpdateStatus(q._id, 'completed', !q.completed)}
                className={`complete-btn ${q.completed ? 'completed' : ''}`}
              >
                Complete
              </button>
              <button
                onClick={() => handleUpdateStatus(q._id, 'forReview', !q.forReview)}
                className={`review-btn ${q.forReview ? 'reviewed' : ''}`}
              >
                Review
              </button>
              <button onClick={() => handleDelete(q._id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}