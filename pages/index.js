import React, { useState, useEffect } from 'react';
import SortingDropdown from '../components/SortingDropdown';
import FilterInputs from '../components/FilterInputs';
import CarForm from '../components/CarForm';
import CarList from '../components/CarList';
import Pagination from '../components/Pagination';
import ChartComponent from '../components/ChartComponent';
import { saveOperationLocally, getPendingOperations, clearPendingOperations } from '../utils/localstorage';

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

  const [isOffline, setIsOffline] = useState(false);
  const [isServerDown, setIsServerDown] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [ws, setWs] = useState(null);

  const syncWithServer = async () => {
    const pendingOperations = getPendingOperations();

    for (const operation of pendingOperations) {
      try {
        await fetch(operation.url, {
          method: operation.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(operation.body),
        });
      } catch (error) {
        console.error('Failed to sync operation:', operation);
      }
    }

    clearPendingOperations();
  };

  useEffect(() => {
    if (!isOffline && !isServerDown) {
      syncWithServer();
    }
  }, [isOffline, isServerDown]);

  useEffect(() => {
    setHasMounted(true);
    setIsOffline(!navigator.onLine);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [hasMounted]);

  useEffect(() => {
    if (!hasMounted || isOffline) return;

    const checkServerStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/cars');
        if (!response.ok) throw new Error('Server is down');
        setIsServerDown(false);
      } catch (error) {
        setIsServerDown(true);
      }
    };

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 10000);
    return () => clearInterval(interval);
  }, [hasMounted, isOffline]);

  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 3;

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const queryParams = new URLSearchParams(filters);
        if (sortOption) queryParams.append('sortBy', sortOption);

        const response = await fetch(`http://localhost:3000/api/cars?${queryParams.toString()}`);
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, [filters, sortOption]);

  useEffect(() => {
    if (cars.length > 0) {
      const { maxPrice, minPrice, avgPrice } = calculateStatistics(cars);
      setStatistics({ maxPrice, minPrice, avgPrice });
      updateChartData(cars);
    }
  }, [cars]);

  const updateChartData = (cars) => {
    if (!cars || cars.length === 0) return;

    const prices = cars.map((car) => car.price);
    const labels = cars.map((car) => car.make + ' ' + car.model);
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

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    setWs(socket);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'INIT':
          setCars(message.cars);
          break;

        case 'ADD_CAR':
          setCars((prevCars) => [...prevCars, message.car]);
          break;

        case 'DELETE_CAR':
          setCars((prevCars) => prevCars.filter((car) => car.id !== message.id));
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

    socket.onopen = () => console.log('Connected to WebSocket server');
    socket.onclose = () => console.log('Disconnected from WebSocket server');

    return () => socket.close();
  }, []);

  const handleInputChange = (e) => setNewCar({ ...newCar, [e.target.name]: e.target.value });
  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const addCar = async () => {
    const operation = {
      method: editingCar ? 'PATCH' : 'POST',
      url: editingCar
        ? `http://localhost:3000/api/cars?id=${editingCar.id}`
        : 'http://localhost:3000/api/cars',
      body: newCar,
    };

    if (isOffline || isServerDown) {
      saveOperationLocally(operation);

      setCars((prevCars) =>
        editingCar
          ? prevCars.map((car) => (car.id === editingCar.id ? { ...car, ...newCar } : car))
          : [...prevCars, { ...newCar, id: Date.now() }]
      );

      setNewCar({ url: '', make: '', model: '', type: '', year: '', km: '', fuel: '', price: '', dateAdded: '' });
      setEditingCar(null);
      return;
    }

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
      setCars((prevCars) =>
        editingCar
          ? prevCars.map((car) => (car.id === savedCar.id ? savedCar : car))
          : [...prevCars, savedCar]
      );

      if (ws) {
        ws.send(JSON.stringify({ type: 'ADD_CAR', car: savedCar }));
      }

      setNewCar({ url: '', make: '', model: '', type: '', year: '', km: '', fuel: '', price: '', dateAdded: '' });
      setEditingCar(null);
    } catch (error) {
      console.error('Error saving car:', error);
    }
  };

  const deleteCar = async (id) => {
    const operation = {
      method: 'DELETE',
      url: `http://localhost:3000/api/cars?id=${id}`,
    };

    if (isOffline || isServerDown) {
      saveOperationLocally(operation);

      setCars((prevCars) => prevCars.filter((car) => car.id !== id));
      return;
    }

    try {
      const response = await fetch(operation.url, { method: operation.method });

      if (!response.ok) {
        alert('Failed to delete car');
        return;
      }

      setCars((prevCars) => prevCars.filter((car) => car.id !== id));

      if (ws) {
        ws.send(JSON.stringify({ type: 'DELETE_CAR', id }));
      }
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  const editCar = (car) => {
    setNewCar(car);
    setEditingCar(car);

    if (ws) {
      ws.send(JSON.stringify({ type: 'EDIT_CAR', car }));
    }
  };

  const calculateStatistics = (cars) => {
    if (cars.length === 0) return { maxPrice: 0, minPrice: 0, avgPrice: 0 };

    const prices = cars.map((car) => Number(car.price));
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

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(cars.length / carsPerPage);

  return (
    <div>
      <h1>Welcome to the Car Marketplace</h1>
      {isOffline && <div className="alert alert-warning">You are offline. Changes will be saved locally.</div>}
      {isServerDown && !isOffline && <div className="alert alert-danger">The server is down. Changes will sync when it's back online.</div>}
      <SortingDropdown sortOption={sortOption} setSortOption={setSortOption} />
      <FilterInputs filters={filters} handleFilterChange={handleFilterChange} />
      <CarForm newCar={newCar} handleInputChange={handleInputChange} addCar={addCar} editingCar={editingCar} />
      <CarList cars={currentCars} editCar={editCar} deleteCar={deleteCar} getHighlightClass={getHighlightClass} />
      <Pagination totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
      <div className="chart-container">
        <ChartComponent type="line" data={chartDataLine} options={{ responsive: true, maintainAspectRatio: false }} />
        <ChartComponent type="bar" data={chartDataBar} options={{ responsive: true, maintainAspectRatio: false }} />
        <ChartComponent type="pie" data={chartDataPie} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
}