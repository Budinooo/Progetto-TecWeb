import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Components/Navbar.js';
import { BrowserRouter as Router, Routes as Switch, Route} from "react-router-dom";
import Product_Carousel from './Components/Product_Carousel';
import Community_Feed from "./Components/Community_Feed";
import Animal_Select from "./Components/Animal_Select";
import "./App.css";

const onSearch = (query) =>  
{
  fetch("http://localhost:8000/api/getProducts/").then((response) => response.json()).then((jsonResponse) => console.log(jsonResponse));
} 

function App() {

  //todo: aggiungere campi tag, disponibilità.
    
  const [products, setProducts] = useState([{id: 1, img: 'https://www.ideashoppingcenter.it/files/archivio_Files/Foto/44645_2.JPG', 
  name: 'croccantini', price: '99,99'},{id: 2, img: 'https://www.loradeglianimali.it/22047-large_default/flexi-original-new-classic-guinzaglio-acorda-5-mt-per-cani-m.jpg', 
  name: 'guinzaglio', price: '99,99'},{id: 3, img: 'https://www.isoladeitesori.it/dw/image/v2/BGRZ_PRD/on/demandware.static/-/Sites-it-master-catalog/default/dwaada2229/176032.jpg?sw=400&sh=400',
  name: 'Shampoo Petup Mousse Delicata', price:'8,99'},{id: 4, img: 'https://www.isoladeitesori.it/dw/image/v2/BGRZ_PRD/on/demandware.static/-/Sites-it-master-catalog/default/dwd0f06e10/idt/142719_1_1.jpg?sw=400&sh=400',
  name: 'NaturalPet Ghiotto Chef', price: '0,99'}, {id: 5, img: 'https://www.isoladeitesori.it/dw/image/v2/BGRZ_PRD/on/demandware.static/-/Sites-it-master-catalog/default/dw697e1d01/162528.jpg?sw=400&sh=400',
  name: 'Petup Cuscino Ovale Natalizio', price: '8,99'},{id: 6, img: 'https://www.isoladeitesori.it/dw/image/v2/BGRZ_PRD/on/demandware.static/-/Sites-it-master-catalog/default/dw697e1d01/162528.jpg?sw=400&sh=400',
  name: 'Petup Cuscino Ovale Natalizio', price: '8,99'},{id: 7, img: 'https://www.isoladeitesori.it/dw/image/v2/BGRZ_PRD/on/demandware.static/-/Sites-it-master-catalog/default/dw697e1d01/162528.jpg?sw=400&sh=400',
  name: 'Petup Cuscino Ovale Natalizio', price: '8,99'},{id: 8, img: 'https://www.isoladeitesori.it/dw/image/v2/BGRZ_PRD/on/demandware.static/-/Sites-it-master-catalog/default/dw697e1d01/162528.jpg?sw=400&sh=400',
  name: 'Petup Cuscino Ovale Natalizio', price: '8,99'}])

  return (
    <div className="App">
      <Navbar callback={onSearch}/>

      <div className="container mt-5">
        <div id="animal-select" className="row mx-3">
          <div className="col-sm-3">
            <div className="animal-card">
              <a href="#" role="link">
                <img width="60%" src="/shop/img/dog.png" alt="Picture of a dog"/>
              </a>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="animal-card">
              <a href="#" role="link">
                <img width="60%" src="/shop/img/bird.png" alt="Picture of a bird"/>
              </a>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="animal-card">
              <a href="#" role="link">
                <img width="60%" src="/shop/img/clown-fish.png" alt="Picture of a clown fish"/>
              </a>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="animal-card">
              <a href="#" role="link">
                <img width="60%" src="/shop/img/tiger.png" alt="Picture of a dog"/>
              </a>
            </div>
          </div>
        </div>
        <div className="row mb-5">
          <h3 className="mb-4">Featured products:</h3>
          <Product_Carousel productList={products} />
        </div>
      </div>
      <Community_Feed />
    </div>
    
  )
}

export default App;
