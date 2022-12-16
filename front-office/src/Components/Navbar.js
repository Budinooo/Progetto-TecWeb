import React, {StyleSheet} from 'react'
import {Link} from 'react-router-dom';
import {
  Nav
} from './NavbarElements'

export default function Navbar() {
  return (
    <Nav>
      <Link to="/">Home</Link>
      <input id="searchbar" type="text" />
      <Link to="/cart">Cart</Link> 
      <Link to="/profile">Profile</Link>
    </Nav>
  )
}

