//currencyAPI.js

import axios from 'axios';

const API_URL = 'https://openexchangerates.org/api/currencies.json';
const API_KEY = 'e505c37ee7b1464394bff1f975686318';

export async function getAllCurrencies() {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Token ${API_KEY}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching currency data:', error);
    return null;
  }
}
