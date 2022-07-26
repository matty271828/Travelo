import React from "react";
import './TripSummary.css';

export default function TripSummary ({returnCalendarToTripSummary}){
    console.log(returnCalendarToTripSummary);
    // Calculate total cost
    if (returnCalendarToTripSummary.cheapest_return_flight.price != '...') {
        var totalPrice = parseInt(returnCalendarToTripSummary.cheapest_outward_flight.price) + parseInt(returnCalendarToTripSummary.cheapest_return_flight.price)
    } else {
        var totalPrice = '...'
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
                    <td className='align-center'>{returnCalendarToTripSummary.cheapest_outward_flight.date}</td>
                    <td className='align-center'>-</td>
                    <td className='align-center'>{returnCalendarToTripSummary.origin_name}</td>
                    <td className='align-center'>-</td>
                    <td className='align-center'>{returnCalendarToTripSummary.outward_name}</td>
                    <td className='align-center'>-</td>
                    <td>£{returnCalendarToTripSummary.cheapest_outward_flight.price}</td>
                </tr>

                <tr height='25%'>
                    <th>Return: </th>
                    <td className='align-center'>{returnCalendarToTripSummary.cheapest_return_flight.date}</td>
                    <td className='align-center'>-</td>
                    <td className='align-center'>{returnCalendarToTripSummary.return_name}</td>
                    <td className='align-center'>-</td>
                    <td className='align-center'>{returnCalendarToTripSummary.terminal_name}</td>
                    <td className='align-center'>-</td>
                    <td>£{returnCalendarToTripSummary.cheapest_return_flight.price}</td>
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