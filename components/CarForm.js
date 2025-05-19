import React from 'react';

export default function CarForm({ newCar, handleInputChange, addCar, editingCar }) {
  return (
    <div className="form-container">
      <input type="text" name="photoUrl" placeholder="URL" value={newCar.photoUrl} onChange={handleInputChange} />
      <input type="text" name="make" placeholder="Make" value={newCar.make} onChange={handleInputChange} />
      <input type="text" name="model" placeholder="Model" value={newCar.model} onChange={handleInputChange} />
      <input type="text" name="type" placeholder="Type" value={newCar.type} onChange={handleInputChange} />
      <input type="number" name="year" placeholder="Year" value={newCar.year} onChange={handleInputChange} />
      <input type="number" name="km" placeholder="Km" value={newCar.km} onChange={handleInputChange} />
      <input type="text" name="fuel" placeholder="Fuel Type" value={newCar.fuel} onChange={handleInputChange} />
      <input type="number" name="price" placeholder="Price" value={newCar.price} onChange={handleInputChange} />
      <div className="button-container">
        <button onClick={addCar}>{editingCar ? 'Update Car' : 'Add Car'}</button>
      </div>
    </div>
  );
}