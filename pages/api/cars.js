/*

import client from '../../lib/db';

export default async function handler(req, res) {
  try {
    const result = await client.query('SELECT * FROM cars');
    console.log(result.rows);  // Add this to check the data format
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
}
*/