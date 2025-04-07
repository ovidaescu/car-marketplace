// data/cars.js

// Define valid sets
export const validMakes = ['Toyota', 'Honda', 'Ford', 'BMW', 'Audi'];
export const validModels = ['Corolla', 'Civic', 'Mustang', 'X5', 'A4'];
export const validTypes = ['Hatchback', 'Sedan', 'Coupe', 'SUV', 'Convertible','Break'];
export const validFuels = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

// Car data
const cars = [
  { url: 'https://media.istockphoto.com/id/1490889104/photo/toyota-corolla-hybrid.jpg?s=612x612&w=0&k=20&c=_9l8ZyisQAh86uwKuyCWOZossiapILIYsR_5Xa-tSDY=',id: 1, make: 'Toyota', model: 'Corolla', type: 'Hatchback', year: 2020, km: 10000, fuel: 'Petrol', price: 18000, dateAdded: '2025-03-16' },
  { url: 'https://www.topgear.com/sites/default/files/images/news-article/2020/01/b905025387c82f922928e39fb3e9357c/2020-honda-civic-type-r1.jpg',id: 2, make: 'Honda', model: 'Civic', type: 'Sedan', year: 2021, km: 65000, fuel: 'Diesel', price: 23000, dateAdded: '2025-03-13' },
  { url: 'https://www.topgear.com/sites/default/files/cars-car/image/2024/12/mustang_lightning_blue_009.jpg',id: 3, make: 'Ford', model: 'Mustang', type: 'Coupe', year: 2019, km: 30000, fuel: 'Petrol', price: 28000, dateAdded: '2025-02-12' },
  { url: 'https://media.ed.edmunds-media.com/bmw/x5-m/2015/oem/2015_bmw_x5-m_4dr-suv_base_fq_oem_1_1600.jpg',id: 4, make: 'BMW', model: 'X5', type: 'SUV', year: 2015, km: 150000, fuel: 'Diesel', price: 22000, dateAdded: '2025-02-07' },
  { url: 'https://car-images.bauersecure.com/wp-images/12793/audi_a4_100.jpg',id: 5, make: 'Audi', model: 'A4', type: 'Break', year: 2020, km: 41000, fuel: 'Petrol', price: 24000, dateAdded: '2025-01-11' }
];

export default cars;
