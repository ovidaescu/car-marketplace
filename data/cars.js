// data/cars.js

// Define valid sets
export const validMakes = ['Toyota', 'Honda', 'Ford', 'BMW', 'Audi'];
export const validModels = ['Corolla', 'Civic', 'Mustang', 'X5', 'A4'];
export const validTypes = ['Hatchback', 'Sedan', 'Coupe', 'SUV', 'Convertible'];
export const validFuels = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

// Car data
const cars = [
  { url: 'https://media.istockphoto.com/id/1490889104/photo/toyota-corolla-hybrid.jpg?s=612x612&w=0&k=20&c=_9l8ZyisQAh86uwKuyCWOZossiapILIYsR_5Xa-tSDY=',id: 1, make: 'Toyota', model: 'Corolla', type: 'Hatchback', year: 2020, km: 10000, fuel: 'Petrol', price: 18000, dateAdded: '2025-03-16' },
  { url: 'https://www.topgear.com/sites/default/files/images/news-article/2020/01/b905025387c82f922928e39fb3e9357c/2020-honda-civic-type-r1.jpg',id: 2, make: 'Honda', model: 'Civic', type: 'Sedan', year: 2021, km: 65000, fuel: 'Diesel', price: 22000, dateAdded: '2025-03-13' },
  { url: 'https://www.topgear.com/sites/default/files/cars-car/image/2024/12/mustang_lightning_blue_009.jpg',id: 3, make: 'Ford', model: 'Mustang', type: 'Coupe', year: 2019, km: 30000, fuel: 'Petrol', price: 28000, dateAdded: '2025-02-12' }
];

export default cars;
