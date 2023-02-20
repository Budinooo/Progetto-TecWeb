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

const onSearch = (query) =>  
{
  console.log(query);
  //fetch("http://localhost:8000/db/search/" + query).then((response) => response.json()).then((jsonResponse) => console.log(jsonResponse));
} 



function App() {

  //todo: aggiungere campi tag, disponibilità.

  const [products, setProducts] = useState([{id: 1, img: 'https://www.ideashoppingcenter.it/files/archivio_Files/Foto/44645_2.JPG', 
  name: 'croccantini', price: '99.99'},{id: 2, img: 'https://www.loradeglianimali.it/22047-large_default/flexi-original-new-classic-guinzaglio-acorda-5-mt-per-cani-m.jpg', 
  name: 'guinzaglio', price: '99.99'},{id: 3, img: 'https://www.isoladeitesori.it/dw/image/v2/BGRZ_PRD/on/demandware.static/-/Sites-it-master-catalog/default/dwaada2229/176032.jpg?sw=400&sh=400',
  name: 'Shampoo Petup Mousse Delicata', price:'8.99'},{id: 4, img: 'https://www.isoladeitesori.it/dw/image/v2/BGRZ_PRD/on/demandware.static/-/Sites-it-master-catalog/default/dwd0f06e10/idt/142719_1_1.jpg?sw=400&sh=400',
  name: 'NaturalPet Ghiotto Chef', price: '0.99'}, {id: 5, img: 'https://www.isoladeitesori.it/dw/image/v2/BGRZ_PRD/on/demandware.static/-/Sites-it-master-catalog/default/dw697e1d01/162528.jpg?sw=400&sh=400',
  name: 'Petup Cuscino Ovale Natalizio', price: '8.99'},{id: 6, img: 'https://www.isoladeitesori.it/dw/image/v2/BGRZ_PRD/on/demandware.static/-/Sites-it-master-catalog/default/dw697e1d01/162528.jpg?sw=400&sh=400',
  name: 'Petup Cuscino Ovale Natalizio', price: '8.99'},{id: 7, img: 'https://www.isoladeitesori.it/dw/image/v2/BGRZ_PRD/on/demandware.static/-/Sites-it-master-catalog/default/dw697e1d01/162528.jpg?sw=400&sh=400',
  name: 'Petup Cuscino Ovale Natalizio', price: '8.99'},{id: 8, img: 'https://www.isoladeitesori.it/dw/image/v2/BGRZ_PRD/on/demandware.static/-/Sites-it-master-catalog/default/dw697e1d01/162528.jpg?sw=400&sh=400',
  name: 'Petup Cuscino Ovale Natalizio', price: '8.99'}])
  
  useEffect(()=>
  {
    if(localStorage.getItem("cart"))
      return;
    localStorage.setItem("cart","[]");
  },[])
  
  return (
    <>
      <Navbar callback={onSearch}/>
      <Switch>
        <Route exact path='/' element={<Home products={products}/>} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/feed' element={<Community_Feed />} />
        <Route path='/results' element={<DisplayResults />} />
      </Switch>
    </>
    
  )
}

export default App;
