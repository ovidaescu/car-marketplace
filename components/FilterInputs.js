import React from 'react';

export default function FilterInputs({ filters, handleFilterChange }) {
  return (
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
  );
}