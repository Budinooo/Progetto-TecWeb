import React from "react";
import Service from "../Components/Service.js"
import './serviceDisplay.css'

class ServiceDisplay extends React.Component 
{
    constructor(props) {
        super(props);
        let services = null;
        let locations = null;
        this.state = {services: services, displayedServices: services, locations: locations};
    }

    componentDidMount() 
    {
        fetch(`/db/collection?collection=services`)
        .then((res)=> res.json()).then((data) => {
            this.setState({services: data.result, displayedServices: data.result})
        });
        fetch('/db/collection?collection=locations')
        .then((res)=> res.json()).then((data) => this.setState({locations: data.result}));
    }

    displayLocations()
    {
        return this.state.locations?.map((location) =>
        {
            return (
                <option key={location._id} value={location._id}>{location.name}</option>
            )
        })
    }

    displayServiceUsingLocation(e)
    {
        let newServices = [];
        let selectedLocation;
        this.state.locations.map((location) =>
        {
            if(location._id == e.target.value)
                selectedLocation = location.name;
        })
        this.state.services.map((service) =>
        {
            if(service.locations.includes(selectedLocation))
                newServices.push(service);
        })
        this.setState({displayedServices: newServices}, () => this.forceUpdate());
    }

    render(){
        if(this.state.services == null) 
            return (<div></div>);
        return(
            <div className="p-5">
                <div id="filter-container">
                    <h2>Choose a location:</h2>
                    <select value={"0"} onChange={(e) => this.displayServiceUsingLocation(e)} id="location-select">
                        <option value={"0"}>SELECT A LOCATION</option>
                        {this.displayLocations()}
                    </select>
                </div>                
                <div id="service-container">
                    {this.state.displayedServices.map((service) => 
                    {
                        return <Service key={service._id} short={false} service={service}/>
                    })}
                </div>
            </div>
        )
    }
}

export default ServiceDisplay;