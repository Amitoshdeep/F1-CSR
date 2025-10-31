import React from 'react'
import { NavLink } from 'react-router-dom';
// Componenets
import { BiSolidDashboard } from "react-icons/bi";
import { FaGlobeAmericas, FaCogs, FaTools } from "react-icons/fa";

function Navbar() {
  return (
    <div
    className='flex flex-col p-4
    bg-red-900/20 backdrop-blur-2xl
    h-4/5 w-80
    border-r-4 border-b-4 border-t-2
    border-red-500/20
    rounded-2xl
    '>

      <NavLink to={`/`} className='
      text-2xl
      font-azonix
      border-b-2 border-white/10
      px-2.5 py-1
      '>
        AI - CSR
      </NavLink>

      <ul className='p-2.5'>

        <NavLink
        to={`/`}
        className={ ({isActive})=> `duration-900 flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-2

        ${isActive? "bg-white/10":""}`}>

          <BiSolidDashboard />
          <p>Dashboard</p>
        </NavLink>

        <NavLink
        to={`/tracks`}
        className={ ({isActive})=> `duration-900 flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-2

        ${isActive? "bg-white/10":""}`}>

          <FaGlobeAmericas />
          <p>Tracks</p>
        </NavLink>

        <NavLink
        to={`/setup`}
        className={ ({isActive})=> `duration-900 flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-2

        ${isActive? "bg-white/10":""}`}>

          <FaCogs />
          <p>Car Setup</p>
        </NavLink>

        <NavLink
        to={`/pit`}
        className={ ({isActive})=> `duration-900 flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-2

        ${isActive? "bg-white/10":""}`}>

          <FaTools />
          <p>Pit Stop</p>
        </NavLink>

      </ul>

    </div>
  )
}

export default Navbar
