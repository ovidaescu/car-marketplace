import React, { useState, useEffect } from 'react';
import SortingDropdown from '../components/SortingDropdown';
import FilterInputs from '../components/FilterInputs';
import CarForm from '../components/CarForm';
import CarList from '../components/CarList';
import Pagination from '../components/Pagination';
import ChartComponent from '../components/ChartComponent';

export default function Home() {
  const [cars, setCars] = useState([]);
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
        borderColor: 'black',
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


  // if you don want to use the socket comment  this below and decomment the setCars in addCar and deleteCar function
  // also comment the broadcast function in the backend
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8081');
  
    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

  
    ws.onmessage = (event) => {
      console.log('Message received:', event.data);

      const message = JSON.parse(event.data);
  
      switch (message.type) {
        case 'INIT':
          setCars(message.cars);
          break;
        case 'ADD_CAR':
          //setCars((prevCars) => [...prevCars, message.car]);
          setCars((prevCars) => {
            return prevCars.some((car) => car.id === message.car.id)
              ? prevCars.map((car) => (car.id === message.car.id ? message.car : car)) // Update existing car
              : [...prevCars, message.car]; // Add new car
          });
          break;
        case 'DELETE_CAR':
          setCars((prevCars) => prevCars.filter((car) => car.id !== message.carId));
          break;
        case 'EDIT_CAR':
          setCars((prevCars) =>
            prevCars.map((car) => (car.id === message.car.id ? message.car : car))
          );
          break;
      default:
        console.error('Unknown message type:', message.type);
      }
    };
  
    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };
  
    return () => {
      ws.close();
    };
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 3;

  // Fetch cars from the server
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const queryParams = new URLSearchParams(filters);
        if (sortOption) queryParams.append('sortBy', sortOption);

        const response = await fetch(`http://localhost:3000/api/cars?${queryParams.toString()}`);
        const data = await response.json();
        setCars(data);
        updateChartData(data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, [filters, sortOption]);


  // update charts after crud operations
  useEffect(() => {
    if (cars.length > 0) {
      const { maxPrice, minPrice, avgPrice } = calculateStatistics(cars);
      setStatistics({ maxPrice, minPrice, avgPrice });
      updateChartData(cars);
    }
  }, [cars]);

  // Update chart data based on the fetched cars
  const updateChartData = (cars) => {
    if (!cars || cars.length === 0) return;

    const prices = cars.map((car) => car.price);
    const labels = (cars || []).map((car) => car.make + ' ' + car.model);
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
          borderColor: 'black',
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  

  // Add a new car or update an existing car
  const addCar = async () => {
    const operation = {
      method: editingCar ? 'PATCH' : 'POST',
      url: editingCar
        ? `http://localhost:3000/api/cars?id=${editingCar.id}`
        : 'http://localhost:3000/api/cars',
      body: newCar,
    };
  
    try {
      const response = await fetch(operation.url, {
        method: operation.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(operation.body),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to save car');
        return;
      }
  
      const savedCar = await response.json();
      console.log('Saved car:', savedCar); // Debugging log
  

      // Do not update state here; rely on WebSocket message
      /*
      setCars((prevCars) => {
        return editingCar
          ? prevCars.map((car) => (car.id === savedCar.id ? savedCar : car))
          : [...prevCars, savedCar];
      });
      */
  
      setNewCar({ url: '', make: '', model: '', type: '', year: '', km: '', fuel: '', price: '', dateAdded: '' });
      setEditingCar(null);
    } catch (error) {
      console.error('Error saving car:', error);
    }
  };

  // Delete a car
  const deleteCar = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/cars?id=${id}`, { method: 'DELETE' });

      if (!response.ok) {
        alert('Failed to delete car');
        return;
      }

      /*
      setCars((prevCars) => {
        const updatedCars = prevCars.filter((car) => car.id !== id); // For delete
        const { maxPrice, minPrice, avgPrice } = calculateStatistics(updatedCars);
        setStatistics({ maxPrice, minPrice, avgPrice }); // Update statistics
        return updatedCars;
      });
      */


      // Do not update state here; rely on WebSocket message
      //setCars((prevCars) => prevCars.filter((car) => car.id !== id));

    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  // Edit a car
  const editCar = (car) => {
    setNewCar(car);
    setEditingCar(car);
  };

  // Calculate statistics for the cars
  const calculateStatistics = (cars) => {
    if (cars.length === 0) return { maxPrice: 0, minPrice: 0, avgPrice: 0 };

    const prices = cars.map((car) => Number(car.price));
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

    return { maxPrice, minPrice, avgPrice };
  };

  const getHighlightClass = (price) => {
    const numericPrice = Number(price);
    const highlightClass =
      numericPrice === statistics.maxPrice
        ? 'highlight-max'
        : numericPrice === statistics.minPrice
        ? 'highlight-min'
        : Math.abs(numericPrice - statistics.avgPrice) < 1
        ? 'highlight-avg'
        : '';
  
    return highlightClass;
  };
  

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(cars.length / carsPerPage);

  return (
    <div>
      <h1>Welcome to the Car Marketplace</h1>
      <SortingDropdown sortOption={sortOption} setSortOption={setSortOption} />
      <FilterInputs filters={filters} handleFilterChange={handleFilterChange} />
      <CarForm newCar={newCar} handleInputChange={(e) => setNewCar({ ...newCar, [e.target.name]: e.target.value })} addCar={addCar} editingCar={editingCar} />
      <CarList cars={currentCars} editCar={editCar} deleteCar={deleteCar} getHighlightClass={getHighlightClass} />
      <Pagination totalPages={totalPages} currentPage={currentPage} handlePageChange={setCurrentPage} />
      <div className="chart-container">
        <ChartComponent type="line" data={chartDataLine} options={{ responsive: true, maintainAspectRatio: false }} />
        <ChartComponent type="bar" data={chartDataBar} options={{ responsive: true, maintainAspectRatio: false }} />
        <ChartComponent type="pie" data={chartDataPie} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
}