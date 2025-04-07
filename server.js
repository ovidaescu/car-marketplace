const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies

// In-memory data store
let cars = [];

// Validate car data
const validateCar = (car) => {
  const validMakes = ['Toyota', 'Honda', 'Ford', 'BMW'];
  const validModels = ['Corolla', 'Civic', 'Focus', 'X5'];
  const validTypes = ['Sedan', 'SUV', 'Truck'];
  const validFuels = ['Petrol', 'Diesel', 'Electric'];

  if (!car.url) return 'URL field should not be empty';
  if (!car.make || !validMakes.includes(car.make)) return `Make must be one of the following: ${validMakes.join(', ')}`;
  if (!car.model || !validModels.includes(car.model)) return `Model must be one of the following: ${validModels.join(', ')}`;
  if (!car.type || !validTypes.includes(car.type)) return `Type must be one of the following: ${validTypes.join(', ')}`;
  if (!car.fuel || !validFuels.includes(car.fuel)) return `Fuel must be one of the following: ${validFuels.join(', ')}`;
  const currentYear = new Date().getFullYear();
  if (!car.year || car.year < 1900 || car.year > currentYear) return 'Year should be a valid number between 1900 and the current year.';
  if (!car.km || car.km < 0) return 'Kilometers should be a non-negative number.';
  if (!car.price || car.price <= 0) return 'Price should be a positive number.';
  return '';
};

// Routes

// Get all cars (with optional filtering and sorting)
app.get('/api/cars', (req, res) => {
  let filteredCars = [...cars];

  // Filtering
  const { make, model, year, fuel } = req.query;
  if (make) filteredCars = filteredCars.filter(car => car.make.toLowerCase().includes(make.toLowerCase()));
  if (model) filteredCars = filteredCars.filter(car => car.model.toLowerCase().includes(model.toLowerCase()));
  if (year) filteredCars = filteredCars.filter(car => car.year === Number(year));
  if (fuel) filteredCars = filteredCars.filter(car => car.fuel.toLowerCase().includes(fuel.toLowerCase()));

  // Sorting
  const { sort } = req.query;
  if (sort === 'price-asc') filteredCars.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filteredCars.sort((a, b) => b.price - a.price);

  res.json(filteredCars);
});

// Add a new car
app.post('/api/cars', (req, res) => {
  const car = req.body;
  const validationError = validateCar(car);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  car.id = cars.length + 1; // Assign a unique ID
  car.dateAdded = new Date().toISOString().split('T')[0]; // Add current date
  cars.push(car);
  res.status(201).json(car);
});

// Update a car
app.put('/api/cars/:id', (req, res) => {
  const { id } = req.params;
  const carIndex = cars.findIndex(car => car.id === Number(id));
  if (carIndex === -1) {
    return res.status(404).json({ error: 'Car not found' });
  }

  const updatedCar = { ...cars[carIndex], ...req.body };
  const validationError = validateCar(updatedCar);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  cars[carIndex] = updatedCar;
  res.json(updatedCar);
});

// Delete a car
app.delete('/api/cars/:id', (req, res) => {
  const { id } = req.params;
  const carIndex = cars.findIndex(car => car.id === Number(id));
  if (carIndex === -1) {
    return res.status(404).json({ error: 'Car not found' });
  }

  cars.splice(carIndex, 1);
  res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});