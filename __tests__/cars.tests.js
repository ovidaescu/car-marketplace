import request from 'supertest';
import carsApiHandler,{ resetCars } from '../pages/api/cars'; // Adjust the path if necessary

beforeEach(() => {
    resetCars(); // Reset the in-memory cars array before each test
  });
  

// test get
describe('GET /api/cars', () => {
    it('should return all cars', async () => {
        //jest.setTimeout(10000); // Set timeout to 10 seconds
      const response = await request(carsApiHandler).get('/api/cars');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });
  
    it('should return filtered cars by make', async () => {
      const response = await request(carsApiHandler).get('/api/cars?make=Toyota');
      expect(response.status).toBe(200);
      expect(response.body.every(car => car.make === 'Toyota')).toBe(true);
    });
  
    it('should return sorted cars by price (low to high)', async () => {
      const response = await request(carsApiHandler).get('/api/cars?sortBy=price-low-high');
      expect(response.status).toBe(200);
      const prices = response.body.map(car => car.price);
      expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });
  });

// test add
  describe('POST /api/cars', () => {
    it('should add a new car with valid data', async () => {
      const newCar = {
        url: 'https://example.com/car.jpg',
        make: 'Toyota',
        model: 'Corolla',
        type: 'Sedan',
        year: 2022,
        km: 10000,
        fuel: 'Petrol',
        price: 20000
      };
  
      const response = await request(carsApiHandler).post('/api/cars').send(newCar);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.make).toBe('Toyota');
    });
  
    it('should return a validation error for invalid data', async () => {
      const invalidCar = {
        make: 'InvalidMake',
        model: 'Corolla',
        year: 2022,
        price: -100
      };
  
      const response = await request(carsApiHandler).post('/api/cars').send(invalidCar);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });


// test update
  describe('PATCH /api/cars', () => {
    it('should update an existing car', async () => {
      const updatedCar = {
        price: 25000,
        km: 12000
      };
  
      const response = await request(carsApiHandler).patch('/api/cars?id=1').send(updatedCar);
      expect(response.status).toBe(200);
      expect(response.body.price).toBe(25000);
      expect(response.body.km).toBe(12000);
    });
  
    it('should return an error for a non-existent car', async () => {
      const response = await request(carsApiHandler).patch('/api/cars?id=999').send({ price: 30000 });
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Car not found');
    });
  });


// test delete
  describe('DELETE /api/cars', () => {
    it('should delete an existing car', async () => {
      const response = await request(carsApiHandler).delete('/api/cars?id=1');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Car deleted successfully');
    });
  
    it('should return an error for a non-existent car', async () => {
      const response = await request(carsApiHandler).delete('/api/cars?id=999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Car not found');
    });
  });