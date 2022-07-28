import React, { useEffect, useState } from "react";
import './TripSummary.css';

export default function TripSummary ({navbarToTripSummary}){
    console.log(navbarToTripSummary);

    let cheapestOutwardFlight = navbarToTripSummary.cheapest_outward_flight;
    const [selectedOutwardFlight, setSelectedOutwardFlight] = useState({date: cheapestOutwardFlight.date, price: cheapestOutwardFlight.date});

    let cheapestReturnFlight = navbarToTripSummary.cheapest_return_flight;
    const [selectedReturnFlight, setSelectedReturnFlight] = useState({date: cheapestReturnFlight.date, price: cheapestReturnFlight.price});

    console.log(cheapestReturnFlight);
    console.log('Return flight initial date is ' + selectedReturnFlight.date)

    // Calculate total cost
    if (navbarToTripSummary.cheapest_return_flight.price != '...') {
        var totalPrice = parseInt(selectedOutwardFlight.price) + parseInt(selectedReturnFlight.price)
    } else {
        var totalPrice = '...'
    }

    window.processOutward = function(data) {
        // Update state of outward flight with date and price sent by calendar click
        console.log("TripSummary received outward choice:", data);
        setSelectedOutwardFlight(data);
    }

    window.processReturn = function(data) {
        // Update state of outward flight with date and price sent by calendar click
        console.log("TripSummary received return choice:", data);
        setSelectedReturnFlight(data);
    }

    return (
        <table height='25%' border='0px'>
            <tr height='25%'>
                <th width='10%'>Trip Summary</th>
                <td width='22%'></td>
                <td width='3%'></td>
                <td width='22%'></td>
                <td width='3%'></td>
                <td width='22%'></td>
                <td width='3%'></td>
                <td width='10%'></td>
            </tr>
                <tr height='25%'>
                    <th>Outward: </th>
                    <td className='align-center'>{selectedOutwardFlight.date}</td>
                    <td className='align-center'>-</td>
                    <td className='align-center'>{navbarToTripSummary.origin_name}</td>
                    <td className='align-center'>-</td>
                    <td className='align-center'>{navbarToTripSummary.outward_name}</td>
                    <td className='align-center'>-</td>
                    <td>£{selectedOutwardFlight.price}</td>
                </tr>

                <tr height='25%'>
                    <th>Return: </th>
                    <td className='align-center'>{selectedReturnFlight.date}</td>
                    <td className='align-center'>-</td>
                    <td className='align-center'>{navbarToTripSummary.return_name}</td>
                    <td className='align-center'>-</td>
                    <td className='align-center'>{navbarToTripSummary.terminal_name}</td>
                    <td className='align-center'>-</td>
                    <td>£{selectedReturnFlight.price}</td>
                </tr>

                <tr>
                    <th></th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <th className='align-right'>Total</th>
                    <td className='align-center'>-</td>
                    <td>£{totalPrice}</td>
                </tr>
            </table>
    );
}