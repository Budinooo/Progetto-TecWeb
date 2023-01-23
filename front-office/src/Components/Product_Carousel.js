import React from 'react'
import Product from './Product.js'
import './Product_Carousel.css'

class Product_Carousel extends React.Component {

  constructor(props) {
    super(props);
    const pl= props.productList;
    this.state = {pl};
  }

  getCarouselIndicators(IndicatorNumber) {
    for(let i=1; i<IndicatorNumber/4;i++){ //ogni slide contiene 4 prodotti quindi serve un indicatore slide ogni 4 prodotti spero di non avere dei casini di casting a fare productlist.length/4
      return (<li data-target="#productCarousel" data-slide-to={i}></li>)
    }
  }
  
  render() {
    console.log(this.state.pl.length);
    return (
      <div id="productCarousel" className="carousel slide" data-ride="carousel">
        <ol className="carousel-indicators">
          <li data-target="#productCarousel" data-slide-to="0" className="active"></li>
          { this.getCarouselIndicators(this.state.pl.length) }
        </ol>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="container">
              <div className='row'>
                {this.state.pl.map( product => {
                    return ( 
                      <div key={product.id} className='col-sm-3'>
                        <Product key={product.id} product={product}/>
                      </div>
                    )
                })}
              </div>
            </div>
          </div>
        </div>
        <a className="carousel-control-prev" href="#productCarousel" role="button" data-slide="prev">
          <img width="20%" src="https://cdn-icons-png.flaticon.com/512/4028/4028550.png"/>
          <span className="sr-only">Previous</span>
        </a>
        <a className="carousel-control-next" href="#productCarousel" role="button" data-slide="next">
          <img width="20%" src="https://cdn-icons-png.flaticon.com/512/318/318476.png"/>
          <span className="sr-only">Next</span>
        </a>
      </div>
    )
  }

}
  export default Product_Carousel;