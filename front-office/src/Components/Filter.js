import React from "react";
import './Filter.css';
import {Collapse} from 'react-bootstrap';

class Filter extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            min: 0,
            max:100,
            dogSubfilter: false,
            catSubfilter: false,
            birdSubfilter: false,
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
                    <div className="category-filter">
                        <a className="subfilter" onClick={() => this.setState({dogSubfilter:!this.state.dogSubfilter})} type="button" role="button" aria-expanded="false" aria-controls="collapseDog"> Dog</a>
                        <Collapse id="collapseDog" in={this.state.dogSubfilter}>
                            <div className="collapsebody">
                                <a role="button" type="button" className="category-link" onClick={()=>this.props.applyCategory("dog","food")}>Food</a>
                                <a role="button" type="button" className="category-link" onClick={()=>this.props.applyCategory("dog","healthcare")}>Healthcare</a>
                                <a role="button" type="button" className="category-link" onClick={()=>this.props.applyCategory("dog","clothing")}>Clothing</a>
                            </div>
                        </Collapse>
                    </div>
                    <div className="category-filter">
                        <a className="subfilter" type="button" role="button" onClick={()=>this.setState({catSubfilter:!this.state.catSubfilter})} aria-expanded="false" aria-controls="collapseCat"> Cat</a>
                        <Collapse id="collapseCat" in={this.state.catSubfilter}>
                            <div className="collapsebody">
                                <a role="button" type="button" className="category-link" onClick={()=>this.props.applyCategory("cat","food")}>Food</a>
                                <a role="button" type="button" className="category-link" onClick={()=>this.props.applyCategory("cat","healthcare")}>Healthcare</a>
                            </div>
                        </Collapse>
                    </div>
                    <div className="category-filter">
                        <a className="subfilter" onClick={()=>this.setState({birdSubfilter: !this.state.birdSubfilter})} type="button" role="button" aria-expanded="false" aria-controls="collapseBird">
                            Bird
                        </a>
                        <Collapse id="collapseBird" in={this.state.birdSubfilter}>
                            <div className="collapsebody">
                                <a role="button" type="button" className="category-link" onClick={()=>this.props.applyCategory("bird","food")}>Food</a>
                            </div>
                        </Collapse>
                    </div>
                </div>
                <div className='filter w-100'>
                    <div className="titlef"><b>Price</b></div>
                    <div className="subfilter">
                        <label htmlFor="minf" className="form-label">Min: {this.state.min}€</label>
                        <input type="range" className="price-range" id="minf"></input>
                    </div>
                    <div className="subfilter">
                        <label htmlFor="maxf" className="form-label">Max: {this.state.max}€</label>
                        <input type="range" className="price-range" id="maxf"></input>
                    </div>
                    <div id="apply-container" className="subfilter">
                        <button id="btn-apply" onClick={()=>this.props.applyPrice(this.state.min,this.state.max)}>Apply</button>
                    </div>
                </div>
            </div>
        );
            
    }
}

export default Filter 