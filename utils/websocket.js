const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const validMakes = ['Toyota', 'Honda', 'Ford', 'BMW', 'Audi'];
const validModels = ['Corolla', 'Civic', 'Mustang', 'X5', 'A4'];
const validTypes = ['Hatchback', 'Sedan', 'Coupe', 'SUV', 'Convertible', 'Break'];
const validFuels = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

let cars = []; // In-memory list of cars

const generateRandomCar = () => {
  return {
    id: uuidv4(),
    make: validMakes[Math.floor(Math.random() * validMakes.length)],
    model: validModels[Math.floor(Math.random() * validModels.length)],
    type: validTypes[Math.floor(Math.random() * validTypes.length)],
    year: Math.floor(Math.random() * 21) + 2000, // Random year between 2000 and 2020
    km: Math.floor(Math.random() * 200000), // Random kilometers
    fuel: validFuels[Math.floor(Math.random() * validFuels.length)],
    price: Math.floor(Math.random() * 50000) + 5000, // Random price between 5000 and 55000
    dateAdded: new Date().toISOString(),
  };
};

const startWebSocketServer = (port = 8080) => {
  const wss = new WebSocket.Server({ port });

  // Broadcast data to all connected clients
  const broadcast = (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  // Handle WebSocket connections
  wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send the current list of cars to the newly connected client
    ws.send(JSON.stringify({ type: 'INIT', cars }));

    // Handle incoming messages from clients
    ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message);

      switch (parsedMessage.type) {
        case 'ADD_CAR':
          const newCar = { ...parsedMessage.car, id: uuidv4(), dateAdded: new Date().toISOString() };
          cars.push(newCar);
          broadcast({ type: 'ADD_CAR', car: newCar });
          break;

        case 'DELETE_CAR':
          cars = cars.filter((car) => car.id !== parsedMessage.id);
          broadcast({ type: 'DELETE_CAR', id: parsedMessage.id });
          break;

        case 'EDIT_CAR':
          cars = cars.map((car) =>
            car.id === parsedMessage.car.id ? { ...car, ...parsedMessage.car } : car
          );
          broadcast({ type: 'EDIT_CAR', car: parsedMessage.car });
          break;

        default:
          console.error('Unknown message type:', parsedMessage.type);
      }
    });

    ws.on('close', () => console.log('Client disconnected'));
  });

  console.log(`WebSocket server running on ws://localhost:${port}`);
};

module.exports = startWebSocketServer;