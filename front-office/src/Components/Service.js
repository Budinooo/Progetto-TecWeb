import { Button } from 'bootstrap'
import React from 'react'
import './Service.css'
export default function Service(props) {

  return (
    <div className='card h-100'>
      <img className='card-img-top' src={props.service.img} alt={'an image representing'+props.service.name}/>
      <div className='card-body mt-auto'>
        <h5 className='card-title'> {props.service.name} </h5>
        <p className='card-text price'>€ {props.service.price} </p>
        <p className='location'>This week at: {props.product.location}</p>
        <button className='btn-add'>BOOK NOW</button>
      </div>
    
    </div>
  )
}
