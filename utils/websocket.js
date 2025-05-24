const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');


const { Client } = require('pg');

async function loadCarsFromDb() {
  const client = new Client({
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'car_marketplace',
  });
  await client.connect();
  const res = await client.query('SELECT * FROM cars');
  await client.end();
  return res.rows;
}

let cars = []; // In-memory storage for cars


const generateRandomCar = () => ({
  id: uuidv4(),
  make: `Make-${Math.floor(Math.random() * 100)}`,
  model: `Model-${Math.floor(Math.random() * 100)}`,
  year: Math.floor(Math.random() * 21) + 2000,
  price: Math.floor(Math.random() * 50000) + 5000,
  dateAdded: new Date().toISOString(),
});




const startWebSocketServer = async (port) => {
  
  cars = await loadCarsFromDb(); // Load cars from DB at startup
  console.log('Loaded cars:', cars);

  const wss = new WebSocket.Server({ host: '0.0.0.0', port });;

  const broadcastUpdate = (message, excludeClient = null) => {
    wss.clients.forEach((client) => {
      if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  };

  wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send initial data
    ws.send(JSON.stringify({ type: 'INIT', cars }));


    // decomment this if you want to start the thread that generates entities
    /*
    // Periodically generate new cars and broadcast
    const interval = setInterval(() => {
      const newCar = generateRandomCar();
      cars.push(newCar);
      const message = { type: 'ADD_CAR', car: newCar };
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    }, 5000); // Generate a new car every 5 seconds
    */


    ws.on('close', () => {
      console.log('Client disconnected');
      //clearInterval(interval);
    });
  });

  console.log(`WebSocket server running on ws://0.0.0.0:${port}`);
  return broadcastUpdate;

};

if (require.main === module) {
  // If this file is run directly, start the server
  startWebSocketServer(8081);
}

module.exports = { startWebSocketServer }