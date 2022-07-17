import React, { useRef, useEffect, useState } from 'react';
import maplibregl, { Layout } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';
import { Marker } from 'react-map-gl';

export default function Map(){
  // variables used in rendering map
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng] = useState(25);
  const [lat] = useState(48.41);
  const [zoom] = useState(3.5);
  const [API_KEY] = useState('auR6Ih8HukHj8NgLxBk9');

  useEffect(() => {
    // Functions
    function create_marker(map, type, place_name ,lng, lat){
      // Create a DOM element for each marker.
      var el = document.createElement('div');
      if (type == 'origin'){
        el.id = 'origin-marker';
      } else {
        el.id = 'outward-marker';
      }

      // create a popup
      var popup = new maplibregl.Popup({ offset: 5 }).setText(
        place_name
        );

      // Create the marker
      const marker = new maplibregl.Marker(el)
      .setLngLat([lng, lat])
      .setPopup(popup) // sets a popup on this marker
      .addTo(map.current)

      const markerDiv = marker.getElement();

      markerDiv.addEventListener('mouseenter', () => marker.togglePopup());
      markerDiv.addEventListener('mouseleave', () => marker.togglePopup());

      // Return statement
      return marker
    }

    // Function to clear origin markers, boolean keepSelected indicates whether to completely reset
    function clearOriginMarkers(keepSelected, selectedMarker) {
      // Clear origin markers already present on map
      if (keepSelected == true){
        if (clearOriginMarkers == true && originMarkers!==null) {
          for (var i = originMarkers.length - 1; i >= 0; i--) {
            if (selectedMarker.getElement() != originMarkers[i].getElement())
            originMarkers[i].remove();
          }
        }
      } else {
        if (originMarkers!==null) {
          for (var i = originMarkers.length - 1; i >= 0; i--) {
            if (selectedMarker.getElement() != originMarkers[i].getElement())
            originMarkers[i].remove();
          }
        }
      }
    }

    function clearOutwardMarkers(keepSelected, selectedMarker) {
      // Clear origin markers already present on map
      if (keepSelected == true){
        if (clearOutwardMarkers == true && outwardMarkers!==null) {
          for (var i = originMarkers.length - 1; i >= 0; i--) {
            if (selectedMarker.getElement() != outwardMarkers[i].getElement())
            outwardMarkers[i].remove();
          }
        }
      } else {
        if (outwardMarkers!==null) {
          for (var i = outwardMarkers.length - 1; i >= 0; i--) {
            if (selectedMarker.getElement() != outwardMarkers[i].getElement())
            outwardMarkers[i].remove();
          }
        }
      }
    }

    function clearOutwardMarkers(keepSelected, selectedMarker) {
      // Clear origin markers already present on map
      if (keepSelected == true){
        if (clearOutwardMarkers == true && outwardMarkers!==null) {
          for (var i = originMarkers.length - 1; i >= 0; i--) {
            if (selectedMarker.getElement() != outwardMarkers[i].getElement())
            outwardMarkers[i].remove();
          }
        }
      } else {
        if (outwardMarkers!==null) {
          for (var i = outwardMarkers.length - 1; i >= 0; i--) {
            if (selectedMarker.getElement() != outwardMarkers[i].getElement())
            outwardMarkers[i].remove();
          }
        }
      }
    }

    function clearReturnMarkers(keepSelected, selectedMarker) {
      // Clear origin markers already present on map
      if (keepSelected == true){
        if (clearReturnMarkers == true && returnMarkers!==null) {
          for (var i = returnMarkers.length - 1; i >= 0; i--) {
            if (selectedMarker.getElement() != returnMarkers[i].getElement())
            returnMarkers[i].remove();
          }
        }
      } else {
        if (returnMarkers!==null) {
          for (var i = returnMarkers.length - 1; i >= 0; i--) {
            if (selectedMarker.getElement() != returnMarkers[i].getElement())
            returnMarkers[i].remove();
          }
        }
      }
    }

    // Create Map
    if (map.current) return;
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${API_KEY}`,
      center: [lng, lat],
      zoom: zoom
    });

    // Add listener to reset when clicking on map
    map.current.on('click', (e) => {
      const marker = new maplibregl.Marker()
      .setLngLat([2, 52])
      .addTo(map.current)
      });

    // Add zoom controls to map
    map.current.addControl(new maplibregl.NavigationControl(), 'top-left');

    // For use in removing markers from page
    var originMarkers=[];
    var outwardMarkers=[];
    var returnMarkers = [];

    // Make request to DB for origin airports
    fetch('/application/origins').then(origin_res => origin_res.json()).then(origin_data => {
      // BEGIN PRIMARY LOOP - through origin airports
      for (let key in origin_data){
        // Create markers
        const origin_marker = create_marker(map, "origin", origin_data[key]['place_name'], origin_data[key]['lng'], origin_data[key]['lat'])
        originMarkers.push(origin_marker);

        // Add EventListener for each origin marker being clicked
        origin_marker.getElement().addEventListener('click', function onClick(event) {
          // Ensures map click listener is not triggered
          event.stopPropagation();

          // Clear all markers on map apart from the selected marker
          clearOriginMarkers(true, origin_marker);
          clearOutwardMarkers(false, origin_marker);
          clearReturnMarkers(false, origin_marker);

          // Request outward airports from DB
          fetch('/application/outwards/' + key).then(outward_res => outward_res.json()).then(outward_data => {
            // BEGIN SECONDARY LOOP - through response and add markers
            for (let outward_key in outward_data){
              // Create outward markers
              const outward_marker = create_marker(map, "#outward", outward_data[outward_key]['place_name'], outward_data[outward_key]['lng'], outward_data[outward_key]['lat'])
              outwardMarkers.push(outward_marker);

              // Add EventListener for outward marker being clicked
              outward_marker.getElement().addEventListener('click', function onClick(event) {
                // Ensures map click listener is not triggered
                event.stopPropagation();

                // clear other outward markers on map
                clearOutwardMarkers(true, outward_marker);

                // TODO - Request return airports from DB
                fetch('/application/return/' + outward_key + '/' + key).then(return_res => return_res.json()).then(return_data => {
                  // BEGIN TERTIARY LOOP - add markers
                  for (let return_key in return_data){
                    // Create markers
                    const return_marker = create_marker(map, "return", return_data[return_key]['place_name'], return_data[return_key]['lng'], return_data[return_key]['lat'])
                    returnMarkers.push(return_marker);
                    
                    // Add EventListener for return marker being clicked
                    return_marker.getElement().addEventListener('click', function onClick(event) {
                      // Ensures map click listener is not triggered
                      event.stopPropagation();

                      // TODO - clear return markers from map
                      clearReturnMarkers(true, return_marker);
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