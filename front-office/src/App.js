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
  
  const [services, setServices] = useState([{id: 1, img: "https://larchmontvillagevet.com/wp-content/uploads/2019/02/grooming-lab-bath-1024x682.jpg", name: "Grooming", desc: "A Full Groom Includes: Pre bath brush, bath with your choice of shampoo conditioner all available in our blue room, ear cleansing, fluff up warm blow dry by hand with brush styling, pawdicure (hair clip, nail clip and file), eye stain removal, scissor cut to breed specific styling or your own style preference, your choice of cologne from the blue room, hair Accessory. PLEASE NOTE - Additional costs apply for parasites present/ heavily soiled or matted coats/ difficult / aggressive behaviour. Final cost is dependent on the complexity of the groom and how long it takes. ", price: "10€/h", availability:["20-02-2023","21-02-2023","22-02-2023"]}]);

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
