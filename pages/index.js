import { useEffect, useState } from 'react';

export default function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);  // To track loading state
  const [error, setError] = useState(null);  // For error handling

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/cars');
        if (!response.ok) {
          throw new Error('Failed to fetch cars');
        }
        const data = await response.json();
        console.log(data);  // Log data to check the format
        setCars(data);
      } catch (err) {
        setError(err.message);  // If there's an error, display the message
      } finally {
        setLoading(false);  // Stop loading once the request is complete
      }
    };

    fetchCars();
  }, []);

  return (
    <div>
      <h1>Welcome to the Car Marketplace</h1>
      {loading && <p>Loading cars...</p>}  {/* Show loading text */}
      {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Show error message */}
      <ul>
        {Array.isArray(cars) && cars.length > 0 ? (
          cars.map((car) => (
            <li key={car.id}>
              {car.make} {car.model} - ${car.price}
            </li>
          ))
        ) : (
          <p>No cars available</p>  // If no cars in the array
        )}
      </ul>
    </div>
  );
}
