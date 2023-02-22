import React from "react";
import Product from "../Components/Product";
import './Cart.css'

class Cart extends React.Component
{
    constructor(props)
    {
        super(props);
//        const products = props.products;
        const services = props.services;
        let products = JSON.parse(localStorage.getItem("cart"));
        if (!products)
            products = [];
        this.state = {products, services};
    }

    productRemove = (id) => 
    {
        let productToRemove = this.state.products.findIndex(product => product.id == id);
        let remainingProducts = this.state.products;
        remainingProducts.splice(productToRemove,1);
        this.setState({products: remainingProducts}, () => localStorage.setItem("cart", JSON.stringify(this.state.products)));
    };

    getTotal = () => 
    {
        let sum=0.00;
        this.state.products.map((i) => {sum += (parseFloat(i.price) * parseInt(i.quantity))})
        return sum.toFixed(2);
    };
    
    getTotalItems = () => 
    {
        let sum = 0;
        this.state.products.map((i) => {sum +=parseInt(i.quantity)});
        return sum;
    };

    setQuantity = (e) => (id) =>
    {
        debugger;
        if(!e.target.value)
            return;
        let productToUpdate = this.state.products.findIndex(product => product.id == id);
        let items = this.state.products;
        let newProduct = items.at(productToUpdate);
        newProduct.quantity = e.target.value;
        items.splice(productToUpdate, 1, newProduct);
        this.setState({products:items}, () => localStorage.setItem("cart", JSON.stringify(this.state.products)));
    }

    displayItems = () => 
    {
        if(this.state.products.length < 1) {
            return(
                <div>
                    <h2>Your cart is empty</h2>
                    <a href="/">Visit our store</a>
                </div>
            )
        }
        this.state.products.map((product) => 
            {
                return(
                    <div key={product.id} className="row cart-item">
                        <div className="col-sm-1 d-flex align-items-center justify-content-center">
                            <button onClick={(e) => this.productRemove(product.id)} className="btn-close"></button>
                        </div>
                        <div className="col-sm-2">
                            <img className="product-img my-2" height="70%" src={product.img} />
                        </div>
                        <div className="col-sm-5">
                            <p className="product-name">{product.name}</p>
                        </div>
                        <div className="col-sm-2">
                            <p className="product-price"><b>€{product.price}</b></p>
                        </div>
                        <div className="col-sm-1">
                            <form className="inline-form product-quantity-form">
                                <input className="quantity" type="number" onChange={(e) => this.setQuantity(e)(product.id)} min="1" defaultValue={product.quantity}></input>
                            </form>
                        </div>
                    </div>
                )
            })
    }

    render()
    {
        return(
            <div>
                <div id="main-container" className="d-flex my-5">
                    <div id="cart">
                        <div className="container">
                            <div className="row mb-3">
                                <h1>My cart:</h1>
                            </div>
                            {this.displayItems()}
                        </div>
                    </div>
                    <div id="payment-container">
                            <div className="d-flex total-container">    
                                <h2>Total: </h2> <span id="total">€ {this.getTotal()}</span>
                            </div>
                            <p id="total-items">{this.getTotalItems()} Items</p>
                            <button id="btn-pay" className="mt-4">Pay now</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Cart 