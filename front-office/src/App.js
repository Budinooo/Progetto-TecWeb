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
    fetch('/db/element?id=0&collection=services', {method: "GET"}).then((res) => res.json()).then((data) => this.setState({service: data.result}));
    if(localStorage.getItem("cart") == null)
      localStorage.setItem("cart","[]");
    if(localStorage.getItem("login") == null) {
      const loginInfo = {
        "islogged": false,
        "id": "",
      }
      localStorage.setItem("login",JSON.stringify(loginInfo))
    }
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
      </>
      
    )
  }
}

export default App;
