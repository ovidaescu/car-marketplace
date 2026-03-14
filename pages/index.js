import React, { useState, useEffect } from 'react';
import SortingDropdown from '../components/SortingDropdown';
import FilterInputs from '../components/FilterInputs';
import CarForm from '../components/CarForm';
import CarList from '../components/CarList';
import Pagination from '../components/Pagination';
import ChartComponent from '../components/ChartComponent';

export default function Home() {
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState({ photoUrl: '', make: '', model: '', type: '', year: '', km: '', fuel: '', price: '', dateAdded: '' });
  const [editingCar, setEditingCar] = useState(null);
  const [sortOption, setSortOption] = useState('');
  const [filters, setFilters] = useState({ make: '', model: '', year: '', fuel: '' });
  const [statistics, setStatistics] = useState({ maxPrice: 0, minPrice: 0, avgPrice: 0 });
  const [chartDataLine, setChartDataLine] = useState({ labels: [], datasets: [{ label: 'Car Prices', data: [], borderColor: 'rgba(75,192,192,1)', backgroundColor: 'rgba(75,192,192,0.2)' }] });
  const [chartDataBar, setChartDataBar] = useState({ labels: [], datasets: [{ label: 'Car Prices', data: [], borderColor: 'rgba(255,99,132,1)', backgroundColor: 'rgba(255,99,132,0.2)' }] });
  const [chartDataPie, setChartDataPie] = useState({ labels: [], datasets: [{ label: 'Car Prices', data: [], borderColor: 'black', backgroundColor: ['rgba(54,162,235,0.2)','rgba(255,206,86,0.2)','rgba(75,192,192,0.2)','rgba(153,102,255,0.2)','rgba(255,159,64,0.2)'] }] });

  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 3;
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // WebSocket for real-time updates
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8081');

    ws.onopen = () => console.log('Connected to WebSocket server');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'INIT':
          setCars(message.cars);
          break;
        case 'ADD_CAR':
          setCars(prevCars =>
            prevCars.some(car => car.id === message.car.id)
              ? prevCars.map(car => (car.id === message.car.id ? message.car : car))
              : [message.car, ...prevCars] // prepend new car
          );
          break;
        case 'DELETE_CAR':
          setCars(prevCars => prevCars.filter(car => car.id !== message.carId));
          break;
        case 'EDIT_CAR':
          setCars(prevCars => prevCars.map(car => (car.id === message.car.id ? message.car : car)));
          break;
        default:
          console.error('Unknown message type:', message.type);
      }
    };

    ws.onclose = () => console.log('Disconnected from WebSocket server');

    return () => ws.close();
  }, []);

  // Fetch cars from the server
  useEffect(() => {
    fetchCars(true);
  }, [filters, sortOption]);

  const fetchCars = async (reset = false) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ ...filters });
      queryParams.append('limit', carsPerPage);
      queryParams.append('offset', reset ? 0 : cars.length);
      if (sortOption) queryParams.append('sortBy', sortOption);

      const response = await fetch(`/api/cars?${queryParams.toString()}`);
      const data = await response.json();

      setCars(prevCars => reset ? data : [...prevCars, ...data]);
      setHasMore(data.length === carsPerPage);
      updateChartData(reset ? data : [...cars, ...data]);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreCars = () => {
    if (!loading && hasMore) fetchCars();
  };

  // Update charts & statistics whenever cars change
  useEffect(() => {
    if (cars.length > 0) {
      const { maxPrice, minPrice, avgPrice } = calculateStatistics(cars);
      setStatistics({ maxPrice, minPrice, avgPrice });
      updateChartData(cars);
    }
  }, [cars]);

  const updateChartData = (cars) => {
    if (!cars || cars.length === 0) return;
    const prices = cars.map(c => c.price);
    const labels = cars.map(c => c.make + ' ' + c.model);

    setChartDataLine({ labels, datasets: [{ label: 'Car Prices', data: prices, borderColor: 'rgba(75,192,192,1)', backgroundColor: 'rgba(75,192,192,0.2)' }] });
    setChartDataBar({ labels, datasets: [{ label: 'Car Prices', data: prices, borderColor: 'rgba(255,99,132,1)', backgroundColor: 'rgba(255,99,132,0.2)' }] });
    setChartDataPie({ labels, datasets: [{ label: 'Car Prices', data: prices, borderColor: 'black', backgroundColor: ['rgba(54,162,235,0.2)','rgba(255,206,86,0.2)','rgba(75,192,192,0.2)','rgba(153,102,255,0.2)','rgba(255,159,64,0.2)'] }] });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  // Add or edit car
  const addCar = async () => {
    const operation = {
      method: editingCar ? 'PATCH' : 'POST',
      url: editingCar ? `/api/cars?id=${editingCar.id}` : '/api/cars',
      body: newCar
    };

    try {
      const response = await fetch(operation.url, {
        method: operation.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(operation.body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to save car');
        return;
      }

      const savedCar = await response.json();
      console.log('Saved car:', savedCar);

      // ✅ Remove local setCars here to avoid duplicates; WebSocket will update state

      setNewCar({ photoUrl: '', make: '', model: '', type: '', year: '', km: '', fuel: '', price: '', dateAdded: '' });
      setEditingCar(null);
    } catch (error) {
      console.error('Error saving car:', error);
    }
  };

  const deleteCar = async (id) => {
    try {
      const response = await fetch(`/api/cars?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        alert('Failed to delete car');
        return;
      }

      // ✅ WebSocket will remove it; no local update needed
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  const editCar = (car) => {
    setNewCar(car);
    setEditingCar(car);
  };

  const calculateStatistics = (cars) => {
    if (cars.length === 0) return { maxPrice: 0, minPrice: 0, avgPrice: 0 };
    const prices = cars.map(c => Number(c.price));
    return { maxPrice: Math.max(...prices), minPrice: Math.min(...prices), avgPrice: prices.reduce((a,b) => a+b, 0)/prices.length };
  };

  const getHighlightClass = (price) => {
    const numericPrice = Number(price);
    return numericPrice === statistics.maxPrice
      ? 'highlight-max'
      : numericPrice === statistics.minPrice
      ? 'highlight-min'
      : Math.abs(numericPrice - statistics.avgPrice) < 1
      ? 'highlight-avg'
      : '';
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
      <CarForm newCar={newCar} handleInputChange={e => setNewCar({ ...newCar, [e.target.name]: e.target.value })} addCar={addCar} editingCar={editingCar} />
      <CarList cars={currentCars} editCar={editCar} deleteCar={deleteCar} getHighlightClass={getHighlightClass} />
      <Pagination totalPages={totalPages} currentPage={currentPage} handlePageChange={setCurrentPage} />
      {hasMore && (
        <div className="load-more-container">
          <button onClick={loadMoreCars} disabled={loading} className="load-more-button">
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
      <div className="chart-container">
        <ChartComponent type="line" data={chartDataLine} options={{ responsive: true, maintainAspectRatio: false }} />
        <ChartComponent type="bar" data={chartDataBar} options={{ responsive: true, maintainAspectRatio: false }} />
        <ChartComponent type="pie" data={chartDataPie} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
}