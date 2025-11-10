import axios from 'axios'; // the HTTP client used to talk to the backend.

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
//Picks the API server address from an environment variable for production,
//  falling back to a local dev server on port 5000.



//Creates a reusable HTTP client with a baseURL 
// so calls can use relative paths like /api/projects, and sets default JSON headers.
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
//A request “middleware.” Before every outgoing request, it:
//Reads token from localStorage.
// If present, adds Authorization: Bearer <token> to headers.
// Returns the modified config so the request goes out authenticated.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
// A response “middleware.” After every response:
// If it’s OK, just pass the response through unchanged.
// If it’s an error and status is 401 (unauthorized/expired token), it:
// Removes the token from localStorage.
// Redirects the browser to /login (hard redirect so the app state resets cleanly).
// Then rethrows the error so the calling code can still show a toast, etc.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login'; // this redirect actually happen after the current JavaScript task finishes.
    }
    return Promise.reject(error);// this runs then redirection to login page happens.
  }
);

export default api;
