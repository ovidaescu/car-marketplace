// data/cars.js

// Define valid sets
export const validMakes = ['Toyota', 'Honda', 'Ford', 'BMW', 'Audi'];
export const validModels = ['Corolla', 'Civic', 'Mustang', 'X5', 'A4'];
export const validTypes = ['Hatchback', 'Sedan', 'Coupe', 'SUV', 'Convertible'];
export const validFuels = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

// Car data
const cars = [
  { id: 1, make: 'Toyota', model: 'Corolla', type: 'Hatchback', year: 2020, km: 10000, fuel: 'Petrol', price: 18000, dateAdded: '2025-03-16' },
  { id: 2, make: 'Honda', model: 'Civic', type: 'Sedan', year: 2021, km: 65000, fuel: 'Diesel', price: 22000, dateAdded: '2025-03-13' },
  { id: 3, make: 'Ford', model: 'Mustang', type: 'Coupe', year: 2019, km: 30000, fuel: 'Petrol', price: 28000, dateAdded: '2025-02-12' }
];

export default cars;
