import React, {useState} from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from 'react-router-dom';
import { IconContext } from 'react-icons';
import './navbar.css';
import TripSummary from './TripSummary';
import OutwardCalendar from './OutwardCalendar';
import ReturnCalendar from './ReturnCalendar';

export default function Navbar({appToNavbar}){
 const [sidebar, setSidebar] = useState(true)
 const showSidebar = () => setSidebar(!sidebar)

 return (
    <>
        <IconContext.Provider value={{color: '#fff'}}>
        <div className = "topnav">
            <span className="title">FlightSearchApp</span>
            <Link to="#" className="menu-bars"><FaIcons.FaBars onClick={showSidebar}/></Link>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
            <ul className='nav-menu-items'>
                <TripSummary navbarToTripSummary={appToNavbar}/>
                <br/>
                <OutwardCalendar navbarToOutwardCalendar={appToNavbar}/>
                <br/>
                <ReturnCalendar navbarToOutwardCalendar={appToNavbar}/>
            </ul>
        </nav>
        </IconContext.Provider>
    </>
 );
}