import React, { useState } from "react"
import Navbar from './Components/Navbar.js'
import { BrowserRouter as Router, Routes as Switch, Route} from "react-router-dom"
import Product_Scroll from "./Components/Product_Scroll.js"
import Animal_Select from "./Components/Animal_Select"
import Service_Scroll from "./Components/Service_Scroll"
import "./App.css"

function App() {
    
  const [products, setProducts] = useState([{id: 1, img: 'https://www.ideashoppingcenter.it/files/archivio_Files/Foto/44645_2.JPG', 
  name: 'croccantini', price: '99,99'},{id: 2, img: 'https://www.loradeglianimali.it/22047-large_default/flexi-original-new-classic-guinzaglio-acorda-5-mt-per-cani-m.jpg', 
  name: 'guinzaglio', price: '99,99'}])

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route path='/' exact component={App} />
          <Route path='/cart' exact component={App} />
          <Route path='/profile' exact component={App} />          
        </Switch>
      </Router>

      <Product_Scroll productList={products} />
    </div>
  )
}

export default App;
