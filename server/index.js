const express = require('express');
const cors = require('cors');
const axios = require('axios');
const connection = require('./db'); 
const bcrypt = require('bcryptjs');
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

// SIGNUP Endpoint
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Kontrollo nese ekziston perdoruesi
    connection.query(
      'SELECT * FROM users WHERE username = ?',
      [username],
      async (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Gabim ne server.' });
        }

        if (results.length > 0) {
          return res.status(400).json({ message: 'Perdoruesi ekziston.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        connection.query(
          'INSERT INTO users (username, password) VALUES (?, ?)',
          [username, hashedPassword],
          (err) => {
            if (err) {
              return res.status(500).json({ message: 'Gabim gjat regjistrimit.' });
            }
            res.status(201).json({ message: 'Regjistrimi u krye me sukses.' });
          }
        );
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Gabim ne server.' });
  }
});

// LOGIN Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    connection.query(
      'SELECT * FROM users WHERE username = ?',
      [username],
      async (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Gabim ne server.' });
        }

        if (results.length === 0) {
          return res.status(401).json({ message: 'Emri ose fjalekalimi i gabuar.' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(401).json({ message: 'Emri ose fjalekalimi i gabuar.' });
        }

        res.status(200).json({ message: 'Login i suksesshem.', username: user.username });
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Gabim ne server.' });
  }
});


app.listen(PORT, () => console.log(`Serveri po punon ne portin ${PORT}`));
