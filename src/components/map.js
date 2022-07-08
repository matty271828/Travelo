import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';
import { Marker } from 'react-map-gl';

export default function Map(){
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng] = useState(-2.99);
  const [lat] = useState(53.41);
  const [zoom] = useState(4);
  const [API_KEY] = useState('auR6Ih8HukHj8NgLxBk9');

  useEffect(() => {
    if (map.current) return;
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${API_KEY}`,
      center: [lng, lat],
      zoom: zoom
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // TODO read in all origin airports and loop to create markers

    // Create marker
    const marker1 = new maplibregl.Marker({color: "#FF0000"})
        .setLngLat([-2.99,53.41])
        .addTo(map.current);

    // use GetElement to get HTML Element from marker and add event
    marker1.getElement().addEventListener('click', function onClick(event) {
        // Change colour of marker
        event.target.style.fill = 'ad1717';

        // Add secondary marker
        const marker2 = new maplibregl.Marker({color: "#FF0000"})
            .setLngLat([-2.24,53.48])
            .addTo(map.current);
    });

  });
  
  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}