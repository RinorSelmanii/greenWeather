import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import WeatherImage from './weather.jpg';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);

  const fetchWeather = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/weather?city=${city}`);
      setWeather(res.data);
    } catch (err) {
      alert('Gabim në kërkimin e motit!');
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
          Kërko Motin
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
          <p>Lagështia: {weather.main.humidity}%</p>
          <p>Shpejtësia e erës: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default App;




