import React from 'react';
import * as FaIcons from "react-icons/fa";
import { Link } from 'react-router-dom'
import './navbar.css';

export default function Navbar(){
 return (
  <div class = "topnav">
    <span class="title">Travelo</span>
    <span class = "menu-bars"><FaIcons.FaBars/></span>
  </div>
 );
}