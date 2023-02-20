import React from "react";
import Product from "../Components/Product";

class Product_Display extends React.Component 
{
    constructor(props) 
    {
        super(props);
        debugger;
        fetch("products.json").then((res)=>{response.json(); console.log("fetch avvenuta")}).then((data)=>this.state = JSON.parse(data));
    }

    render() 
    {
        return(
            <div className="container">
                <div className="row">
                    {this.state.productList.map((product) => 
                    {
                        <div className="col-sm-4">
                            <Product key={product.id} product={product} />
                        </div>
                    })}
                </div>
            </div>
        )
    }
}

export default Product_Display