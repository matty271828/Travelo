import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';
import { Marker } from 'react-map-gl';

export default function Map(){
  // variables used in rendering map
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng] = useState(18);
  const [lat] = useState(48.41);
  const [zoom] = useState(4.25);
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
    map.current.addControl(new maplibregl.NavigationControl(), 'top-left');

    // For use in removing markers from page
    var outwardMarkers=[];

    // Make request to DB for origin airports
    fetch('application/origins').then(origin_res => origin_res.json()).then(origin_data => {
      // BEGIN PRIMARY LOOP - through origin airports
      for (let key in origin_data){
        // Create markers
        const origin_marker = new maplibregl.Marker({color: "#FF0000"})
        .setLngLat([origin_data[key]['lng'], origin_data[key]['lat']])
        .addTo(map.current);

        // Add EventListener for each origin marker being clicked
        origin_marker.getElement().addEventListener('click', function onClick(event) {
          // Change colour of marker on selection
          event.target.style.fill = 'ad1717';

          // Clear outward markers already present on map
          if (outwardMarkers!==null) {
            for (var i = outwardMarkers.length - 1; i >= 0; i--) {
              outwardMarkers[i].remove();
            }
          }

          // Request outward airports from DB
          fetch('/application/outwards/' + key).then(outward_res => outward_res.json()).then(outward_data => {
            // BEGIN SECONDARY LOOP - through response and add markers
            for (let outward_key in outward_data){
              // Create markers
              const outward_marker = new maplibregl.Marker({color: "#10078a"})
              // TODO - figure out why this line isnt working
              .setLngLat([outward_data[outward_key]['lng'], outward_data[outward_key]['lat']])
              .addTo(map.current);

              // Add to outwardMarkers array
              outwardMarkers.push(outward_marker);
            }
            
          });
        });
      }
    });
  });
  
  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}