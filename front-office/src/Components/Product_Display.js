import React from "react";
import Product from "./Product";

class Product_Display extends React.Component 
{
    constructor(props) 
    {
        super(props);
        this.state = props.productList;
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