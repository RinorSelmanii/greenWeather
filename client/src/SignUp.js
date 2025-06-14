import React, { useState } from 'react';

const API_URL = 'http://localhost:5000';

export default function SignupForm({ onSignupSuccess }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL + '/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials:'include'
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage(data.message);
      onSignupSuccess();  
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Sign Up</button>
      <p>{message}</p>
    </form>
  );
}
