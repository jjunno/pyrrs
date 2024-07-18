import axios from 'axios';

// http://localhost:3001/api
const publicApiUrl = import.meta.env.VITE_PUBLIC_API_URL;

const api = axios.create({
  baseURL: publicApiUrl,
  timeout: 3000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'true',
  },
});

export async function getWords() {
  return api.get(`words?ts=${Date.now()}`, { timeout: 10000 });
}
