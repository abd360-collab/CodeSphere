// React → Core React library for building components.
// ReactDOM → Used to connect React with the real DOM (browser).
// index.css → Global styles (here Tailwind’s compiled CSS + your custom styles).
// App → The main component of the entire frontend (imported from App.js).
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // main frontend component.


// document.getElementById('root') → Finds the <div id="root"></div> inside public/index.html.
// ReactDOM.createRoot() → Creates a root container for React 18’s concurrent rendering (newer, better than the old ReactDOM.render).
const root = ReactDOM.createRoot(document.getElementById('root'));



// StrictMode → A helper wrapper for development. It checks for potential problems (like deprecated APIs, unsafe lifecycle methods). 
// Inside it, we mount <App /> → This is where our whole React app begins.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


