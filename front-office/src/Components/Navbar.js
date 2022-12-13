import React from 'react'
import './Style/Navbar.css'

export default function Navbar() {
  return (
    <div>
      <button id="home-btn">Home</button>
      <input id="searchbar" type="text" />
      <button id="cart-btn">Cart</button> 
      <button id="profile-btn">Profile</button>
    </div>
  )
}

