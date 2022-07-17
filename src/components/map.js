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
    // Function to create and place a marker on the map
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

      // Make marker viewable on hover
      const markerDiv = marker.getElement();
      markerDiv.addEventListener('mouseenter', () => marker.togglePopup());
      markerDiv.addEventListener('mouseleave', () => marker.togglePopup());

      return marker
    }

    // Function to clear markers from map
    function clearMarkers(markerType, keepSelected, selectedMarker){
      switch (markerType) {
        case 'originMarker':
          if (originMarkers != null){
            // Retain the currently selected origin marker
            if (keepSelected == true){
              for (var i = originMarkers.length - 1; i >= 0; i--) {
                if (selectedMarker.getElement() != originMarkers[i].getElement())
                originMarkers[i].remove();
                // TODO review whether the marker is being removed from the array
              }
            } else {
              // Delete all origin markers from the map
              for (var i = originMarkers.length - 1; i >= 0; i--) {
                originMarkers[i].remove();
              }
            }
          }
        
        case 'outwardMarker':
          if (outwardMarkers != null){
            // Retain the currently selected origin marker
            if (keepSelected == true){
              for (var i = outwardMarkers.length - 1; i >= 0; i--) {
                if (selectedMarker.getElement() != outwardMarkers[i].getElement())
                outwardMarkers[i].remove();
              }
            } else {
              // Delete all origin markers from the map
              for (var i = outwardMarkers.length - 1; i >= 0; i--) {
                outwardMarkers[i].remove();
              }
            }
          }

        case 'returnMarker':
          if (returnMarkers != null){
            // Retain the currently selected origin marker
            if (keepSelected == true){
              for (var i = returnMarkers.length - 1; i >= 0; i--) {
                if (selectedMarker.getElement() != returnMarkers[i].getElement())
                returnMarkers[i].remove();
              }
            } else {
              // Delete all origin markers from the map
              for (var i = returnMarkers.length - 1; i >= 0; i--) {
                returnMarkers[i].remove();
              }
            }
          }          
      }
    }

    // Function to run the main program
    function controller() {
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

            // Clear all markers apart from the currently selected marker
            clearMarkers('originMarker', true, origin_marker);
            clearMarkers('outwardMarker', false, null);
            clearMarkers('returnMarker', false, null);

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
                  clearMarkers('outwardMarker', true, outward_marker);

                  // Request return airports from DB
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

                        // clear return markers from map
                        clearMarkers('returnMarker', true, return_marker);
                      });
                    }
                  });
                });
              }
            });
          });
        }
      });
    } 

    // Create Map
    if (map.current) return;
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${API_KEY}`,
      center: [lng, lat],
      zoom: zoom
    });

    // For use in removing markers from page
    var originMarkers=[];
    var outwardMarkers=[];
    var returnMarkers=[];

    // Add listener to reset when clicking on map
      map.current.on('click', (e) => {
        // Clear all markers from map
        clearMarkers('originMarker', false, null);
        clearMarkers('outwardMarker', false, null);
        clearMarkers('returnMarker', false, null);

        // Revert map markers to initial state
        controller();
        });

    // Add zoom controls to map
    map.current.addControl(new maplibregl.NavigationControl(), 'top-left');

    // Initialise map markers
    controller();

  });
  
  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}