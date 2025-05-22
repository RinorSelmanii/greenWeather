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
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    
    await db.execute(
      'INSERT INTO weather_searches (city, temperature, description) VALUES (?, ?, ?)',
      [city, response.data.main.temp, response.data.weather[0].description]
    );

    const weatherData = response.data;
    const temperature = weatherData.main.temp;
    const description = weatherData.weather[0].description;

    // Ruaje kërkimin në databazë
    connection.query(
      'INSERT INTO weather_searches (city, temperature, description) VALUES (?, ?, ?)',
      [city, temperature, description],
      (err) => {
        if (err) {
          console.error('Gabim gjatë ruajtjes në DB:', err);
        } else {
          console.log('Kërkimi u ruajt me sukses në databazë.');
        }
      }
    );

    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ message: 'Gabim gjatë marrjes së të dhënave të motit.' });
  }
});

app.listen(PORT, () => console.log(`Serveri po punon në portin ${PORT}`));