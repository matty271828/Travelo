import React from "react";
import './TripSummary.css';

export default function TripSummary (){
    return (
        <table>
            <tr>
                <th>Trip Summary:</th>
            </tr>
                <tr>
                    <th>Outward: </th>
                    <td>20/06/2022</td>
                    <td> - </td>
                    <td>Manchester (MAN)</td>
                    <td> - </td>
                    <td>Berlin (BER)</td>
                    <td> - </td>
                    <td>£25</td>
                </tr>

                <tr>
                    <th>Return: </th>
                    <td>25/06/2022</td>
                    <td> - </td>
                    <td>Prague (PRG)</td>
                    <td> - </td>
                    <td>Manchester (MAN)</td>
                    <td> - </td>
                    <td>£20</td>
                </tr>

                <tr>
                    <th>Overland distance: </th>
                    <td>175 miles</td>
                </tr>

                
            </table>
    );
}