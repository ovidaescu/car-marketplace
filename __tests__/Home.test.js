import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../pages/index.js';
import React from 'react';

// Example test to check if car is added successfully
test('adds a car successfully', async () => {
  render(<Home />);

  // Make sure all the form fields are accessible
  const makeInput = screen.getByPlaceholderText('Make');
  const modelInput = screen.getByPlaceholderText('Model');
  const yearInput = screen.getByPlaceholderText('Year');
  const priceInput = screen.getByPlaceholderText('Price');
  const addButton = screen.getByText(/Add Car/i);

  // Simulate user typing in the form
  await userEvent.type(makeInput, 'Toyota');
  await userEvent.type(modelInput, 'Corolla');
  await userEvent.type(yearInput, '2022');
  await userEvent.type(priceInput, '20000');
  
  // Click the add button
  await userEvent.click(addButton);

  // Ensure the car is added to the document
  expect(screen.getByText('Toyota Corolla')).toBeInTheDocument();
  expect(screen.getByText('2022')).toBeInTheDocument();
  expect(screen.getByText('20000€')).toBeInTheDocument();
});

// Example test to check if car can be deleted
test('deletes a car successfully', async () => {
  render(<Home />);

  // Add a car first
  await userEvent.type(screen.getByPlaceholderText('Make'), 'Honda');
  await userEvent.type(screen.getByPlaceholderText('Model'), 'Civic');
  await userEvent.type(screen.getByPlaceholderText('Year'), '2021');
  await userEvent.type(screen.getByPlaceholderText('Price'), '18000');
  await userEvent.click(screen.getByText(/Add Car/i));

  // Ensure car appears
  expect(screen.getByText('Honda Civic')).toBeInTheDocument();

  // Click the delete button
  const deleteButton = screen.getByText(/Delete/i);
  await userEvent.click(deleteButton);

  // Ensure the car is removed from the document
  expect(screen.queryByText('Honda Civic')).not.toBeInTheDocument();
});
