const { faker } = require('@faker-js/faker');
const db = require('../models'); // Adjust if the path differs
const { Car, User } = db;  // Assuming you have a User model

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connected.');

    // Step 1: Generate and insert 1000 fake users
    const users = [];
    for (let i = 0; i < 1000; i++) {
      users.push({
        name: faker.person.fullName(), // Updated to use the new faker API
        email: faker.internet.email(),
        password: faker.internet.password(),  // In a real app, ensure proper password hashing!
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      });
    }

    // Insert the users into the database
    await User.bulkCreate(users);
    console.log('✅ 1000 users inserted successfully.');

    // Step 2: Generate 100,000 cars linked to the users
    const cars = [];
    for (let i = 0; i < 100000; i++) {
      cars.push({
        make: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        type: faker.vehicle.type(),
        year: faker.date.past({ years: 30 }).getFullYear(),
        km: faker.number.int({ min: 0, max: 300000 }),
        fuel: faker.helpers.arrayElement(['Petrol', 'Diesel', 'Electric', 'Hybrid']),
        price: faker.number.int({ min: 5000, max: 100000 }),
        dateAdded: faker.date.recent(),
        photoUrl: faker.image.url(),
        ownerId: faker.number.int({ min: 1, max: 1000 }),  // Linking to a user ID between 1 and 1000
      });
    }

    // Insert the cars into the database
    await Car.bulkCreate(cars);
    console.log('✅ 100,000 cars inserted successfully.');

    process.exit();
  } catch (error) {
    console.error('❌ Error populating database:', error);
    process.exit(1);
  }
})();
