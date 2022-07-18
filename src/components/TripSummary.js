import React from "react";
import './TripSummary.css';

export default function TripSummary ({navbarToTripSummary}){
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
                    <td class='align-center'>{navbarToTripSummary}</td>
                    <td> - </td>
                    <td class='align-center'>Berlin (BER)</td>
                    <td> - </td>
                    <td>£25</td>
                </tr>

                <tr>
                    <th>Return: </th>
                    <td>25/06/2022</td>
                    <td> - </td>
                    <td class='align-center'>Prague (PRG)</td>
                    <td> - </td>
                    <td class='align-center'>Manchester (MAN)</td>
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
                    <th class='align-right'>Total</th>
                    <td> - </td>
                    <td>£45</td>
                </tr>
            </table>
    );
}