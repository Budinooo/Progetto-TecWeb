import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Components/Navbar.js';
import { BrowserRouter as Router, Routes as Switch, Route, useFetcher} from 'react-router-dom';
import Community_Feed from "./Pages/Community_Feed";
import "./App.css";
import Home from "./Pages/Home.js";
import Cart from "./Pages/Cart.js";
import Profile from "./Pages/Profile.js";
import DisplayResults from "./Pages/DisplayResults.js";
import ServiceDisplay from "./Pages/ServiceDisplay.js";
import { ToastContainer } from "react-toastify";
import { Facebook, Instagram, Youtube, Twitter, Linkedin } from "react-bootstrap-icons";

const onSearch = (query) =>  
{
  //console.log(query);
  if (query && query != "" && query!=" ")
    window.location.href = "/results?query="+query;
} 

class App extends React.Component {

  constructor(props) {
    super(props);
    let products = []
    let service = null
    this.state = {products: products, service: service};
  }

  componentDidMount()
  {    
    fetch('/db/collection?collection=products', {method:"GET"}).then((res)=>res.json()).then((data)=> {this.setState({products: data.result.slice(0,8)})});
    fetch('/db/collection?collection=services', {method: "GET"}).then((res) => res.json()).then((data) => this.setState({service: data.result[0]}));
    if(!localStorage.getItem("cart"))
      localStorage.setItem("cart","[]");
  }
  
  render () {
    return (
      <>
        <Navbar callback={onSearch}/>
        <Switch>
          <Route exact path='/' element={<Home service={this.state.service} products={this.state.products}/>} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/feed' element={<Community_Feed />} />
          <Route path='/results' element={<DisplayResults />} />
          <Route path='/services' element={<ServiceDisplay />} />
          <Route path='/profile' element={<Profile />} />
        </Switch>
        <footer>
          <div id="brag-text">
            <p className="footer-text">
              <span>Number 1 </span> 
              Pet store in the W
              <img className="mb-1" src="dog-house.png" alt="logo" width="25px"/>rld
            </p>
          </div>
          <div className="mx-auto" id="socials">
            <a><Facebook size={30} /></a>
            <a href="https://www.instagram.com/neon_glider_/"><Instagram size={30} /></a>
            <a href="https://twitter.com/PirazzoliLeon"><Twitter size={30} /></a>
            <a><Youtube size={30} /></a>
            <a><Linkedin size={30}/></a>
          </div>
        </footer>
        <ToastContainer position="bottom-right" />
      </>
      
    )
  }
}

export default App;
