import React from "react";
import './OutwardCalendar.css';

export default function OutwardCalendar ({navbarToOutwardCalendar}){
    // Datafields
    let currentMonth;
    let currentYear;

    // Get IATA codes from origin and outward names
    const originIATA = navbarToOutwardCalendar.origin_name.split("\n")[1];
    const outwardIATA = navbarToOutwardCalendar.outward_name.split("\n")[1];

    // Objects to convert date to text
    const months = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April', 
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December'
    }

    // Placeholder variables
    let calendarPage = '...'
    let dateArray = [];
    let cell = {};
    for (let i = 1; i <= 31; i++) {
        cell[i] = '-';
    }
    
    // Function for filling calendar with dates
    // Month should be passed as an integer value, year as a string
    function fillCalendar(month, year){
        // Fill all cells and pass correct date to each one
        for (let i = 1; i <= 31; i++) {
            let price = navbarToOutwardCalendar.all_outward_prices[year][month][i.toString()];
            if (typeof price == 'string'){
                cell[i] = '£' + price;
            }
        }
    }

    // Outward flight selected
    if (navbarToOutwardCalendar.outward_name != '...') {
        // Enter month and year into calendar
        dateArray = navbarToOutwardCalendar.cheapest_outward_flight.date.split('/');
        currentMonth = parseInt(dateArray[1]);
        currentYear = dateArray[2];
        calendarPage = months[currentMonth] + ' ' + currentYear;
    
        // Fill all cells and pass correct date to each one
        fillCalendar(currentMonth, currentYear);
    };

    // Function to operate calendar after chevron click
    const chevronClick = (direction) => {
        // Run only if outward flight present
        if (navbarToOutwardCalendar.outward_name != '...') {
            // switch statement to read direction
            switch (direction) {
                case 'left':
                    // Current month is january
                    if (currentMonth == 1) {
                        currentMonth = 12
                        currentYear = (parseInt(currentYear) - 1).toString();
                        document.getElementById("calendarPage").textContent = months[currentMonth] + ' ' + currentYear;
                    } else {
                        currentMonth = currentMonth - 1;
                        document.getElementById("calendarPage").textContent = months[currentMonth] + ' ' + currentYear;
                    }
                    // TODO - call function filling calendar with new month

                    break;

                case 'right':
                    // Current month is december
                    if (currentMonth == 12) {
                        currentMonth = 1
                        currentYear = (parseInt(currentYear) + 1).toString();
                        document.getElementById("calendarPage").textContent = months[currentMonth] + ' ' + currentYear;
                    } else {
                        currentMonth = currentMonth + 1;
                        document.getElementById("calendarPage").textContent = months[currentMonth] + ' ' + currentYear;
                    }

                    // TODO - call function filling calendar with new month

                    break;
            }
        }
    } 
    
    return (
        <div>
        <table class='calendar' border='0px solid' height='50vh'>
            <tr class='top-line'>
                <th class='calendar' width='15%'>Outward:</th>
                <td class='calendar-align-right'></td>
                <td class='calendar-align-right' width='25%'></td>
                <td class='calendar-align-right'></td>
                <td class='calendar-align-center' width='25%'>{originIATA}</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center' width='25%'>{outwardIATA}</td>
            </tr>

            <tr class='top-line'>
                <td class='calendar-align-right'></td>
                <td class='chevron' onClick={() => chevronClick('left')}>&lt;</td>
                <td class='calendar-align-center' id="calendarPage">{calendarPage}</td>
                <td class='chevron' onClick={() => chevronClick('right')}>&gt;</td>
                <td class='calendar-align-right'></td>
                <td class='calendar-align-center'></td>
                <td class='calendar-align-left'></td>
            </tr>

        </table>

        <table class='calendar' border = '0px solid'>
            <tr>
                <td class='calendar-date' width='10%'>1</td>
                <td class='calendar-date' width='10%'>2</td>
                <td class='calendar-date' width='10%'>3</td>
                <td class='calendar-date' width='10%'>4</td>
                <td class='calendar-date' width='10%'>5</td>
                <td class='calendar-date' width='10%'>6</td>
                <td class='calendar-date' width='10%'>7</td>
            </tr>

            <tr>
                <td class='calendar-align-center'>{cell[1]}</td>
                <td class='calendar-align-center'>{cell[2]}</td>
                <td class='calendar-align-center'>{cell[3]}</td>
                <td class='calendar-align-center'>{cell[4]}</td>
                <td class='calendar-align-center'>{cell[5]}</td>
                <td class='calendar-align-center'>{cell[6]}</td>
                <td class='calendar-align-center'>{cell[7]}</td>
            </tr>

            <tr>
                <td class='calendar-date'>8</td>
                <td class='calendar-date'>9</td>
                <td class='calendar-date'>10</td>
                <td class='calendar-date'>11</td>
                <td class='calendar-date'>12</td>
                <td class='calendar-date'>13</td>
                <td class='calendar-date'>14</td>
            </tr>

            <tr>
                <td class='calendar-align-center'>{cell[8]}</td>
                <td class='calendar-align-center'>{cell[9]}</td>
                <td class='calendar-align-center'>{cell[10]}</td>
                <td class='calendar-align-center'>{cell[11]}</td>
                <td class='calendar-align-center'>{cell[12]}</td>
                <td class='calendar-align-center'>{cell[13]}</td>
                <td class='calendar-align-center'>{cell[14]}</td>
            </tr>

            <tr>
                <td class='calendar-date'>15</td>
                <td class='calendar-date'>16</td>
                <td class='calendar-date'>17</td>
                <td class='calendar-date'>18</td>
                <td class='calendar-date'>19</td>
                <td class='calendar-date'>20</td>
                <td class='calendar-date'>21</td>
            </tr>

            <tr>
                <td class='calendar-align-center'>{cell[15]}</td>
                <td class='calendar-align-center'>{cell[16]}</td>
                <td class='calendar-align-center'>{cell[17]}</td>
                <td class='calendar-align-center'>{cell[18]}</td>
                <td class='calendar-align-center'>{cell[19]}</td>
                <td class='calendar-align-center'>{cell[20]}</td>
                <td class='calendar-align-center'>{cell[21]}</td>
            </tr>

            <tr>
                <td class='calendar-date'>22</td>
                <td class='calendar-date'>23</td>
                <td class='calendar-date'>24</td>
                <td class='calendar-date'>25</td>
                <td class='calendar-date'>26</td>
                <td class='calendar-date'>27</td>
                <td class='calendar-date'>28</td>
            </tr>

            <tr>
                <td class='calendar-align-center'>{cell[22]}</td>
                <td class='calendar-align-center'>{cell[23]}</td>
                <td class='calendar-align-center'>{cell[24]}</td>
                <td class='calendar-align-center'>{cell[25]}</td>
                <td class='calendar-align-center'>{cell[26]}</td>
                <td class='calendar-align-center'>{cell[27]}</td>
                <td class='calendar-align-center'>{cell[28]}</td>
            </tr>

            <tr>
                <td class='calendar-date'>29</td>
                <td class='calendar-date'>30</td>
                <td class='calendar-date'>31</td>
                <td class='calendar-date'></td>
                <td class='calendar-date'></td>
                <td class='calendar-date'></td>
                <td class='calendar-date'></td>
            </tr>

            <tr>
                <td class='calendar-align-center'>{cell[29]}</td>
                <td class='calendar-align-center'>{cell[30]}</td>
                <td class='calendar-align-center'>{cell[31]}</td>
                <td class='calendar-align-center'></td>
                <td class='calendar-align-center'></td>
                <td class='calendar-align-center'></td>
                <td class='calendar-align-center'></td>
            </tr>  
        </table>
    </div>
    );
}