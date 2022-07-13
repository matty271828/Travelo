import React, { useRef, useEffect, useState } from 'react';
import maplibregl, { Layout } from 'maplibre-gl';
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
    // Functions
    function create_marker(map, color, lng, lat){
      const marker = new maplibregl.Marker({color: color})
      .setLngLat([lng, lat])
      .addTo(map.current)
      return marker
    }

    // TODO - add function to clear markers

    // Create Map
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
    var originMarkers=[];
    var outwardMarkers=[];

    // Make request to DB for origin airports
    fetch('/application/origins').then(origin_res => origin_res.json()).then(origin_data => {
      // BEGIN PRIMARY LOOP - through origin airports
      for (let key in origin_data){
        // Create markers
        const origin_marker = create_marker(map, "#FF0000", origin_data[key]['lng'], origin_data[key]['lat'])
        originMarkers.push(origin_marker);

        // Add EventListener for each origin marker being clicked
        origin_marker.getElement().addEventListener('click', function onClick(event) {
          // Change colour of marker on selection
          event.target.style.fill = 'ad1717';

          // Clear origin markers already present on map
          if (originMarkers!==null) {
            for (var i = originMarkers.length - 1; i >= 0; i--) {
              if (origin_marker.getElement() != originMarkers[i].getElement())
              originMarkers[i].remove();
            }
          }

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
              // For use in next loop
              var returnMarkers=[];
              // Create outward markers
              const outward_marker = create_marker(map, "#10078a", outward_data[outward_key]['lng'], outward_data[outward_key]['lat'])
              outwardMarkers.push(outward_marker);

              // Add EventListener for outward marker being clicked
              outward_marker.getElement().addEventListener('click', function onClick(event) {
                // Change colour of marker on selection
                event.target.style.fill = 'ad1717';

                // clear other outward markers on map
                if (outwardMarkers!==null) {
                  for (var i = outwardMarkers.length - 1; i >= 0; i--) {
                    if (outward_marker.getElement() != outwardMarkers[i].getElement())
                    outwardMarkers[i].remove();
                  }
                }

                // TODO - Request return airports from DB
                fetch('/application/return/' + outward_key + '/' + key).then(return_res => return_res.json()).then(return_data => {
                  // BEGIN TERTIARY LOOP - add markers
                  for (let return_key in return_data){
                    // Create markers
                    const return_marker = create_marker(map, "#10078a", return_data[return_key]['lng'], return_data[return_key]['lat'])
                    returnMarkers.push(return_marker);
                    
                    // Add EventListener for return marker being clicked
                    return_marker.getElement().addEventListener('click', function onClick(event) {
                      // Change colour of marker on selection
                      event.target.style.fill = 'ad1717';

                      // TODO - clear return markers from map
                      // clear other outward markers on map
                      if (returnMarkers!==null) {
                        for (var i = returnMarkers.length - 1; i >= 0; i--) {
                          if (return_marker.getElement() != returnMarkers[i].getElement())
                          returnMarkers[i].remove();
                        }
                      }
                    });
                  }
                });
              });
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