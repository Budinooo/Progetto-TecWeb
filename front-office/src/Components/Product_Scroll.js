import React from 'react'
import Product from './Product.js'

export default function Product_Scroll({ productList }) {

  return (
    productList.map( product => {
        return <Product key={product.id} product={product}/>
    })
  )
}
