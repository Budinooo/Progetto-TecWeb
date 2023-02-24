import React from 'react'
import './Product.css'

const addToCart = (item) =>
{
  let cart = JSON.parse(localStorage.getItem("cart"));
  let cartItem = cart.findIndex(i => i._id == item._id);
  if(cartItem>=0)
    cart.at(cartItem).quantity++;
  else {
    let newItem = {_id:0, img:"", name:"", price:0, quantity:0};
    newItem._id = item._id;
    newItem.img = item.img;
    newItem.name = item.name;
    newItem.price = item.price;
    newItem.quantity = 1;
    cart.push(newItem);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  console.log("aggiunto " + item.name + " al carrello");
}

export default function Product(props) {

  return (
    <div className='card h-100'>
      <img className='card-img-top' src={props.product.img} alt={'an image representing'+props.product.name}/>
      <div className='card-body mt-auto'>
        <h5 className='card-title'> {props.product.name} </h5>
        <p className='card-text price'>€ {props.product.price} </p>
        <button onClick={(e) => addToCart(props.product)} className='btn-add'>ADD TO CART</button>
      </div>
    
    </div>
  )
}
