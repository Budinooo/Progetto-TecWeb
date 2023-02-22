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
  console.log(query);
  //fetch("http://localhost:8000/db/search/" + query).then((response) => response.json()).then((jsonResponse) => console.log(jsonResponse));
} 

function App() {

  //todo: aggiungere campi tag, disponibilità.

  const [products, setProducts] = useState(fetch('db/collection?collection=products', {method:"GET"}).then((res)=>res.json()).then((data)=> setProducts(data.result.slice(0,8))));
  
  const [services, setServices] = useState(fetch('db/element?id=0&collection=services', {method: "GET"}).then((res) => res.json()).then((data) => setServices(data.result)));

  useEffect(()=>
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
  },[])
  
  return (
    <>
      <Navbar callback={onSearch}/>
      <Switch>
        <Route exact path='/' element={<Home services={services} products={products}/>} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/feed' element={<Community_Feed />} />
        <Route path='/results' element={<DisplayResults />} />
        <Route path='/services' element={<ServiceDisplay services={services} />} />
      </Switch>
    </>
    
  )
}

export default App;
