import { Button } from 'bootstrap'
import React from 'react'
import {ButtonAdd} from './ProductElements'

export default function Product(props) {

  return (
    <div>
        <img height={100} width={100} src={props.product.img}></img>
        <div className='name'>{props.product.name}</div>
        <div className='price'>€ {props.product.price}</div>
        <ButtonAdd>ADD TO CART</ButtonAdd> 
    </div>
  )
}
