import React from "react";
import './Filter.css'

class Filter extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            min: 0,
            max:100,
            screenWidth: window.innerWidth
        }
    }

    handleResize = () =>{
        this.setState({screenWidth: window.innerWidth});
    }

    handleChangeMin = () =>{
        this.setState({min: document.getElementById("minf").value});
    }

    handleChangeMax = () =>{
        this.setState({max: document.getElementById("maxf").value});
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
        document.getElementById("minf").addEventListener("change",this.handleChangeMin)
        document.getElementById("maxf").addEventListener("change",this.handleChangeMax)
        document.getElementById("minf").value = this.state.min;
        document.getElementById("maxf").value = this.state.max;
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
        document.getElementById("minf").removeEventListener("change", this.handleChangeMin);
        document.getElementById("maxf").removeEventListener("change", this.handleChangeMax);
    }

    render()
    {
        return(
            <div className={`filters container-fluid ${this.state.screenWidth<500 ? "w-100" : ""}`}>
                <div className='filter w-100'>
                    <div className="titlef"><b>Category</b></div>
                    <div className="subfilter" data-bs-toggle="collapse" data-bs-target="#collapseDog" aria-expanded="false" aria-controls="collapseDog"> Dog</div>
                    <div className="collapse" id="collapseDog">
                        <div className="collpasebody">
                            <div onClick={()=>this.props.applyCategory("dog","food")}>Food</div>
                            <div onClick={()=>this.props.applyCategory("dog","healthcare")}>Healthcare</div>
                            <div onClick={()=>this.props.applyCategory("dog","clothing")}>Clothing</div>
                        </div>
                    </div>
                    <div className="subfilter" data-bs-toggle="collapse" data-bs-target="#collapseCat" aria-expanded="false" aria-controls="collapseCat"> Cat</div>
                    <div className="collapse" id="collapseCat">
                        <div className="collpasebody">
                            <div onClick={()=>this.props.applyCategory("cat","food")}>Food</div>
                            <div onClick={()=>this.props.applyCategory("cat","healthcare")}>Healthcare</div>
                        </div>
                    </div>
                    <div className="subfilter" data-bs-toggle="collapse" data-bs-target="#collapseBird" aria-expanded="false" aria-controls="collapseBird"> Bird</div>
                    <div className="collapse" id="collapseBird">
                        <div className="collpasebody">
                            <div onClick={()=>this.props.applyCategory("bird","food")}>Food</div>
                        </div>
                    </div>
                </div>
                <div className='filter w-100'>
                    <div className="titlef"><b>Price</b></div>
                    <div className="subfilter">
                        <label htmlFor="minf" className="form-label">Min: {this.state.min}€</label>
                        <input type="range" className="form-range" id="minf"></input>
                    </div>
                    <div className="subfilter">
                        <label htmlFor="maxf" className="form-label">Max: {this.state.max}€</label>
                        <input type="range" className="form-range" id="maxf"></input>
                    </div>
                    <div className="subfilter">
                        <button onClick={()=>this.props.applyPrice(this.state.min,this.state.max)}>Apply Price</button>
                    </div>
                </div>
            </div>
        );
            
    }
}

export default Filter 