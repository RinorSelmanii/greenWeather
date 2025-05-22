const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // vendos fjalëkalimin tënd këtu nëse ke vendosur gjatë instalimit
  database: 'green_weather'
});

connection.connect((err) => {
  if (err) {
    console.error('Gabim gjatë lidhjes me MySQL:', err);
    return;
  }
  console.log('Lidhja me MySQL u bë me sukses!');
});

module.exports = connection;
