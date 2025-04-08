import React from 'react';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../pages/index.js'; // Make sure to adjust the import path accordingly

// Mock fetch to simulate API responses
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);

describe('Home Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders the Home component correctly', () => {
    render(<Home />);
    expect(screen.getByText(/Welcome to the Car Marketplace/i)).toBeInTheDocument();
  });

  test('filters input changes correctly', () => {
    render(<Home />);
    const makeInput = screen.getByLabelText(/Make/i);
    fireEvent.change(makeInput, { target: { value: 'Toyota' } });

    expect(makeInput.value).toBe('Toyota');
  });

  test('sort option changes correctly', async () => {
    render(<Home />);
    const sortingDropdown = screen.getByTestId('sorting-dropdown'); // Assuming you add a testID to the dropdown
    fireEvent.change(sortingDropdown, { target: { value: 'price' } });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('sortBy=price')
      );
    });
  });

  test('add car form works correctly', async () => {
    render(<Home />);
    
    const makeInput = screen.getByLabelText(/Make/i);
    const modelInput = screen.getByLabelText(/Model/i);
    const priceInput = screen.getByLabelText(/Price/i);
    
    fireEvent.change(makeInput, { target: { value: 'BMW' } });
    fireEvent.change(modelInput, { target: { value: 'X5' } });
    fireEvent.change(priceInput, { target: { value: '50000' } });

    fireEvent.click(screen.getByText(/Save Car/i)); // Assuming a button exists with this text
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('method: POST')
      );
    });
  });

  test('delete car functionality works', async () => {
    render(<Home />);
    // Assuming delete button exists and has a text 'Delete'
    fireEvent.click(screen.getByText(/Delete/i));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('DELETE')
      );
    });
  });

  test('pagination works', () => {
    render(<Home />);
    
    const nextPageButton = screen.getByText(/Next/i); // Assuming button text for pagination
    fireEvent.click(nextPageButton);
    
    expect(screen.getByText(/Page 2/i)).toBeInTheDocument();
  });

  test('charts are rendered correctly', () => {
    render(<Home />);
    
    // Check that the charts are rendered
    expect(screen.getByTestId('line-chart')).toBeInTheDocument(); // Assuming chart components have test IDs
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });
});
