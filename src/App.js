import React, { useState, useEffect, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Header from './components/Header';
import './App.css';

import mapboxgl from '!mapbox-gl'; 

mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dHkyNzE4MjgiLCJhIjoiY2w1OGlxcXFhMjF3YzNwdDdqcjNyNTV0MSJ9.ZR4ZfABsOQIySoeqfoGKUg';

function App() {
  const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-2.85);
    const [lat, setLat] = useState(53.33);
    const [zoom, setZoom] = useState(6);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
  });  

  return (
    <div>
      <div className="topbar">
        Travelo 
      </div>

      <div>
        <div ref={mapContainer} className="map-container" />
      </div>

    </div>
  );
}

export default App;
