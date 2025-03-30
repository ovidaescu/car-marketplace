import React,{ useState, useEffect } from 'react';
import carsData, { validMakes, validModels, validTypes, validFuels } from '../data/cars';
import ChartComponent from '../components/ChartComponent';

export default function Home() {
  const [cars, setCars] = useState(carsData);
  const [newCar, setNewCar] = useState({ url: '', make: '', model: '', type: '', year: '', km: '', fuel: '', price: '', dateAdded: '' });
  const [editingCar, setEditingCar] = useState(null);
  const [sortOption, setSortOption] = useState('');
  const [filters, setFilters] = useState({ make: '', model: '', year: '', fuel: '' });
  const [statistics, setStatistics] = useState({ maxPrice: 0, minPrice: 0, avgPrice: 0 });
  const [chartDataLine, setChartDataLine] = useState({
    labels: [],
    datasets: [
      {
        label: 'Car Prices',
        data: [],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      },
    ],
  });
  const [chartDataBar, setChartDataBar] = useState({
    labels: [],
    datasets: [
      {
        label: 'Car Prices',
        data: [],
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
      },
    ],
  });
  const [chartDataPie, setChartDataPie] = useState({
    labels: [],
    datasets: [
      {
        label: 'Car Prices',
        data: [],
        borderColor: 'black', // Set the border color to black
        backgroundColor: [
          'rgba(54,162,235,0.2)',
          'rgba(255,206,86,0.2)',
          'rgba(75,192,192,0.2)',
          'rgba(153,102,255,0.2)',
          'rgba(255,159,64,0.2)',
        ],
      },
    ],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 3;

  useEffect(() => {
    if (cars.length > 0) {
      const { maxPrice, minPrice, avgPrice } = calculateStatistics(cars);
      setStatistics({ maxPrice, minPrice, avgPrice });
      updateChartData(cars);
    }
  }, [cars]);

  const updateChartData = (cars) => {
    if (!cars || cars.length === 0) return;

    const prices = cars.map(car => car.price);
    const labels = cars.map(car => car.make + ' ' + car.model);
    setChartDataLine({
      labels,
      datasets: [
        {
          label: 'Car Prices',
          data: prices,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
        },
      ],
    });
    setChartDataBar({
      labels,
      datasets: [
        {
          label: 'Car Prices',
          data: prices,
          borderColor: 'rgba(255,99,132,1)',
          backgroundColor: 'rgba(255,99,132,0.2)',
        },
      ],
    });
    setChartDataPie({
      labels,
      datasets: [
        {
          label: 'Car Prices',
          data: prices,
          borderColor: 'black', // Set the border color to black
          backgroundColor: [
            'rgba(54,162,235,0.2)',
            'rgba(255,206,86,0.2)',
            'rgba(75,192,192,0.2)',
            'rgba(153,102,255,0.2)',
            'rgba(255,159,64,0.2)',
          ],
        },
      ],
    });
  };

  const handleInputChange = (e) => {
    setNewCar({ ...newCar, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const validateCar = (car) => {
    if (!car.url) return 'URL field should not be empty';
    if (!car.make || !validMakes.includes(car.make)) return `Make must be one of the following: ${validMakes.join(', ')}`;
    if (!car.model || !validModels.includes(car.model)) return `Model must be one of the following: ${validModels.join(', ')}`;
    if (!car.type || !validTypes.includes(car.type)) return `Type must be one of the following: ${validTypes.join(', ')}`;
    if (!car.fuel || !validFuels.includes(car.fuel)) return `Fuel must be one of the following: ${validFuels.join(', ')}`;
    if (!car.make || !car.model || !car.type || !car.fuel) return 'Make, Model, Type, and Fuel are required.';
    const currentYear = new Date().getFullYear();
    if (!car.year || car.year < 1900 || car.year > currentYear) return 'Year should be a valid number between 1900 and the current year.';
    if (!car.km || car.km < 0) return 'Kilometers should be a non-negative number.';
    if (!car.price || car.price <= 0) return 'Price should be a positive number.';
    return '';
  };

  const addCar = () => {
    const validationError = validateCar(newCar);
    if (validationError) {
      alert(validationError);
      return;
    }

    let updatedCars;
    if (editingCar) {
      updatedCars = cars.map(car => (car.id === editingCar.id ? { ...newCar, id: editingCar.id } : car));
      setEditingCar(null);
    } else {
      const currentDate = new Date().toISOString().split('T')[0];
      const newCarEntry = { ...newCar, id: cars.length + 1, year: Number(newCar.year), price: Number(newCar.price), dateAdded: currentDate };
      updatedCars = [...cars, newCarEntry];
    }

    setCars(updatedCars);
    setNewCar({ url: '', make: '', model: '', type: '', year: '', km: '', fuel: '', price: '', dateAdded: '' });

    const { maxPrice, minPrice, avgPrice } = calculateStatistics(updatedCars);
    setStatistics({ maxPrice, minPrice, avgPrice });
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
    const updatedCars = cars.filter(car => car.id !== id);
    setCars(updatedCars);

    const { maxPrice, minPrice, avgPrice } = calculateStatistics(updatedCars);
    setStatistics({ maxPrice, minPrice, avgPrice });
  };

  const editCar = (car) => {
    setNewCar(car);
    setEditingCar(car);
  };

  const filteredCars = cars.filter(car => {
    return (
      (filters.make ? car.make.toLowerCase().includes(filters.make.toLowerCase()) : true) &&
      (filters.model ? car.model.toLowerCase().includes(filters.model.toLowerCase()) : true) &&
      (filters.year ? car.year === Number(filters.year) : true) &&
      (filters.fuel ? car.fuel.toLowerCase().includes(filters.fuel.toLowerCase()) : true)
    );
  });

  const calculateStatistics = (cars) => {
    if (cars.length === 0) return { maxPrice: 0, minPrice: 0, avgPrice: 0 };

    const prices = cars.map(car => Number(car.price));
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

    return { maxPrice, minPrice, avgPrice };
  };

  const getHighlightClass = (price) => {
    if (price === statistics.maxPrice) return 'highlight-max';
    if (price === statistics.minPrice) return 'highlight-min';
    if (Math.abs(price - statistics.avgPrice) < 1) return 'highlight-avg';
    return '';
  };

  // Pagination logic
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
        <input type="text" name="url" placeholder="URL" value={newCar.url} onChange={handleInputChange} />
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
      <br />
      <br />

      {/* Display Filtered Cars */}
      <div className="car-list">
        {currentCars.length > 0 ? (
          currentCars.map((car) => (
            <div key={car.id} className={`car-card ${getHighlightClass(car.price)}`}>
              <img src={car.url} alt={`${car.make} ${car.model}`} className="car-image" />
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

      {/* Pagination Controls */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="chart-container">
        <ChartComponent type="line" data={chartDataLine} options={{ responsive: true, maintainAspectRatio: false }} />
        <ChartComponent type="bar" data={chartDataBar} options={{ responsive: true, maintainAspectRatio: false }} />
        <ChartComponent type="pie" data={chartDataPie} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
}