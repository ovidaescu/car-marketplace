import React from 'react';

export default function CarList({ cars, editCar, deleteCar, getHighlightClass }) {
  return (
    <div className="car-list">
      {cars.length > 0 ? (
        cars.map((car) => (
          <div key={car.id} className={`car-card ${getHighlightClass(car.price)}`}>
            <img src={car.photoUrl} alt={`${car.make} ${car.model}`} className="car-image" />
            <div className="car-details">
              <h3>{car.make} {car.model}</h3>
              <p>Type: {car.type}</p>
              <p>Year: {car.year}</p>
              <p>Kilometers: {car.km} km</p>
              <p>Fuel: {car.fuel}</p>
              <p>Price: {car.price}€</p>
              <p>Date Added: {car.dateAdded}</p>
            </div>
            <div className="car-actions">
              <button onClick={() => editCar(car)} className="edit-button">Edit</button>
              <button onClick={() => deleteCar(car.id)} className="delete-button">Delete</button>
            </div>
          </div>
        ))
      ) : (
        <p>No cars available</p>
      )}
    </div>
  );
}