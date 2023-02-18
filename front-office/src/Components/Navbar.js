import React, {StyleSheet} from 'react'
import {Link} from 'react-router-dom';
import './Navbar.css'


class Navbar extends React.Component {
  constructor(props) 
  {
    super(props);
  }

  handleSearch = (callback) => (e) => 
    {
      e.preventDefault();
      console.log()
      callback(document.getElementById("searchBar").value);
    }
  
  render() {
    return (
      <nav className="navbar navbar-expand-lg">
        <a className="navbar-brand ms-4" href="#">
          <img src="/shop/img/immagine.png" alt="Animal House Logo"/>
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
          <form id="searchbarContainer" className="ms-auto my-2 my-lg-0">
            <input id="searchBar" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
            <button onClick={(e)=>this.handleSearch(this.props.callback)(e)} >Cerca</button>
          </form>
          <ul className="navbar-nav justify-content-end me-5">
            <li className="nav-item active">
              <a className="nav-link" href="/">HOME</a>
            </li>          
            <li className="nav-item">
              <a className="icon-btn nav-link" href="/cart">
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
}

export default Navbar;