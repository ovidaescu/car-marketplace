import carsApiHandler, { resetCars } from '../pages/api/cars';
import { createRequest, createResponse } from 'node-mocks-http';

beforeEach(() => {
  resetCars();  // Reset the cars data before each test
});

describe('/api/cars API', () => {
  // Test for GET method: returns all cars
  it('GET returns all cars', async () => {
    const req = createRequest({
      method: 'GET',
    });
    const res = createResponse();
    await carsApiHandler(req, res);
    const cars = res._getJSONData();
    expect(res._getStatusCode()).toBe(200);
    expect(cars).toBeInstanceOf(Array);
  });

  // Test for GET method: filters cars by make and sorts by price
  it('GET filters by make and sorts by price', async () => {
    const req = createRequest({
      method: 'GET',
      query: { make: 'BMW', sortBy: 'price-low-high' },
    });
    const res = createResponse();
    await carsApiHandler(req, res);
    const cars = res._getJSONData();

    // Ensure cars are returned and sorted
    expect(res._getStatusCode()).toBe(200);
    expect(cars).toBeInstanceOf(Array);
    expect(cars.length).toBeGreaterThan(0);
    expect(cars[0].make).toBe('BMW');
    if (cars.length > 1) {
      expect(cars[0].price).toBeLessThanOrEqual(cars[1].price);
    }
  });

  // Test for POST method: creates a new valid car
  it('POST creates a new valid car', async () => {
    const carToAdd = {
      url: 'https://example.com/image.jpg',
      make: 'BMW',
      model: 'X5',
      type: 'SUV',
      fuel: 'Diesel',
      year: 2022,
      km: 15000,
      price: 40000,
    };

    const createReq = createRequest({ method: 'POST', body: carToAdd });
    const createRes = createResponse();
    await carsApiHandler(createReq, createRes);
    const createdCar = createRes._getJSONData();
    expect(createRes._getStatusCode()).toBe(201);
    expect(createdCar).toHaveProperty('id');
    expect(createdCar.price).toBe(40000);
  });

  // Test for POST method: fails validation for invalid fuel
  it('POST fails validation for invalid fuel', async () => {
    const carToAdd = {
      url: 'https://example.com/image.jpg',
      make: 'BMW',
      model: 'X5',
      type: 'SUV',
      fuel: 'InvalidFuel',
      year: 2022,
      km: 15000,
      price: 40000,
    };

    const createReq = createRequest({ method: 'POST', body: carToAdd });
    const createRes = createResponse();
    await carsApiHandler(createReq, createRes);
    const response = createRes._getJSONData();
    expect(createRes._getStatusCode()).toBe(400);
    expect(response.error).toBe('Fuel must be one of the following: Petrol, Diesel, Electric, Hybrid');
  });

  // Test for PATCH method: updates an existing car
  it('PATCH updates an existing car', async () => {
    const carToAdd = {
      url: 'https://example.com/image.jpg',
      make: 'BMW',
      model: 'X5',
      type: 'SUV',
      fuel: 'Diesel',
      year: 2022,
      km: 15000,
      price: 40000,
    };

    const createReq = createRequest({ method: 'POST', body: carToAdd });
    const createRes = createResponse();
    await carsApiHandler(createReq, createRes);

    const createdCar = createRes._getJSONData();

    const patchReq = createRequest({
      method: 'PATCH',
      query: { id: createdCar.id },
      body: { ...createdCar, price: 34000 },
    });
    const patchRes = createResponse();
    await carsApiHandler(patchReq, patchRes);

    const updated = patchRes._getJSONData();
    expect(patchRes._getStatusCode()).toBe(200);
    expect(updated.price).toBe(34000);
  });

  // Test for DELETE method: removes a car by ID
  it('DELETE removes a car by ID', async () => {
    const carToAdd = {
      url: 'https://example.com/image.jpg',
      make: 'BMW',
      model: 'X5',
      type: 'SUV',
      fuel: 'Diesel',
      year: 2022,
      km: 15000,
      price: 40000,
    };

    const createReq = createRequest({ method: 'POST', body: carToAdd });
    const createRes = createResponse();
    await carsApiHandler(createReq, createRes);

    const createdCar = createRes._getJSONData();

    const deleteReq = createRequest({
      method: 'DELETE',
      query: { id: createdCar.id },
    });
    const deleteRes = createResponse();
    await carsApiHandler(deleteReq, deleteRes);
    const response = deleteRes._getJSONData();
    expect(deleteRes._getStatusCode()).toBe(200);
    expect(response.message).toBe('Car deleted successfully');
  });
});
