import React from "react";
import './TripSummary.css';

export default function TripSummary ({navbarToTripSummary}){

    console.log(navbarToTripSummary);

    return (
        <table>
            <tr>
                <th>Trip Summary</th>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
                <tr>
                    <th>Outward: </th>
                    <td>20/06/2022</td>
                    <td> - </td>
                    <td className='align-center'>{navbarToTripSummary.origin_name}</td>
                    <td> - </td>
                    <td className='align-center'>{navbarToTripSummary.outward_name}</td>
                    <td> - </td>
                    <td>£25</td>
                </tr>

                <tr>
                    <th>Return: </th>
                    <td>25/06/2022</td>
                    <td> - </td>
                    <td className='align-center'>{navbarToTripSummary.return_name}</td>
                    <td> - </td>
                    <td className='align-center'>{navbarToTripSummary.origin_name}</td>
                    <td> - </td>
                    <td>£20</td>
                </tr>

                <tr>
                    <th>Overland distance: </th>
                    <td>175 miles</td>
                </tr>

                <tr>
                    <th></th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <th className='align-right'>Total</th>
                    <td> - </td>
                    <td>£45</td>
                </tr>
            </table>
    );
}