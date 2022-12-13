import React, { useState } from "react"
import Navbar from './Components/Navbar.js'
import Product_Scroll from "./Components/Product_Scroll.js"
import Animal_Select from "./Components/Animal_Select"
import Service_Scroll from "./Components/Service_Scroll"

function App() {
    
  const [products, setProducts] = useState([{id: 1, img: 'https://www.ideashoppingcenter.it/files/archivio_Files/Foto/44645_2.JPG', 
  name: 'croccantini', price: '99,99'},{id: 2, img: 'https://www.loradeglianimali.it/22047-large_default/flexi-original-new-classic-guinzaglio-acorda-5-mt-per-cani-m.jpg', 
  name: 'guinzaglio', price: '99,99'}])

  return (
    <div className="App">
      <Navbar />
      <Product_Scroll productList={products} />
    </div>
  )
}

export default App;
