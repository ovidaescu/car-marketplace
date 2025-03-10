const { Client } = require('pg');

const client = new Client({
  user: 'postgres',  // PostgreSQL user
  host: 'localhost', // Host
  database: 'car_marketplace', // Database name
  password: '1234', // Replace with your PostgreSQL password
  port: 5433,  // Default PostgreSQL port
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch((err) => console.error('Connection error', err.stack));

module.exports = client;
