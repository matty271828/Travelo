import React from "react";
import './ReturnCalendar.css';

export default function OutwardCalendar ({navbarToReturnCalendar}){
    // Datafields for use in scrolling calendar
    let currentMonth;
    let currentYear;

    // Datafields for use in selecting a flight
    let selectedDay;
    let selectedMonth;
    let selectedYear;
    let selectedCell;

    // Get IATA codes from origin and outward names
    const returnIATA = navbarToReturnCalendar.return_name.split("\n")[1];
    const terminalIATA = navbarToReturnCalendar.terminal_name.split("\n")[1];

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
        let cellid = 'returnCell' + i.toString();
        if (document.getElementById(cellid) != null){
            document.getElementById(cellid).className = 'calendar-return-price'
        }
        
    }
    
    // Function for filling calendar with dates
    // Month should be passed as an integer value, year as a string
    function fillCalendar(month, year){
        // Fill all cells and pass correct date to each one
        for (let i = 1; i <= 31; i++) {
            // Collect parameters
            let price = navbarToReturnCalendar.all_outward_prices[year][month][i.toString()];
            let cellid = 'returnCell' + i.toString();

            // Prepare cell content
            if (typeof price == 'string'){
                cell[i] = '£' + price;
            } else { 
                cell[i] = ' - '
            }

            // Fill cell
            document.getElementById(cellid).textContent = cell[i];
            document.getElementById(cellid).classList.remove('calendar-return-selected');
            document.getElementById(cellid).classList.add('calendar-return-price');

            // highlight currently selected day/month if it appears on screen
            if (i == parseInt(selectedDay) && month == selectedMonth && year == selectedYear) {
                document.getElementById(cellid).classList.remove('calendar-return-price');
                document.getElementById(cellid).classList.add('calendar-return-selected');
            }
        }
    }

    // Cheapest outward flight selected
    if (navbarToReturnCalendar.outward_name != '...') {
        // Enter month and year into calendar
        dateArray = navbarToReturnCalendar.cheapest_outward_flight.date.split('/');

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
        let cellid = 'returnCell' + selectedDay;
        selectedCell = document.getElementById(cellid)
        selectedCell.classList.remove('calendar-return-price');
        selectedCell.classList.add('calendar-return-selected');
    } 

    // Function to operate calendar after chevron click
    const chevronClick = (direction) => {
        // Run only if outward flight present
        if (navbarToReturnCalendar.outward_name != '...') {
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
                        document.getElementById("returnCalendarPage").textContent = months[currentMonth] + ' ' + currentYear;
                    } else {
                        currentMonth = currentMonth - 1;
                        document.getElementById("returnCalendarPage").textContent = months[currentMonth] + ' ' + currentYear;
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
                        document.getElementById("returnCalendarPage").textContent = months[currentMonth] + ' ' + currentYear;
                    } else {
                        currentMonth = currentMonth + 1;
                        document.getElementById("returnCalendarPage").textContent = months[currentMonth] + ' ' + currentYear;
                    }

                    // Call function filling calendar with new month
                    fillCalendar(currentMonth, currentYear);
                    break;
            }
        }
    } 

    // Function to update selected date and pass information to trip summary
    const selectPrice = (day) => {
        // Run only if outward flight present
        if (navbarToReturnCalendar.outward_name != '...') {
            // Determine cellid
            let clickedCellid = 'returnCell' + day;

            // Check a price is present in desired cell
            if (document.getElementById(clickedCellid).textContent != '-') {
                // Update date
                selectedDay = day;
                selectedMonth = currentMonth;
                selectedYear = currentYear;
    
                // Update class of previously selected cell
                selectedCell.classList.remove('calendar-return-selected');
                selectedCell.classList.add('calendar-return-price');
    
                // Update class of newly selected cell
                selectedCell = document.getElementById(clickedCellid)
                selectedCell.classList.remove('calendar-return-price');
                selectedCell.classList.add('calendar-return-selected');
    
                // TODO - pass new selected flight information to trip summary
                let price = navbarToReturnCalendar.all_outward_prices[selectedYear][selectedMonth][selectedDay];
                let selectedFlight = {date: selectedDay + '/' + selectedMonth + '/' + selectedYear, price: price}
                //window.processOutward(selectedFlight);
            }
        }
    }
    
    return (
        <div>
        <table class='calendar' border='0px solid' height='50vh'>
            <tr class='top-line'>
                <th class='calendar' width='15%'>Return:</th>
                <td class='calendar-align-right'></td>
                <td class='calendar-align-right' width='25%'></td>
                <td class='calendar-align-right'></td>
                <td class='calendar-align-center' width='25%'>{returnIATA}</td>
                <td class='calendar-align-center'>-</td>
                <td class='calendar-align-center' width='25%'>{terminalIATA}</td>
            </tr>

            <tr class='top-line'>
                <td class='calendar-align-right'></td>
                <td class='chevron' onClick={() => chevronClick('left')}>&lt;</td>
                <td class='calendar-align-center' id="returnCalendarPage">{calendarPage}</td>
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
                <td class='calendar-return-price' id='returnCell1' onClick={() => selectPrice('1')}>{cell[1]}</td>
                <td class='calendar-return-price' id='returnCell2' onClick={() => selectPrice('2')}>{cell[2]}</td>
                <td class='calendar-return-price' id='returnCell3' onClick={() => selectPrice('3')}>{cell[3]}</td>
                <td class='calendar-return-price' id='returnCell4' onClick={() => selectPrice('4')}>{cell[4]}</td>
                <td class='calendar-return-price' id='returnCell5' onClick={() => selectPrice('5')}>{cell[5]}</td>
                <td class='calendar-return-price' id='returnCell6' onClick={() => selectPrice('6')}>{cell[6]}</td>
                <td class='calendar-return-price' id='returnCell7' onClick={() => selectPrice('7')}>{cell[7]}</td>
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
                <td class='calendar-return-price' id='returnCell8' onClick={() => selectPrice('8')}>{cell[8]}</td>
                <td class='calendar-return-price' id='returnCell9' onClick={() => selectPrice('9')}>{cell[9]}</td>
                <td class='calendar-return-price' id='returnCell10' onClick={() => selectPrice('10')}>{cell[10]}</td>
                <td class='calendar-return-price' id='returnCell11' onClick={() => selectPrice('11')}>{cell[11]}</td>
                <td class='calendar-return-price' id='returnCell12' onClick={() => selectPrice('12')}>{cell[12]}</td>
                <td class='calendar-return-price' id='returnCell13' onClick={() => selectPrice('13')}>{cell[13]}</td>
                <td class='calendar-return-price' id='returnCell14' onClick={() => selectPrice('14')}>{cell[14]}</td>
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
                <td class='calendar-return-price' id='returnCell15' onClick={() => selectPrice('15')}>{cell[15]}</td>
                <td class='calendar-return-price' id='returnCell16' onClick={() => selectPrice('16')}>{cell[16]}</td>
                <td class='calendar-return-price' id='returnCell17' onClick={() => selectPrice('17')}>{cell[17]}</td>
                <td class='calendar-return-price' id='returnCell18' onClick={() => selectPrice('18')}>{cell[18]}</td>
                <td class='calendar-return-price' id='returnCell19' onClick={() => selectPrice('19')}>{cell[19]}</td>
                <td class='calendar-return-price' id='returnCell20' onClick={() => selectPrice('20')}>{cell[20]}</td>
                <td class='calendar-return-price' id='returnCell21' onClick={() => selectPrice('21')}>{cell[21]}</td>
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
                <td class='calendar-return-price' id='returnCell22' onClick={() => selectPrice('22')}>{cell[22]}</td>
                <td class='calendar-return-price' id='returnCell23' onClick={() => selectPrice('23')}>{cell[23]}</td>
                <td class='calendar-return-price' id='returnCell24' onClick={() => selectPrice('24')}>{cell[24]}</td>
                <td class='calendar-return-price' id='returnCell25' onClick={() => selectPrice('25')}>{cell[25]}</td>
                <td class='calendar-return-price' id='returnCell26' onClick={() => selectPrice('26')}>{cell[26]}</td>
                <td class='calendar-return-price' id='returnCell27' onClick={() => selectPrice('27')}>{cell[27]}</td>
                <td class='calendar-return-price' id='returnCell28' onClick={() => selectPrice('28')}>{cell[28]}</td>
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
                <td class='calendar-return-price' id='returnCell29' onClick={() => selectPrice('29')}>{cell[29]}</td>
                <td class='calendar-return-price' id='returnCell30' onClick={() => selectPrice('30')}>{cell[30]}</td>
                <td class='calendar-return-price' id='returnCell31' onClick={() => selectPrice('31')}>{cell[31]}</td>
                <td class='calendar-align-center'></td>
                <td class='calendar-align-center'></td>
                <td class='calendar-align-center'></td>
                <td class='calendar-align-center'></td>
            </tr>  
        </table>
    </div>
    );
}