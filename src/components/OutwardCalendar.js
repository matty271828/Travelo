import React from "react";
import './OutwardCalendar.css';

export default function OutwardCalendar ({navbarToOutwardCalendar}){
    // Datafields for use in scrolling calendar
    let currentMonth;
    let currentYear;

    // Datafields for use in selecting a flight
    let selectedDay;
    let selectedMonth;
    let selectedYear;
    let selectedCell;

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

    // Instantiate calendar
    for (let i = 1; i <= 31; i++) {
        // Fill prices
        cell[i] = '-';

        // Ensure no highlighting from previous selection remains
        let cellid = 'cell' + i.toString();
        if (document.getElementById(cellid) != null){
            document.getElementById(cellid).className = 'calendar-align-center'
        }
        
    }
    
    // Function for filling calendar with dates
    // Month should be passed as an integer value, year as a string
    function fillCalendar(month, year){
        // Fill all cells and pass correct date to each one
        for (let i = 1; i <= 31; i++) {
            // Collect parameters
            let price = navbarToOutwardCalendar.all_outward_prices[year][month][i.toString()];
            let cellid = 'cell' + i.toString();

            // Prepare cell content
            if (typeof price == 'string'){
                cell[i] = '£' + price;
            } else { 
                cell[i] = '-'
            }

            // Fill cell
            document.getElementById(cellid).textContent = cell[i];
            document.getElementById(cellid).classList.remove('calendar-selected');
            document.getElementById(cellid).classList.add('calendar-align-center');

            // TODO - highlight currently selected day/month if it appears on screen
            if (i == parseInt(selectedDay) && month == selectedMonth && year == selectedYear) {
                document.getElementById(cellid).classList.remove('calendar-align-center');
                document.getElementById(cellid).classList.add('calendar-selected');
            }
        }
    }

    // Cheapest outward flight selected
    if (navbarToOutwardCalendar.outward_name != '...') {
        // Enter month and year into calendar
        dateArray = navbarToOutwardCalendar.cheapest_outward_flight.date.split('/');

        // For use in highlighting and passing selection
        selectedDay = dateArray[0];
        selectedMonth = parseInt(dateArray[1])
        selectedYear = dateArray[2];

        // For use in scrolling calendar
        currentMonth = parseInt(dateArray[1]);
        currentYear = dateArray[2];
        calendarPage = months[currentMonth] + ' ' + currentYear;
    
        // Fill all cells and pass correct date to each one
        fillCalendar(currentMonth, currentYear);

        // Highlight cheapest flight in calendar
        let cellid = 'cell' + selectedDay;
        selectedCell = document.getElementById(cellid)
        selectedCell.classList.remove('calendar-align-center');
        selectedCell.classList.add('calendar-selected');
    } 

    // Function to operate calendar after chevron click
    const chevronClick = (direction) => {
        // Run only if outward flight present
        if (navbarToOutwardCalendar.outward_name != '...') {
            // switch statement to read direction
            switch (direction) {
                case 'left':
                    // Prevent scroll past July 2022
                    // TODO - update this to determine actual current month and year
                    if (currentMonth == 7 && currentYear == '2022'){
                        break;
                    }
                    // Current month is january
                    if (currentMonth == 1) {
                        currentMonth = 12
                        currentYear = (parseInt(currentYear) - 1).toString();
                        document.getElementById("calendarPage").textContent = months[currentMonth] + ' ' + currentYear;
                    } else {
                        currentMonth = currentMonth - 1;
                        document.getElementById("calendarPage").textContent = months[currentMonth] + ' ' + currentYear;
                    }
                    // Call function filling calendar with new month
                    fillCalendar(currentMonth, currentYear);

                    break;

                case 'right':
                    // Prevent scroll past May 2023
                    // TODO - update this to determine actual current month + 12 and year + 1
                    if (currentMonth == 5 && currentYear == '2023'){
                        break;
                    }
                    // Current month is december
                    if (currentMonth == 12) {
                        currentMonth = 1
                        currentYear = (parseInt(currentYear) + 1).toString();
                        document.getElementById("calendarPage").textContent = months[currentMonth] + ' ' + currentYear;
                    } else {
                        currentMonth = currentMonth + 1;
                        document.getElementById("calendarPage").textContent = months[currentMonth] + ' ' + currentYear;
                    }

                    // Call function filling calendar with new month
                    fillCalendar(currentMonth, currentYear);
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
                <td class='calendar-align-center' id='cell1'>{cell[1]}</td>
                <td class='calendar-align-center' id='cell2'>{cell[2]}</td>
                <td class='calendar-align-center' id='cell3'>{cell[3]}</td>
                <td class='calendar-align-center' id='cell4'>{cell[4]}</td>
                <td class='calendar-align-center' id='cell5'>{cell[5]}</td>
                <td class='calendar-align-center' id='cell6'>{cell[6]}</td>
                <td class='calendar-align-center' id='cell7'>{cell[7]}</td>
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
                <td class='calendar-align-center' id='cell8'>{cell[8]}</td>
                <td class='calendar-align-center' id='cell9'>{cell[9]}</td>
                <td class='calendar-align-center' id='cell10'>{cell[10]}</td>
                <td class='calendar-align-center' id='cell11'>{cell[11]}</td>
                <td class='calendar-align-center' id='cell12'>{cell[12]}</td>
                <td class='calendar-align-center' id='cell13'>{cell[13]}</td>
                <td class='calendar-align-center' id='cell14'>{cell[14]}</td>
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
                <td class='calendar-align-center' id='cell15'>{cell[15]}</td>
                <td class='calendar-align-center' id='cell16'>{cell[16]}</td>
                <td class='calendar-align-center' id='cell17'>{cell[17]}</td>
                <td class='calendar-align-center' id='cell18'>{cell[18]}</td>
                <td class='calendar-align-center' id='cell19'>{cell[19]}</td>
                <td class='calendar-align-center' id='cell20'>{cell[20]}</td>
                <td class='calendar-align-center' id='cell21'>{cell[21]}</td>
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
                <td class='calendar-align-center' id='cell22'>{cell[22]}</td>
                <td class='calendar-align-center' id='cell23'>{cell[23]}</td>
                <td class='calendar-align-center' id='cell24'>{cell[24]}</td>
                <td class='calendar-align-center' id='cell25'>{cell[25]}</td>
                <td class='calendar-align-center' id='cell26'>{cell[26]}</td>
                <td class='calendar-align-center' id='cell27'>{cell[27]}</td>
                <td class='calendar-align-center' id='cell28'>{cell[28]}</td>
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
                <td class='calendar-align-center' id='cell29'>{cell[29]}</td>
                <td class='calendar-align-center' id='cell30'>{cell[30]}</td>
                <td class='calendar-align-center' id='cell31'>{cell[31]}</td>
                <td class='calendar-align-center'></td>
                <td class='calendar-align-center'></td>
                <td class='calendar-align-center'></td>
                <td class='calendar-align-center'></td>
            </tr>  
        </table>
    </div>
    );
}