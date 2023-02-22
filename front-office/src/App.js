import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Components/Navbar.js';
import { BrowserRouter as Router, Routes as Switch, Route, useFetcher} from 'react-router-dom';
import Product_Carousel from './Components/Product_Carousel';
import Community_Feed from "./Pages/Community_Feed";
import Animal_Select from "./Components/Animal_Select";
import "./App.css";
import Home from "./Pages/Home.js";
import Cart from "./Pages/Cart.js";
import Profile from "./Pages/Profile.js";
import DisplayResults from "./Pages/DisplayResults.js";
import ServiceDisplay from "./Pages/ServiceDisplay.js";

const onSearch = (query) =>  
{
  console.log(query);
  //fetch("http://localhost:8000/db/search/" + query).then((response) => response.json()).then((jsonResponse) => console.log(jsonResponse));
} 

class App extends React.Component {

  constructor(props) {
    super(props);
    let products = []
    let services = []
    this.state = {products, services};
    fetch('db/collection?collection=products', {method:"GET"}).then((res)=>res.json()).then((data)=> {this.setState({products: data.result.slice(0,8)})});
    fetch('db/element?id=0&collection=services', {method: "GET"}).then((res) => res.json()).then((data) => this.setState({services: data.result}));
  }

  componentDidMount()
  {
    if(localStorage.getItem("cart"))
      return;
    localStorage.setItem("cart","[]");
    if(localStorage.getItem("login") == null) {
      const longinInfo = {
        "islogged": false,
        "id": "",
      }
      localStorage.setItem("login",JSON.stringify(longinInfo))
    }
  }
  
  render () {
    return (
      <>
        <Navbar callback={onSearch}/>
        <Switch>
          <Route exact path='/' element={<Home services={this.state.services} products={this.state.products}/>} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/feed' element={<Community_Feed />} />
          <Route path='/results' element={<DisplayResults />} />
          <Route path='/services' element={<ServiceDisplay services={this.state.services} />} />
        </Switch>
      </>
      
    )
  }
}

export default App;
