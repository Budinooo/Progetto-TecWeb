import { useSearchParams } from 'react-router-dom';
import React, {StyleSheet} from 'react'
import Filter from "../Components/Filter"
import Product_Display from '../Components/Product_Display';
import './DisplayResults.css'


class DisplayResults extends React.Component {
    constructor(props) 
     {
          super(props);
          this.state={
               screenWidth: window.innerWidth,
               products: [],
               productsDisplayed: []
          }
          let url = new URL(document.URL);
          let searchParams = url.searchParams

          
          if(searchParams.get('query'))
               this.getSearchedProducts(searchParams.get('query').toLowerCase())
          else if (searchParams.get('category'))
               this.getSearchedCategory(searchParams.get('category').toLowerCase())
          else
               this.getProducts();

          this.handleCategoryFilter = this.handleCategoryFilter.bind(this);
          this.handlePriceFilter = this.handlePriceFilter.bind(this);
     }

     getProducts = () =>{
          fetch('http://localhost:8000/db/collection?collection=products',{
               method:'GET'
          }).then(response => response.json())
          .then(data => {
               data = data.result;
               this.setState({products: data, productsDisplayed: data})
          })
     }

     getSearchedProducts = (query) =>{
          fetch('http://localhost:8000/db/collection?collection=products',{
               method:'GET'
          }).then(response => response.json())
          .then(data => {
               data = data.result;
               data = data.filter(product => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query))
               this.setState({products: data, productsDisplayed: data})
          })
     }

     getSearchedCategory = (query) =>{
          fetch('http://localhost:8000/db/collection?collection=products',{
               method:'GET'
          }).then(response => response.json())
          .then(data => {
               data = data.result;
               data = data.filter(product => product.animal.toLowerCase() == query)
               this.setState({products: data, productsDisplayed: data})
          })
     }

     handleResize = () =>{
          this.setState({screenWidth: window.innerWidth});
     }

     componentDidMount() {
          window.addEventListener("resize", this.handleResize);
     }

     componentWillUnmount() {
          window.removeEventListener("resize", this.handleResize);
     }

     handleCategoryFilter = (animal,tag) =>{
          //prima fare this.state.products = collezione intera di prodotti
          fetch('http://localhost:8000/db/collection?collection=products',{
               method:'GET'
          }).then(response => response.json())
          .then(data => {
               data = data.result;
               this.setState({products: data})
               let products = this.state.products.filter(product => product.animal == animal && product.tag == tag);
               this.setState({productsDisplayed: products});
          })
     }

     handlePriceFilter = (min,max) =>{
          let products = this.state.products.filter(product => parseFloat(product.price) >= min && parseFloat(product.price) <= max);
          this.setState({productsDisplayed: products});
     }

    renderProducts = () => {
          return this.state.productsDisplayed.map((product, i)=>{
               return <Product_Display product={product} key={i} />;
          })
    }

    render() {
        return (
            <div className="container displayResult">
                <Filter applyCategory={this.handleCategoryFilter} applyPrice={this.handlePriceFilter}/>
                <div className={`products ${this.state.screenWidth<500 ? "w-100" : ""}`}>
                    {this.renderProducts() }
                </div>
            </div>
        )
    }
}

export default DisplayResults;