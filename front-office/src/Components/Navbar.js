import React from 'react';
import './Navbar.css';
import {Collapse} from 'react-bootstrap';

class Navbar extends React.Component {
  constructor(props) 
  {
    super(props);
    this.state = {isAdmin: 0, screenWidth: null, hamburgerClicked: false};
    let loginInfo = JSON.parse(localStorage.getItem("login"));
    if(loginInfo == null){
      loginInfo = {"islogged": false, "id": ""};
      localStorage.setItem("login", JSON.stringify(loginInfo));
    }
  }

  componentDidMount()
  {
    this.state.screenWidth = window.innerWidth;
    let loginInfo = JSON.parse(localStorage.getItem("login"));
    fetch('http://localhost:8000/db/collection?collection=users').then(res => res.json())
    .then((data) => 
      {
        let totalIds = [];
        data.result.map((user) => 
        {
          totalIds.push(user._id);
        });
        if(loginInfo.islogged && !totalIds.includes(loginInfo.id))
        {
          const loginInfo = {
            "islogged": false,
            "id": "",
          }
          localStorage.setItem("login",JSON.stringify(loginInfo))
        }
        else if(loginInfo.islogged){
          fetch('http://localhost:8000/db/element?id=' + loginInfo.id + '&collection=users').then((res) => res.json())
          .then((data) => 
          {
            this.setState({isAdmin: data.result.admin});
          })
        }
      })
  }

  handleSearch = (callback) => (e) => 
    {
      e.preventDefault();
      callback(document.getElementById("searchBar").value);
    }
  
  loginBtn = () =>
  {
    if(JSON.parse(localStorage.getItem("login")).islogged){
      if(window.location.pathname == '/profile/' || window.location.pathname == '/profile' ){
        return(<a className="icon-btn nav-link" onClick={this.logoutBtn} href="/">LOGOUT</a>);
      }
      return(<a className="icon-btn nav-link" href="/profile">PROFILE</a>);
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

  displayBackOfficeAccess = () => 
  {
    if(this.state.isAdmin == 1)   
      return (
        <li className='nav-item'>
            <a className="nav-link bottom" href="/backoffice">
              Backoffice
            </a>
        </li>
      );
  }

  displayCollapsed = () =>
  {
    if(this.state.screenWidth < 500)
    {
      return(
        <Collapse in={this.state.hamburgerClicked} >
          <div className='nav-mobile'>
            <form id="searchbarContainer" className="my-2 my-lg-0">
              <input id="searchBar" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
              <button onClick={(e)=>this.handleSearch(this.props.callback)(e)} ><img src="https://cdn-icons-png.flaticon.com/512/2811/2811806.png" /></button>
            </form>
            <ul className="navbar-nav nav-top justify-content-end me-5">          
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
        </Collapse>
      )
    }
    else
      return(
        <div className="collapse navbar-collapse justify-content-space-between" id="navbarSupportedContent">
            <form id="searchbarContainer" className="my-2 my-lg-0">
              <input id="searchBar" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
              <button onClick={(e)=>this.handleSearch(this.props.callback)(e)} ><img src="https://cdn-icons-png.flaticon.com/512/2811/2811806.png" /></button>
            </form>
            <ul className="navbar-nav nav-top justify-content-end me-5">          
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
      )
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg">
        <a className="navbar-brand ms-4" href="/">
          <div className="logo"><span>A</span>NIMAL<span>H</span><img src="dog-house.png" alt="" />USE</div>
        </a>
        <button onClick={() => this.setState({hamburgerClicked: !this.state.hamburgerClicked})} className="navbar-toggler" type="button" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="double-decker-navbar" className='w-100 d-flex flex-column'>
          {this.displayCollapsed()}
          <div id="bottom-navbar" className='d-flex'>
            <ul className="navbar-nav">
              <li className="nav-item active">
                <a className="nav-link bottom" href="/">Home</a>
              </li>
              <li className='nav-item'>
                <a className="nav-link bottom" href="/services">
                  Services
                </a> 
              </li>
              <li className='nav-item'>
                <a className="nav-link bottom" href="/results">
                  Products
                </a> 
              </li>
              <li className='nav-item'>
                <a className="nav-link bottom" href="/feed">
                  Community Feed
                </a>
              </li>
              <li className='nav-item'>
                <a className="nav-link bottom" href="/game">
                    Game
                </a> 
              </li>
              {this.displayBackOfficeAccess()}
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar;