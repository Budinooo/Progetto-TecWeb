import React from 'react'

export default function Product(props) {

  return (
    <div>
        <img height={100} width={100} src={props.product.img}></img>
        <div>{props.product.name}</div>
        <div>€ {props.product.price}</div>
        <button>ADD TO CART</button>
    </div>
  )
}
