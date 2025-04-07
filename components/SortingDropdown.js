import React from 'react';

export default function SortingDropdown({ sortOption, setSortOption }) {
  return (
    <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
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
  );
}