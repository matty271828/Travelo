import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';

export default function Map({mapToApp}){
  // variables used in rendering map
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng] = useState(17);
  const [lat] = useState(46.41);
  const [zoom] = useState(4);
  const [API_KEY] = useState('auR6Ih8HukHj8NgLxBk9');

  useEffect(() => {
    
    // Function to create and place a marker on the map
    function create_marker(map, type, iata_code, place_name , lng, lat, price){
      // Create a DOM element for each marker.
      var el = document.createElement('div');
      if (type == 'selected-marker'){
        el.id = 'selected-marker';
      } else {
        el.id = 'standard-marker';
      }

      let markerHtml;

      // Prepare text
      if (price != 'null'){
        markerHtml = '<div>' + place_name + ' (' + iata_code + ')</div><b><center>£' + price + '</center></b>' ;
      } else {
        markerHtml = '<div>' + place_name + ' (' + iata_code + ')</div>';
      }

      // create a popup
      var popup = new maplibregl.Popup({ offset: 5 }).setHTML(
        markerHtml
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

          case 'terminalMarker':
            if (terminalMarkers != null){
              // Retain the currently selected origin marker
              if (keepSelected == true){
                for (var i = terminalMarkers.length - 1; i >= 0; i--) {
                  if (selectedMarker.getElement() != terminalMarkers[i].getElement())
                  terminalMarkers[i].remove();
                }
              } else {
                // Delete all origin markers from the map
                for (var i = terminalMarkers.length - 1; i >= 0; i--) {
                  terminalMarkers[i].remove();
                }
              }
            }          
      }
    }

    // Function places markers on the map and controls them
    function controlMarkers() {
      // Make request to DB for origin airports
      fetch('/application/origins').then(origin_res => origin_res.json()).then(origin_data => {
        // Reset selected dates in trip summary
      let selectedFlight = {date: '...', price: '...'}
      window.processOutward(selectedFlight);
      window.processReturn(selectedFlight);

        // BEGIN PRIMARY LOOP - through origin airports
        for (let key in origin_data){
          // Create markers
          const origin_marker = create_marker(map, "standard-marker", key, origin_data[key]['place_name'], origin_data[key]['lng'], origin_data[key]['lat'], 'null')
          originMarkers.push(origin_marker);

          // Add EventListener for each origin marker being clicked
          origin_marker.getElement().addEventListener('click', function onClick(event) {
            // Ensures map click listener is not triggered
            event.stopPropagation();

            // Update outward calendar and trip summary box with name of origin (first by passing to app and then through navbar to TripSummary)
            const originAirport =  origin_data[key]['place_name'] + '\n' + '(' + key + ')'
            mapToApp({origin_name: originAirport,
              outward_name: '...',
              cheapest_outward_flight: {date: "...", price: '...'},
              all_outward_prices: {},
              cheapest_return_flight: {date: "...", price: '...'},
              all_return_prices: {},
              return_name: '...',
              terminal_name: "..."
            });

            // Clear all markers apart from the currently selected marker
            clearMarkers('originMarker', true, origin_marker);
            clearMarkers('outwardMarker', false, null);
            clearMarkers('returnMarker', false, null);
            clearMarkers('terminalMarker', false, null);

            // Change colour of return marker to red
            origin_marker.getElement().setAttribute('id', 'selected-marker');

            // Request outward airports from DB
            // TODO - add retrieving cheapest price for each marker to the request
            fetch('/application/outwards/' + key).then(outward_res => outward_res.json()).then(outward_data => {
              // BEGIN SECONDARY LOOP - through response and add markers
              for (let outward_key in outward_data){
                // Create outward markers
                const outward_marker = create_marker(map, "standard-marker", outward_key, outward_data[outward_key]['place_name'], outward_data[outward_key]['lng'], outward_data[outward_key]['lat'], outward_data[outward_key]['cheapest_price'])
                outwardMarkers.push(outward_marker);

                // Add EventListener for outward marker being clicked
                outward_marker.getElement().addEventListener('click', function onClick(event) {
                  // Ensures map click listener is not triggered
                  event.stopPropagation();

                  // Variables to be passed to trip summary box
                  const outwardAirport =  outward_data[outward_key]['place_name'] + '\n' + '(' + outward_key + ')'
                  let outwardDate = '...'
                  let outwardPrice = '...'
                  let allOutwardPrices = {}

                  // Retrieve date and price of cheapest outward flight
                  fetch('/application/get_prices/' + key +'/' + outward_key + '/null/null/null').then(outwardPrices_res => outwardPrices_res.json()).then(outwardPrice_data => {
                    outwardDate = outwardPrice_data['cheapest_flight']['date']
                    outwardPrice = outwardPrice_data['cheapest_flight']['price']
                    allOutwardPrices = outwardPrice_data['all_prices']

                    // Update trip summary box 
                    mapToApp({origin_name: originAirport,
                      outward_name: outwardAirport,
                      cheapest_outward_flight: {date: outwardDate, price: outwardPrice},
                      all_outward_prices: allOutwardPrices,
                      cheapest_return_flight: {date: "...", price: '...'},
                      all_return_prices: {},
                      return_name: '...',
                      terminal_name: '...'
                    });

                    // Send cheapest outward date and price directly to trip summary to intialise
                    let selectedFlight = {date: outwardDate, price: outwardPrice}
                    window.processOutward(selectedFlight);
                  
                    // clear other outward markers on map
                    clearMarkers('outwardMarker', true, outward_marker);

                    // Remove price from popup text
                    outward_marker.getPopup().setText(outwardAirport);

                    // Change colour of outward marker to red
                    outward_marker.getElement().setAttribute('id', 'selected-marker');

                    // Request airports with routes back to England from DB
                    fetch('/application/return/' + outward_key + '/' + outwardDate).then(return_res => return_res.json()).then(return_data => {

                      // BEGIN TERTIARY LOOP - add markers
                      for (let return_key in return_data){
                        // Create markers
                        // TODO - add price of cheapest flight back to England to marker
                        const return_marker = create_marker(map, "standard-marker", return_key, return_data[return_key]['place_name'], return_data[return_key]['lng'], return_data[return_key]['lat'], return_data[return_key]['cheapest_price'])
                        returnMarkers.push(return_marker);
                        
                        // Add EventListener for return marker being clicked
                        return_marker.getElement().addEventListener('click', function onClick(event) {
                          // Ensures map click listener is not triggered
                          event.stopPropagation();

                          // Populate calendars and trip summary
                          const returnAirport =  return_data[return_key]['place_name'] + '\n' + '(' + return_key + ')'
                          mapToApp({origin_name: originAirport,
                            outward_name: outwardAirport,
                            cheapest_outward_flight: {date: outwardDate, price: outwardPrice},
                            all_outward_prices: allOutwardPrices,
                            cheapest_return_flight: {date: "...", price: '...'},
                            all_return_prices: {},
                            return_name: returnAirport,
                            terminal_name: '...'
                          });

                          // clear return markers from map
                          clearMarkers('returnMarker', true, return_marker);

                          // Remove price from popup text
                          return_marker.getPopup().setText(returnAirport);

                          // Change colour of return marker to red
                          return_marker.getElement().setAttribute('id', 'selected-marker');

                          // Request airports in England reachable from the selected return airport
                          // TODO - change colour of markers with no direct route to origin airport to green (low priority)
                          fetch('/application/outwards/' + return_key).then(terminal_res => terminal_res.json()).then(terminal_data => {
                            // BEGIN QUARTERNARY LOOP through terminal airports
                            for (let terminal_key in terminal_data){
                              // TODO - add cheapest flight price to each terminal marker popup

                              // Create terminal markers
                              const terminal_marker = create_marker(map, "standard-marker", terminal_key, terminal_data[terminal_key]['place_name'], terminal_data[terminal_key]['lng'], terminal_data[terminal_key]['lat'], terminal_data[terminal_key]['cheapest_price'])
                              terminalMarkers.push(terminal_marker);
    
                              // Add event listener for terminal marker clicked
                              terminal_marker.getElement().addEventListener('click', function onClick(event) {
                                // Ensure map click listener not triggered
                                event.stopPropagation();

                                // Variables to be passed to trip summary box
                                const terminalAirport =  terminal_data[terminal_key]['place_name'] + '\n' + '(' + terminal_key + ')'
                                let returnDate = '...'
                                let returnPrice = '...'
                                let allReturnPrices = {}

                                // Retrieve date and price of cheapest return flight after the cutoff date
                                // TODO - if user selected date exists, pass this as cutoff date instead
                                fetch('/application/get_prices/' + return_key +'/' + terminal_key + '/' + outwardDate).then(returnPrices_res => returnPrices_res.json()).then(returnPrice_data => {
                                  returnDate = returnPrice_data['cheapest_flight']['date']
                                  returnPrice = returnPrice_data['cheapest_flight']['price']
                                  allReturnPrices = returnPrice_data['all_prices']
              
                                  // Populate calendars and update trip summary box
                                  mapToApp({origin_name: originAirport,
                                    outward_name: outwardAirport,
                                    cheapest_outward_flight: {date: outwardDate, price: outwardPrice},
                                    all_outward_prices: allOutwardPrices,
                                    cheapest_return_flight: {date: returnDate, price: returnPrice},
                                    all_return_prices: allReturnPrices,
                                    return_name: returnAirport,
                                    terminal_name: terminalAirport
                                  });

                                  // Send cheapest outward date and price directly to trip summary to intialise
                                  let selectedFlight = {date: returnDate, price: returnPrice}
                                  window.processReturn(selectedFlight);

                                  // Clear unselected terminal airports from map
                                  clearMarkers('terminalMarker', true, terminal_marker);

                                  // Remove price from popup text
                                  terminal_marker.getPopup().setText(terminalAirport);
  
                                  // Change colour of terminal marker to red
                                  terminal_marker.getElement().setAttribute('id', 'selected-marker');
                                });
                              });
                            }
                          });
                        });
                      }
                    });
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
    var terminalMarkers = [];

    // Add listener to reset when clicking on map
      map.current.on('click', (e) => {
        // Clear all markers from map
        clearMarkers('originMarker', false, null);
        clearMarkers('outwardMarker', false, null);
        clearMarkers('returnMarker', false, null);

        // Revert map markers to initial state
        controlMarkers();

        // Send data to clear trip summary box and calendar
        mapToApp({origin_name: '...',
        outward_name: '...',
        cheapest_outward_flight: {date: "...", price: '...'},
        all_outward_prices: {},
        cheapest_return_flight: {date: "...", price: '...'},
        all_return_prices: {},
        return_name: '...',
        terminal_name: '...'});

        // Reset selected date in trip summary
        let selectedFlight = {date: '...', price: '...'}
        window.processOutward(selectedFlight);
        window.processReturn(selectedFlight);

        // Reset selected date in local storage
        window.localStorage.setItem('selected-day', null);
        window.localStorage.setItem('selected-month', null);
        window.localStorage.setItem('selected-year', null);

        });

    // Add zoom controls to map
    map.current.addControl(new maplibregl.NavigationControl(), 'top-left');

    // Initialise map markers
    controlMarkers();

  });
  
  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}