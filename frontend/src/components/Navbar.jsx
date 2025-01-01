import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar({handleLogout}) {
  const location = useLocation();

  const getNavLinks = () => {
    if (location.pathname === '/home') {
      return (
        <>
          <li>
            <Link to='/home'>Home</Link>
          </li>
          <li>
            <button className="nav-logout" onClick={handleLogout}>Logout</button>
          </li>
          <li>
            <Link to='/login'>Login</Link>
          </li>
          <li>
            <Link to='/signup'>Signup</Link>
          </li>
        </>
      );
    } else if (location.pathname === '/login' || location.pathname === 'signup') {
      return (
        <>
          <li>
            <Link to='/login'>Login</Link>
          </li>
          <li>
            <Link to='/signup'>SignUp</Link>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li>
            <Link to='/login'>Login</Link>
          </li>
          <li>
            <Link to='/signup'>Signup</Link>
          </li>
        </>
      );
    }
    };

    return (
      <nav className="navbar">
        <ul>
          {getNavLinks()}
        </ul>
      </nav>
    );
  };
  

export default Navbar;