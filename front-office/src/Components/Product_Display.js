import React from "react";
import {toast} from 'react-toastify';
import './Product_Display.css'

class Product_Display extends React.Component 
{
    constructor(props) 
    {
        super(props);
        this.state = {
            screenWidth: window.innerWidth,
            content: this.props.product.name
        }
    }

    handleResize = () =>{
        this.setState({screenWidth: window.innerWidth});
    }

    handleHover = () =>{
        this.setState({content:this.props.product.description})
    }

    handleUnhover = () =>{
        this.setState({content:this.props.product.name})
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    product = this.props.product;

    addToCart = (item) =>
    {
        let cart = JSON.parse(localStorage.getItem("cart"));
        let cartItem = cart.findIndex(i => i._id == item._id);
        if(cartItem>=0)
            cart.at(cartItem).quantity++;
        else {
            let newItem = {id:0, img:"", name:"", price:0, quantity:0};
            newItem._id = item._id;
            newItem.img = item.img;
            newItem.name = item.name;
            newItem.price = item.price;
            newItem.quantity = 1;
            cart.push(newItem);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        toast(`${item.name} added to cart`)
    }

    render() 
    {
        let id = "product"+this.props.product._id;
        return(
            <div id={id} className={`product ${this.state.screenWidth<500 ? "w-100 prodmob" : "col-sm-3"}`}>
                <div className="imgpContainer">
                    <img className="imgp" src={this.props.product.img}></img>
                </div>
                <div className={`${this.state.content ==  this.props.product.name? "namep" : "descp"}`}>
                    {this.state.content}
                </div>
                <div className="descp">
                    {this.props.product.description}
                </div>
                <div className="pricep"> €{this.props.product.price}</div>
                <button className='btn-add' onClick={()=>this.addToCart(this.props.product)}>ADD TO CART</button>
            </div>
        )
    }
}

export default Product_Display