import db from '../../models';
const { Car } = db;
import { validMakes, validModels, validTypes, validFuels } from '../../data/carsData'; // Import valid data

console.log('Car model:', Car);
console.log('ENV DB_HOST:', process.env.DB_HOST);
console.log('ENV NODE_ENV:', process.env.NODE_ENV);

const  broadcastUpdatePromise  = require('../../utils/start');

// Server-side validation
const validateCar = (car) => {
  if (!car.photoUrl) return 'URL field should not be empty';
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

export default async function carsApiHandler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'GET') {
    const { make, model, year, fuel, sortBy , limit = 10, offset = 0} = req.query;

    try {
      // Build the query dynamically
      const where = {};
      if (make) where.make = make;
      if (model) where.model = model;
      if (year) where.year = Number(year);
      if (fuel) where.fuel = fuel;

      const order = [];
      if (sortBy) {
        // Map sortBy values to valid column and direction
        const sortOptions = {
          'newest-first': ['dateadded', 'DESC'],
          'oldest-first': ['dateadded', 'ASC'],
          'price-low-high': ['price', 'ASC'],
          'price-high-low': ['price', 'DESC'],
          'year-new-old': ['year','ASC'],
          'year-old-new': ['year','DESC'],
          'km-low-high': ['km','ASC'],
          'km-high-low': ['km','DESC'],
        };
  
        const [field, direction] = sortOptions[sortBy] || [];
        if (field && direction) {
          order.push([field, direction]);
        } else {
          return res.status(400).json({ error: 'Invalid sortBy parameter' });
        }
      }

      const cars = await Car.findAll({ where, order, limit: Number(limit), offset: Number(offset) });
      return res.status(200).json(cars || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  if (req.method === 'POST') {

    const carData = { ...req.body };

    const date = new Date().toISOString().split('T')[0];  // This gives 'YYYY-MM-DD'

    // Check if the date is valid
    if (isNaN(new Date(date))) {
      console.error("Invalid date detected:", date);
      return res.status(400).json({ error: 'Invalid date format' });
    } 

    carData.dateAdded = date; 

    console.log("Car Data before insert:", carData);

    const validationError = validateCar(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    try {
      const newCar = await Car.create(carData);
      const broadcastUpdate = await broadcastUpdatePromise;
      broadcastUpdate({ type: 'ADD_CAR', car: newCar });
      return res.status(201).json(newCar);
    } catch (error) {
      console.error('Error creating car:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  if (req.method === 'PATCH') {
    const { id } = req.query;

    try {
      const car = await Car.findByPk(id);
      if (!car) return res.status(404).json({ error: 'Car not found' });

      const validationError = validateCar(req.body);
      if (validationError) return res.status(400).json({ error: validationError });

      await car.update(req.body);
      const broadcastUpdate = await broadcastUpdatePromise;
      broadcastUpdate({ type: 'EDIT_CAR', car });
      return res.status(200).json(car);
    } catch (error) {
      console.error('Error updating car:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    const carId = Number(id);

    try {
      const car = await Car.findByPk(carId);
      if (!car) return res.status(404).json({ error: 'Car not found' });

      await car.destroy();
      const broadcastUpdate = await broadcastUpdatePromise;
      broadcastUpdate({ type: 'DELETE_CAR', carId });
      return res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
      console.error('Error deleting car:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}