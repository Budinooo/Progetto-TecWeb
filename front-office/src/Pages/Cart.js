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
        const products = [{id: 1, img: 'https://www.ideashoppingcenter.it/files/archivio_Files/Foto/44645_2.JPG', 
        name: 'croccantini', price: '99.99', quantity: '1'},{id: 2, img: 'https://www.loradeglianimali.it/22047-large_default/flexi-original-new-classic-guinzaglio-acorda-5-mt-per-cani-m.jpg', 
        name: 'guinzaglio', price: '99.99', quantity: '1'},{id: 3, img: 'https://www.isoladeitesori.it/dw/image/v2/BGRZ_PRD/on/demandware.static/-/Sites-it-master-catalog/default/dwaada2229/176032.jpg?sw=400&sh=400',
        name: 'Shampoo Petup Mousse Delicata', price:'8.99', quantity: '2'},{id: 4, img: 'https://www.isoladeitesori.it/dw/image/v2/BGRZ_PRD/on/demandware.static/-/Sites-it-master-catalog/default/dwd0f06e10/idt/142719_1_1.jpg?sw=400&sh=400',
        name: 'NaturalPet Ghiotto Chef', price: '0.99', quantity: '1'}, {id: 5, img: 'https://www.isoladeitesori.it/dw/image/v2/BGRZ_PRD/on/demandware.static/-/Sites-it-master-catalog/default/dw697e1d01/162528.jpg?sw=400&sh=400',
        name: 'Petup Cuscino Ovale Natalizio', price: '8.99', quantity: '4'}]
        this.state = {products, services};
    }

    productRemove = (id) => 
    {
        let productToRemove = this.state.products.findIndex(product => product.id == id);
        let remainingProducts = this.state.products;
        remainingProducts.splice(productToRemove,1);
        this.setState({products: remainingProducts}, () => console.log(this.state.products));
    };

    getTotal = () => 
    {
        let sum=0;
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
        let productToUpdate = this.state.products.findIndex(product => product.id == id);
        let items = this.state.products;
        let newProduct = items.at(productToUpdate);
        newProduct.quantity = e.target.value;
        items.splice(productToUpdate, 1, newProduct);
        this.setState(items);
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
                            {this.state.products.map((product) => 
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
                            })}
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