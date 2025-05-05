module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('users', [
        { name: 'John Do', password: 'hashed_password_1', role: 0, createdat: new Date(), updatedat: new Date() },
        { name: 'Jane Smith', password: 'hashed_password_2', role: 1, createdat: new Date(), updatedat: new Date() },
      ]);
  
      await queryInterface.bulkInsert('cars', [
        { make: 'Toyota', model: 'Corolla', type: 'Hatchback', year: 2020, km: 10000, fuel: 'Petrol', price: 18000, dateadded: '2025-03-16', photourl: 'https://media.istockphoto.com/id/1490889104/photo/toyota-corolla-hybrid.jpg', ownerid: 1, createdat: new Date(), updatedat: new Date() },
        { make: 'Honda', model: 'Civic', type: 'Sedan', year: 2021, km: 65000, fuel: 'Diesel', price: 23000, dateadded: '2025-03-13', photourl: 'https://www.topgear.com/sites/default/files/images/news-article/2020/01/b905025387c82f922928e39fb3e9357c/2020-honda-civic-type-r1.jpg', ownerid: 2, createdat: new Date(), updatedat: new Date() },
      ]);
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('cars', null, {});
      await queryInterface.bulkDelete('users', null, {});
    },
  };