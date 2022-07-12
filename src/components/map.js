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
  const [zoom] = useState(3);
  const [API_KEY] = useState('auR6Ih8HukHj8NgLxBk9');

  useEffect(() => {
    if (map.current) return;
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${API_KEY}`,
      center: [lng, lat],
      zoom: zoom
    });

    // Add zoom controls to map
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // For use in removing markers from page
    var outwardMarkers=[];

    // TODO read in all origin airports from DB and loop to create markers
    fetch('/application/origins');

    // Create marker
    const origin_marker1 = new maplibregl.Marker({color: "#FF0000"})
        .setLngLat([-2.99,53.41])
        .addTo(map.current);

    // Create marker
    const origin_marker2 = new maplibregl.Marker({color: "#FF0000"})
        .setLngLat([-0.461,51.48])
        .addTo(map.current);

    // use GetElement to get HTML Element from marker and add event
    origin_marker1.getElement().addEventListener('click', function onClick(event) {
        // Change colour of marker
        event.target.style.fill = 'ad1717';

        if (outwardMarkers!==null) {
          for (var i = outwardMarkers.length - 1; i >= 0; i--) {
            outwardMarkers[i].remove();
          }
        }

        // TODO read in destinations matching origin from DB and add event
        const outward_marker1 = new maplibregl.Marker({color: "#FF0000"})
            .setLngLat([12.49,41.90])
            .addTo(map.current);
        
        // Add to currentMarkers array
        outwardMarkers.push(outward_marker1);
    });

    // TODO put all marker loading into a loop
    // use GetElement to get HTML Element from marker and add event
    origin_marker2.getElement().addEventListener('click', function onClick(event) {
      // Change colour of marker
      event.target.style.fill = 'ad1717';

      if (outwardMarkers!==null) {
        for (var i = outwardMarkers.length - 1; i >= 0; i--) {
          outwardMarkers[i].remove();
        }
      }

      // TODO read in destinations matching origin from DB and add event
      const outward_marker2 = new maplibregl.Marker({color: "#FF0000"})
          .setLngLat([2.55,49.01])
          .addTo(map.current);
      
      // Add to currentMarkers array
      outwardMarkers.push(outward_marker2);
    });

  });
  
  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}