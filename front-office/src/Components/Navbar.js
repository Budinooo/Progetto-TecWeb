import React, {StyleSheet} from 'react'
import {Link} from 'react-router-dom';
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg">
      <a className="navbar-brand" href="#">
        <img src="http://192.168.56.1:8080\tmplogo.jpg" alt="Animal House Logo"/>
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
            <Link className="nav-link" to="/">HOME</Link>
          </li>          
          <li className="nav-item">
            <Link className="icon-btn mx-3 nav-link" to="/cart">
              CART
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart4" viewBox="0 0 16 16">
                  <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
              </svg>  
            </Link> 
          </li>
          <li className="nav-item">
            <Link className="icon-btn nav-link" to="/profile">
              LOG IN
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
              </svg>
            </Link>
          </li>
        </ul>

      </div>
    </nav>
  )
}