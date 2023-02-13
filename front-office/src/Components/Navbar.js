import React, {StyleSheet} from 'react'
import {Link} from 'react-router-dom';
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg">
      <a className="navbar-brand ms-4" href="#">
        <img src="/shop/img/immagine.png" alt="Animal House Logo"/>
      </a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse justify-content-end me-5" id="navbarSupportedContent">
        <form id="searchbar" className="mx-auto my-2 my-lg-0">
          <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
        </form>
        <ul className="navbar-nav">
          <li className="nav-item me-3 active">
            <a className="nav-link" href="/">HOME</a>
          </li>          
          <li className="nav-item">
            <a className="icon-btn mx-3 nav-link" href="/cart">
              CART
            </a> 
          </li>
          <li className="nav-item">
            <a className="icon-btn nav-link" href="/profile">
              LOG IN
            </a>
          </li>
        </ul>

      </div>
    </nav>
  )
}