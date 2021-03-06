import './App.css';
import Navbar from './components/navbar.js';
import Map from './components/map.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

function App() {
  // Callback function to pass data from map.js to app.js, this will then be passed as a prop to Navbar
  const [mapData, setMapData] = useState(
    {origin_name: "...",
    outward_name: "...",
    cheapest_outward_flight: {date: "...", price: '...'},
    all_outward_prices: {},
    cheapest_return_flight: {date: "...", price: '...'},
    all_return_prices: {},
    return_name: "...",
    terminal_name: "..."}
  );
  
  const mapToApp = (mapData) => {
    setMapData(mapData);
  }

  return (
    <div className="App">
      <Router>
        <Navbar appToNavbar={mapData}/>
        <Routes>
          <Route path='/' />
        </Routes>
      </Router>

      <Map mapToApp={mapToApp}/>
    </div>
  );
}

export default App;
