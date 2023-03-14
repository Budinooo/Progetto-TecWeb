import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './Product_Carousel.css';
import Product from './Product.js';


class Product_Carousel extends React.Component {

  constructor(props) {
    super(props);
    let slideNum = 0;
    let slides =[[]];
    let productList = [];
    this.state = {slides: slides,slideNum: slideNum, productList: productList, screenWidth: null };
  }

  componentDidMount() 
  {
    this.setState({screenWidth: window.innerWidth});
  }

  componentDidUpdate() {
    if(this.props.productList != this.state.productList)
    {
      let slides = [[]];
      let slideNum;
      if(this.state.screenWidth < 500)
      {
        slideNum = this.state.productList.length;
        for(let i=0;i<slideNum;++i) {
          slides[i]=[this.state.productList[i]];
        }
        console.log(slides)
      }
      else
      {
        slideNum = this.props.productList.length/4;
        for(let i=0;i<slideNum;++i) {
          let slideI = [];
          for (let j = i*4;j<((i+1)*4) && j< this.props.productList.length;++j) {
              slideI[j] = this.props.productList[j]
          }
          slides[i]=slideI;
        }
      }
      this.setState({slides: slides, slideNum:slideNum, productList: this.props.productList})
    }
  }

  getCarouselIndicators() {
    for(let i=1; i<this.state.slideNum;i++){ //ogni slide contiene 4 prodotti quindi serve un indicatore slide ogni 4 prodotti spero di non avere dei casini di casting a fare productlist.length/4
      return (<li data-target="#productCarousel" data-slide-to={i}></li>)
    }
  }
  
  render() {
    if(this.state.slideNum <= 0) {
      return null;
    }

    return (
      <Carousel controls={this.screenWidth < 500 ? true : false } variant='dark'>
        {this.state.slides.map( (productList, i) => {
          return (
            <Carousel.Item key={this.state.productList[i]._id}>
              <div className="container">
                <div className='row'>
                  {productList.map( product => {
                    return ( 
                      <div key={product._id} className='col-sm-3'>
                        <Product product={product}/>
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