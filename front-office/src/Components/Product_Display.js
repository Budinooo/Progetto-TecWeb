import React from "react";
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
        document.getElementById("product"+this.props.product._id).addEventListener("mouseover", this.handleHover);
        document.getElementById("product"+this.props.product._id).addEventListener("mouseout", this.handleUnhover);
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        document.getElementById("product"+this.props.product._id).removeEventListener("mouseover", this.handleHover);
        document.getElementById("product"+this.props.product._id).removeEventListener("mouseout", this.handleUnhover);
        window.removeEventListener("resize", this.handleResize);
    }

    product = this.props.product;

    render() 
    {
        let id = "product"+this.props.product._id;
        return(
            <div id={id} className="container product">
                <div>
                    <div className="imgpContainer">
                        <img className="imgp" src={this.product.img}></img>
                    </div>
                    <div className={`${this.state.content ==  this.props.product.name? "namep" : "descp"}`}>
                        {this.state.content}
                    </div>
                </div>
                <div>
                    <div className="pricep"> {this.product.price}</div>
                    <button className='btn-add'>ADD TO CART</button>
                </div>
            </div>
        )
    }
}

export default Product_Display