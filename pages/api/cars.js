import carsData,{ validMakes, validModels, validTypes, validFuels } from '../../data/cars'; // Import valid data

// In-memory storage for cars
let cars = [...carsData];


export const resetCars = () => {
  cars = [...carsData]; // Reset the cars array to its initial state
};
export { cars };

// server side validation
const validateCar = (car) => {
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

export default function carsApiHandler(req, res) {
  
   // Ensure req.query is defined

  const { make = '', model = '', year = '', fuel = '', sortBy = '' } = req.query || {};


  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'GET') {
    const { make, model, year, fuel, sortBy } = req.query;

    // Filter cars
    let filteredCars = cars.filter(car => {
      return (
        (make ? car.make.toLowerCase().includes(make.toLowerCase()) : true) &&
        (model ? car.model.toLowerCase().includes(model.toLowerCase()) : true) &&
        (year ? car.year === Number(year) : true) &&
        (fuel ? car.fuel.toLowerCase().includes(fuel.toLowerCase()) : true)
      );
    });

    
    // Sort cars
    if (sortBy) {
        switch (sortBy) {
          case 'newest-first':
            filteredCars.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
          case 'oldest-first':
            filteredCars.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
            break;
          case 'price-low-high':
            filteredCars.sort((a, b) => a.price - b.price);
            break;
          case 'price-high-low':
            filteredCars.sort((a, b) => b.price - a.price);
            break;
          case 'year-new-old':
            filteredCars.sort((a, b) => b.year - a.year);
            break;
          case 'year-old-new':
            filteredCars.sort((a, b) => a.year - b.year);
            break;
          case 'km-low-high':
            filteredCars.sort((a, b) => a.km - b.km);
            break;
          case 'km-high-low':
            filteredCars.sort((a, b) => b.km - a.km);
            break;
          default:
            break;
        }
      }

    return res.status(200).json(filteredCars);
  }

  if (req.method === 'POST') {
    const validationError = validateCar(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    const newCar = { ...req.body, id: cars.length + 1, dateAdded: new Date().toISOString().split('T')[0] };
    cars.push(newCar);
    return res.status(201).json(newCar);
  }

  if (req.method === 'PATCH') {
    const { id } = req.query;
    const carIndex = cars.findIndex(car => car.id === Number(id));

    if (carIndex === -1) return res.status(404).json({ error: 'Car not found' });

    const validationError = validateCar(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    cars[carIndex] = { 
      ...cars[carIndex], 
      ...req.body, 
      dateAdded: req.body.dateAdded || cars[carIndex].dateAdded // Keep existing date if not provided
    };
    return res.status(200).json(cars[carIndex]);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    cars = cars.filter(car => car.id !== Number(id));
    return res.status(200).json({ message: 'Car deleted successfully' });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}