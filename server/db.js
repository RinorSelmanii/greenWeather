const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rinori234', 
  database: 'green_weather'
});

connection.connect((err) => {
  if (err) {
    console.error('Gabim gjat lidhjes me MySQL:', err);
    return;
  }
  console.log('Lidhja me MySQL u realizua me sukses.');
});

module.exports = connection;
