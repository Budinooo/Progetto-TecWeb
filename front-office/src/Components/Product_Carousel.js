import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './Product_Carousel.css';
import Product from './Product.js';


class Product_Carousel extends React.Component {

  constructor(props) {
    super(props);
    const pl= props.productList;
    const slideNum = props.productList.length/4;
    var slides =[[]];
    for(let i=0;i<slideNum;++i) {
      let slideI = [];  
      for (let j = i*4;j<((i+1)*4) && j<props.productList.length;++j) {
          slideI[j] = props.productList[j]
      }
      slides[i]=slideI;
    }
    this.state = {slides,slideNum};
  }

  getCarouselIndicators() {
    for(let i=1; i<this.state.slideNum;i++){ //ogni slide contiene 4 prodotti quindi serve un indicatore slide ogni 4 prodotti spero di non avere dei casini di casting a fare productlist.length/4
      return (<li data-target="#productCarousel" data-slide-to={i}></li>)
    }
  }
  
  render() {
    return (
      <Carousel controls variant='dark'>
        {this.state.slides.map( (productList, i) => {
          return (
            <Carousel.Item key={i}>
              <div className="container">
                <div className='row'>
                  {productList.map( product => {
                    return ( 
                      <div key={product.id} className='col-sm-3'>
                        <Product key={product.id} product={product}/>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Carousel.Item>)
        })}
      </Carousel>
    )
  }
}
  export default Product_Carousel;