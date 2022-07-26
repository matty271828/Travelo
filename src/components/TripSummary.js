import React, { useEffect, useState } from "react";
import './TripSummary.css';

export default function TripSummary ({navbarToTripSummary}){
    console.log(navbarToTripSummary);

    let cheapestOutwardDate = navbarToTripSummary.cheapest_outward_flight.date;
    const [selectedDate, setSelectedDate] = useState(cheapestOutwardDate);

    // Calculate total cost
    if (navbarToTripSummary.cheapest_return_flight.price != '...') {
        var totalPrice = parseInt(navbarToTripSummary.cheapest_outward_flight.price) + parseInt(navbarToTripSummary.cheapest_return_flight.price)
    } else {
        var totalPrice = '...'
    }


    window.processData = function(data) {
        // do something with your data like
        console.log("MainComponent received data:", data);
        setSelectedDate(data);
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
                    <td className='align-center'>{selectedDate}</td>
                    <td className='align-center'>-</td>
                    <td className='align-center'>{navbarToTripSummary.origin_name}</td>
                    <td className='align-center'>-</td>
                    <td className='align-center'>{navbarToTripSummary.outward_name}</td>
                    <td className='align-center'>-</td>
                    <td>£{navbarToTripSummary.cheapest_outward_flight.price}</td>
                </tr>

                <tr height='25%'>
                    <th>Return: </th>
                    <td className='align-center'>{navbarToTripSummary.cheapest_return_flight.date}</td>
                    <td className='align-center'>-</td>
                    <td className='align-center'>{navbarToTripSummary.return_name}</td>
                    <td className='align-center'>-</td>
                    <td className='align-center'>{navbarToTripSummary.terminal_name}</td>
                    <td className='align-center'>-</td>
                    <td>£{navbarToTripSummary.cheapest_return_flight.price}</td>
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