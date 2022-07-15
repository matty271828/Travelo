import React from "react";

export default function TripSummary (){
    return (
        <table>
            <tr>
                <th>Trip Summary:</th>
            </tr>
                <tr>
                    <th>Outward: </th>
                    <th>20/06/2022</th>
                    <th> - </th>
                    <th>Manchester (MAN)</th>
                    <th> - </th>
                    <th>Berlin (BER)</th>
                    <th> - </th>
                    <th>£25</th>
                </tr>

                <tr>
                    <th>Return: </th>
                    <th>25/06/2022</th>
                    <th> - </th>
                    <th>Prague (PRG)</th>
                    <th> - </th>
                    <th>Manchester (MAN)</th>
                    <th> - </th>
                    <th>£20</th>
                </tr>

                <tr>
                    <th>Overland distance: </th>
                    <th>175 miles</th>
                </tr>

                <tr>
                    <th>Go to booking</th>
                </tr>
            </table>
    );
}