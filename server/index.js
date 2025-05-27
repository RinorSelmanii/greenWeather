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
      console.error('Gabim ne kerkesen API:', error.response?.data || error.message);

      res.status(500).json({ message: 'Gabim gjat marrjes se te dhenave te motit.' });
    }
  });

    //reade
    app.get('/api/searches',(req,res)=>{
      connection.query('SELECT * FROM weather_searches',(err , results)=>{
        if(err){
          console.error('Gabim gjat leximit nga DataBaza',err);
          res.status(500).json({message:'Gabim gjat leximit.'});
        }
        else{
          res.json(results);
        }
      });
    });

    //update
      app.put('/api/searches/:id',(req,res)=>{
        const{id} = req.params;
        const {city, temperature, description} = req.body;

        connection.query(
          'UPDATE weather_searches SET city = ?, temperature = ?, description = ? WHERE id = ?',
          [city, temperature, description, id],
          (err, result)=>{
            if(err){
              console.error('Gabim gjat Update:',err);
              res.status(500).json({message:'Gabim gjat Update.'});
            }
            else{
              res.json({message:'Update u be me sukses.'});
            }
          }
        );
      });

     //Delete  
    app.delete('/api/searches/:id', (req, res) => {
     const { id } = req.params;

    connection.query(
      'DELETE FROM weather_searches WHERE id = ?',
      [id],
      (err, result) => {
        if (err) {
          console.error('Gabim gjat fshirjes:', err);
          res.status(500).json({ message: 'Gabim gjat fshirjes.' });
      } else {
          res.json({ message: 'Fshirja u be me sukses.' });
      }
    }
  );
});

app.listen(PORT, () => console.log(`Serveri po punon ne portin ${PORT}`));
