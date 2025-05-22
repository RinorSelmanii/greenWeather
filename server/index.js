const express = require('express');
const cors = require('cors');
const axios = require('axios');
const connection = require('./db'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/weather', async (req, res) => {
  const { city } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  console.log('API KEY:', apiKey); 
  console.log('City:', city); 

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const weatherData = response.data;
    const temperature = weatherData.main.temp;
    const description = weatherData.weather[0].description;

    // Ruaj ne db
    connection.query(
      'INSERT INTO weather_searches (city, temperature, description) VALUES (?, ?, ?)',
      [city, temperature, description],
      (err) => {
        if (err) {
          console.error('Gabim gjat ruajtjes ne DB:', err);
        } else {
          console.log('Kerkimi u ruajt me sukses ne databaz.');
        }
      }
    );

    res.json(weatherData);
  } catch (error) {
    console.error('Gabim ne kerkesen API:', error.message); 
    res.status(500).json({ message: 'Gabim gjat marrjes se te dhenave te motit.' });
  }
});

app.listen(PORT, () => console.log(`Serveri po punon ne portin ${PORT}`));
