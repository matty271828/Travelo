import React from "react";
import './TripSummary.css';

export default function TripSummary ({navbarToTripSummary}){

    console.log(navbarToTripSummary);

    return (
        <table height='25%' border='0px'>
            <tr height='25%'>
                <th width='10%'>Trip Summary</th>
                <td width='5%'></td>
                <td width='3%'></td>
                <td width='22%'></td>
                <td width='3%'></td>
                <td width='22%'></td>
                <td width='3%'></td>
                <td width='10%'></td>
            </tr>
                <tr height='25%'>
                    <th>Outward: </th>
                    <td className='align-center'>20/06/2022</td>
                    <td className='align-center'>-</td>
                    <td className='align-center'>{navbarToTripSummary.origin_name}</td>
                    <td className='align-center'>-</td>
                    <td className='align-center'>{navbarToTripSummary.outward_name}</td>
                    <td className='align-center'>-</td>
                    <td>£25</td>
                </tr>

                <tr height='25%'>
                    <th>Return: </th>
                    <td className='align-center'>25/06/2022</td>
                    <td className='align-center'>-</td>
                    <td className='align-center'>{navbarToTripSummary.return_name}</td>
                    <td className='align-center'>-</td>
                    <td className='align-center'>{navbarToTripSummary.origin_name}</td>
                    <td className='align-center'>-</td>
                    <td>£20</td>
                </tr>

                <tr>
                    <th></th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <th className='align-right'>Total</th>
                    <td className='align-center'>-</td>
                    <td>£45</td>
                </tr>
            </table>
    );
}