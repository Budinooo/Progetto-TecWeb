import React from "react";
import Service from "../Components/Service.js"
import './serviceDisplay.css'

class ServiceDisplay extends React.Component 
{
    constructor(props) {
        super(props);
        let services = null;
        this.state = {services};
    }

    componentDidMount() 
    {
        fetch(`http://localhost:8000/db/collection?collection=services`)
        .then((res)=> res.json()).then((data) => this.setState({services: data.result}));
    }

    displayLocations()  
    {
        fetch('http://localhost:8000/db/collection?collection=locations').then((res) => res.json())
        .then((data) => 
        {
            return data.result.map((location) => 
            {
                return( <option>{location.name}</option> );
            });
        })
    }

    render(){
        if(this.state.services == null) 
            return (<div></div>);
        return(
            <div className="p-5">
                <div id="filter-container">
                    <h2>Choose a location:</h2>
                    <select id="location-select">
                        {this.displayLocations()}
                    </select>
                </div>                
                <div id="service-container">
                    {this.state.services.map((service) => 
                    {
                        return <Service key={service._id} short={false} service={service}/>
                    })}
                </div>
            </div>
        )
    }
}

export default ServiceDisplay;