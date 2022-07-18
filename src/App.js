import './App.css';
import Navbar from './components/navbar.js';
import Map from './components/map.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

function App() {
  // Callback function to pass data from map.js to app.js
  const [mapData, setMapData] = useState('...');
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
