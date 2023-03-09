import React, {StyleSheet} from 'react'
import './Navbar.css'


class Navbar extends React.Component {
  constructor(props) 
  {
    super(props);
  }

  handleSearch = (callback) => (e) => 
    {
      e.preventDefault();
      callback(document.getElementById("searchBar").value);
    }
  
  loginBtn = () =>
  {
    if(JSON.parse(localStorage.getItem("login")).islogged){
      if(window.location.pathname == '/profile'){
        return(<a className="icon-btn nav-link" onClick={this.logoutBtn} href="/profile">LOGOUT</a>);
      }
      return(<a className="icon-btn nav-link" /*onClick={this.logoutBtn}*/ href="/profile">PROFILE</a>);
    }
    else
      return(<a className="icon-btn nav-link" href="/login">LOG IN</a>)
  }

  logoutBtn = () =>
  {
    let obj = {
      "islogged": false,
      "id": ""
    }
    localStorage.setItem("login", JSON.stringify(obj))
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg">
        <a className="navbar-brand ms-4" href="/">
          <img src="img/immagine.png" alt="Animal House Logo"/>
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="double-decker-navbar" className='w-100 d-flex flex-column'>
          <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
            <form id="searchbarContainer" className="ms-auto my-2 my-lg-0">
              <input id="searchBar" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
              <button onClick={(e)=>this.handleSearch(this.props.callback)(e)} ><img width="85%" src="https://cdn-icons-png.flaticon.com/512/2811/2811806.png" /></button>
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
                {this.loginBtn()}
              </li>
            </ul>
          </div>
          <div id="bottom-navbar" className='d-flex'>
            <ul className="navbar-nav">
              <li className='nav-item'>
                <a className="nav-link bottom" href="/game">
                    Game
                </a> 
              </li>
              <li className='nav-item'>
                <a className="nav-link bottom" href="/services">
                  Services
                </a> 
              </li>
              <li className='nav-item'>
                <a className="nav-link bottom" href="/results?category=dog">
                  Dog products
                </a> 
              </li>
              <li className='nav-item'>
                <a className="nav-link bottom" href="/results?category=cat">
                  Cat products
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar;