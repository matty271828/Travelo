import React from "react";
import './OutwardCalendar.css';

export default function OutwardCalendar ({navbarToOutwardCalendar}){
    return (
        <div>
        <table class='calendar'>
            <tr class='top-line'>
                <th class='calendar'>Outward Journey: </th>
                <td class='calendar-align-right'></td>
                <td class='calendar-align-right'>{navbarToOutwardCalendar.origin_name}</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-left'>{navbarToOutwardCalendar.outward_name}</td>
            </tr>

            <tr class='top-line'>
                <th class='calendar-align-right'>&lt;</th>
                <td class='calendar-align-right'>September 2022</td>
                <td class='calendar-align-center'>&gt;</td>
                <td class='calendar-align-center'></td>
                <td class='calendar-align-left'></td>
            </tr>

        </table>

        <table class='calendar'>
            <tr>
                <td class='calendar-align-center'>1</td>
                <td class='calendar-align-center'>2</td>
                <td class='calendar-align-center'>3</td>
                <td class='calendar-align-center'>4</td>
                <td class='calendar-align-center'>5</td>
                <td class='calendar-align-center'>6</td>
                <td class='calendar-align-center'>7</td>
            </tr>

            <tr>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
            </tr>

            <tr>
                <td class='calendar-align-center'>8</td>
                <td class='calendar-align-center'>9</td>
                <td class='calendar-align-center'>10</td>
                <td class='calendar-align-center'>11</td>
                <td class='calendar-align-center'>12</td>
                <td class='calendar-align-center'>13</td>
                <td class='calendar-align-center'>14</td>
            </tr>

            <tr>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
            </tr>

            <tr>
                <td class='calendar-align-center'>15</td>
                <td class='calendar-align-center'>16</td>
                <td class='calendar-align-center'>17</td>
                <td class='calendar-align-center'>18</td>
                <td class='calendar-align-center'>19</td>
                <td class='calendar-align-center'>20</td>
                <td class='calendar-align-center'>21</td>
            </tr>

            <tr>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
            </tr>

            <tr>
                <td class='calendar-align-center'>22</td>
                <td class='calendar-align-center'>23</td>
                <td class='calendar-align-center'>24</td>
                <td class='calendar-align-center'>25</td>
                <td class='calendar-align-center'>26</td>
                <td class='calendar-align-center'>27</td>
                <td class='calendar-align-center'>28</td>
            </tr>

            <tr>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
            </tr>

            <tr>
                <td class='calendar-align-center'>29</td>
                <td class='calendar-align-center'>30</td>
                <td class='calendar-align-center'>31</td>
                <td class='calendar-align-center'></td>
                <td class='calendar-align-center'></td>
                <td class='calendar-align-center'></td>
                <td class='calendar-align-center'></td>
            </tr>

            <tr>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center'></td>
                <td class='calendar-align-center'></td>
                <td class='calendar-align-center'></td>
                <td class='calendar-align-center'></td>
            </tr>  
        </table>
    </div>
    );
}