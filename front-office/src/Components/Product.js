import { Button } from 'bootstrap'
import React from 'react'
import './Product.css'
export default function Product(props) {

  return (
    <div className='card h-100'>
      <img className='card-img-top' src={props.product.img} alt={'an image representing'+props.product.name}/>
      <div className='card-body mt-auto'>
        <h5 className='card-title'> {props.product.name} </h5>
        <p className='card-text price'>€ {props.product.price} </p>
        <button className='btn-add'>ADD TO CART</button>
      </div>
    
    </div>
  )
  /*
      <div>
        <img height={100} width={100} src={props.product.img}></img>
        <div className='name'>{props.product.name}</div>
        <div className='price'>€ {props.product.price}</div>
        <ButtonAdd>ADD TO CART</ButtonAdd> 
    </div>
  */
}
