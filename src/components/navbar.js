import React, {useState} from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import { IconContext } from 'react-icons';
import './navbar.css';
import TripSummary from './TripSummary';
import OutwardCalendar from './OutwardCalendar';

export default function Navbar({appToNavbar}){
 const [sidebar, setSidebar] = useState(true)
 const showSidebar = () => setSidebar(!sidebar)

 return (
    <>
        <div>{appToNavbar}</div>
        <IconContext.Provider value={{color: '#fff'}}>
        <div class = "topnav">
            <span class="title">FlightSearchApp</span>
            <Link to="#" class="menu-bars"><FaIcons.FaBars onClick={showSidebar}/></Link>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
            <ul className='nav-menu-items' onClick={showSidebar}>
                <TripSummary/>
                <br/>
                <OutwardCalendar/>
                <br />
                <OutwardCalendar/>
                
                {SidebarData.map((item, index) => {
                    return (
                        <li key={index} className={item.cName}>
                            <Link to={item.path}>
                                {item.icon}
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
        </IconContext.Provider>
    </>
 );
}