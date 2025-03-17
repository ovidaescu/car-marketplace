import { useState } from 'react';
import carsData, { validMakes, validModels, validTypes, validFuels } from '../data/cars';

export default function Home() {
  const [cars, setCars] = useState(carsData);
  const [newCar, setNewCar] = useState({ make: '', model: '', type: '', year: '', km: '', fuel: '', price: '' , dateAdded: ''});
  const [editingCar, setEditingCar] = useState(null); // Track the car being edited
  const [sortOption, setSortOption] = useState(''); // Define state for sorting option
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    year: '',
    fuel: '',
  });


  const handleInputChange = (e) => {
    setNewCar({ ...newCar, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const validateCar = (car) => {

    if (!car.make || !validMakes.includes(car.make)) {
      return `Make must be one of the following: ${validMakes.join(', ')}`;
    }

    if (!car.model || !validModels.includes(car.model)) {
      return `Model must be one of the following: ${validModels.join(', ')}`;
    }

    if (!car.type || !validTypes.includes(car.type)) {
      return `Type must be one of the following: ${validTypes.join(', ')}`;
    }

    if (!car.fuel || !validFuels.includes(car.fuel)) {
      return `Fuel must be one of the following: ${validFuels.join(', ')}`;
    }


    // Check if required fields are filled
    if (!car.make || !car.model || !car.type || !car.fuel) {
      return 'Make, Model, Type, and Fuel are required.';
    }
  
    // Validate year
    const currentYear = new Date().getFullYear();

    if (!car.year || car.year < 1900 || car.year > currentYear) {
      return 'Year should be a valid number between 1900 and the current year.';
    }
  
    // Validate kilometers (km)
    if (!car.km || car.km < 0) {
      return 'Kilometers should be a non-negative number.';
    }
  
    // Validate price
    if (!car.price || car.price <= 0) {
      return 'Price should be a positive number.';
    }
  
    return ''; // No errors
  };

  const addCar = () => {
    /*
    if (!newCar.make || !newCar.model || !newCar.type || !newCar.year || !newCar.km || !newCar.fuel || !newCar.price) {
      alert('All fields are required');
      return;
    }
      */

    const validationError = validateCar(newCar);
    if (validationError) {
      alert(validationError); // Show error message if validation fails
      return;
    }

    if (editingCar) {
      // Update existing car
      setCars(cars.map(car => (car.id === editingCar.id ? { ...newCar, id: editingCar.id } : car)));
      setEditingCar(null); // Exit edit mode
    } else {
      // Add new car
      const currentDate = new Date().toISOString().split('T')[0];;
      const newCarEntry = { ...newCar, id: cars.length + 1, year: Number(newCar.year), price: Number(newCar.price), dateAdded: currentDate };
      setCars([...cars, newCarEntry]);
    }

    setNewCar({ make: '', model: '', type: '', year: '', km: '', fuel: '', price: '' ,dateAdded: ''}); // Reset form
  };


  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);

    let sortedCars = [...cars];

    if (option === 'newest-first') {
      sortedCars.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    } else if (option === 'oldest-first') {
      sortedCars.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
    } else if (option === 'price-low-high') {
      sortedCars.sort((a, b) => a.price - b.price);
    } else if (option === 'price-high-low') {
      sortedCars.sort((a, b) => b.price - a.price);
    } else if (option === 'year-new-old') {
      sortedCars.sort((a, b) => b.year - a.year);
    } else if (option === 'year-old-new') {
      sortedCars.sort((a, b) => a.year - b.year);
    } else if (option === 'km-low-high') {
      sortedCars.sort((a, b) => a.km - b.km);
    } else if (option === 'km-high-low') {
      sortedCars.sort((a, b) => b.km - a.km);
    }

    setCars(sortedCars);
  };

  const deleteCar = (id) => {
    setCars(cars.filter(car => car.id !== id));
  };

  const editCar = (car) => {
    setNewCar(car); // Prefill the form
    setEditingCar(car); // Set the car being edited
  };

  const filteredCars = cars.filter(car => {
    return (
      (filters.make ? car.make.toLowerCase().includes(filters.make.toLowerCase()) : true) &&
      (filters.model ? car.model.toLowerCase().includes(filters.model.toLowerCase()) : true) &&
      (filters.year ? car.year === Number(filters.year) : true) &&
      (filters.fuel ? car.fuel.toLowerCase().includes(filters.fuel.toLowerCase()) : true)
    );
  });

  return (
    <div>
      <h1>Welcome to the Car Marketplace</h1>


       {/* Sorting Dropdown */}
       <select value={sortOption} onChange={handleSortChange}>
        <option value="">Sort By</option>
        <option value="newest-first">Date Added (Newest First)</option>
        <option value="oldest-first">Date Added (Oldest First)</option>
        <option value="price-low-high">Price (Low to High)</option>
        <option value="price-high-low">Price (High to Low)</option>
        <option value="year-new-old">Year (Newest to Oldest)</option>
        <option value="year-old-new">Year (Oldest to Newest)</option>
        <option value="km-low-high">Kilometers (Low to High)</option>
        <option value="km-high-low">Kilometers (High to Low)</option>
      </select>

       {/* Filter Inputs */}
       <div className="filter-container">
        <input
          type="text"
          name="make"
          placeholder="Filter by Make"
          value={filters.make}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="model"
          placeholder="Filter by Model"
          value={filters.model}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="year"
          placeholder="Filter by Year"
          value={filters.year}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="fuel"
          placeholder="Filter by Fuel Type"
          value={filters.fuel}
          onChange={handleFilterChange}
        />
      </div>


      {/* Form to Add or Edit Car */}
      <div className="form-container">
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

      <br />

      {/* Display Filtered Cars */}
      <ul>
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <li key={car.id}>
              {car.make} {car.model}, {car.type}, {car.year}, {car.km} km, {car.fuel} - {car.price}€, {car.dateAdded}
              <button onClick={() => editCar(car)} style={{ marginLeft: '10px', color: 'blue' }}>Edit</button>
              <button onClick={() => deleteCar(car.id)} style={{ marginLeft: '10px', color: 'red' }}>Delete</button>
            </li>
          ))
        ) : (
          <p>No cars available</p>
        )}
      </ul>
    </div>
  );
}