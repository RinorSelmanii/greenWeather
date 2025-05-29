import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import WeatherImage from './weather.jpg';
import LoginForm from './Login';
import SignupForm from './SignUp';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);

  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const fetchWeather = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/weather?city=${city}`);
      setWeather(res.data);
    } catch (err) {
      alert('Gabim ne kerkimin e motit!');
    }
  };

  return (
    <div
      className="App"
      style={{
        fontFamily: 'sans-serif',
        minHeight: '100vh',
        backgroundImage: `url(${WeatherImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        color: 'white',
        padding: '2rem',
        display: 'flex',           
        flexDirection: 'column',   
        alignItems: 'center'       
      }}
    >
      <h1
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}
      >
        greenWeather 🌤️
      </h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Shkruaj qytetin"
          style={{ padding: '0.5rem', marginRight: '1rem' }}
        />
        <button onClick={fetchWeather} style={{ padding: '0.5rem 1rem' }}>
          Kerko Motin
        </button>
      </div>

      {weather && (
        <div
          style={{
            marginTop: '1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '1rem',
            borderRadius: '10px',
            maxWidth: '300px',
            textAlign: 'center' 
          }}
        >
          <h2>{weather.name}, {weather.sys.country}</h2>
          <p>Temperatura: {weather.main.temp}°C</p>
          <p>Lageshtia: {weather.main.humidity}%</p>
          <p>Shpejtesia e eres: {weather.wind.speed} m/s</p>
        </div>
      )}

      {/* Login / Signup buttons and messages */}
      {!user && (
        <div style={{ marginTop: '2rem' }}>
          <button onClick={() => setShowLogin(true)} style={{ marginRight: '1rem' }}>Login</button>
          <button onClick={() => setShowSignup(true)}>Sign Up</button>
        </div>
      )}

      {user && (
        <div style={{ marginTop: '2rem' }}>
          <p>Welcome, {user}!</p>
          <button onClick={() => setUser(null)}>Logout</button>
        </div>
      )}

      
      {showLogin && (
        <div style={{ marginTop: '2rem' }}>
          <button onClick={() => setShowLogin(false)}>Close</button>
          <LoginForm onLoginSuccess={username => {
            setUser(username);
            setShowLogin(false);
          }} />
        </div>
      )}

      {showSignup && (
        <div style={{ marginTop: '2rem' }}>
          <button onClick={() => setShowSignup(false)}>Close</button>
          <SignupForm onSignupSuccess={() => {
            setShowSignup(false);
            setShowLogin(true);  
          }} />
        </div>
      )}
    </div>
  );
}

export default App;





