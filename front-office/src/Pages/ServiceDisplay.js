import React from "react";
import Service from "../Components/Service.js"
import './serviceDisplay.css'

class ServiceDisplay extends React.Component 
{
    constructor(props) {
        super(props);
        let services = null;
        let locations = null;
        this.state = {services: services, displayedServices: services, locations: locations, selectedLocation: null, screenWidth: null};
    }

    componentDidMount() 
    {
        this.setState({screenWidth: window.innerWidth});
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
        let selectedLocation = null;
        // getting selected location
        this.state.locations.map((location) =>
        {
            if(location._id == e.target.value)
                selectedLocation = location;
        })
        // getting all services names supported by the selected location
        let serviceNames = [];
        selectedLocation?.services.map((service) =>
        {
            serviceNames.push(service.name);
        })
        // getting the services from the entire service list which name is inside the list of names supported by the selected location
        this.state.services.map((service) =>
        {
            if(serviceNames.includes(service.name))
                newServices.push(service);
        })
        this.setState({displayedServices: newServices, selectedLocation: selectedLocation}, () => this.forceUpdate());
    }

    displayServices()
    {
        if(this.state.selectedLocation != null) {
            return this.state.displayedServices.map((service) => 
            {
                return <Service key={service._id} location={this.state.selectedLocation} short={false} service={service}/>
            })
        }
        else 
            return (
                <h2 id="no-location-alert">Please select a location</h2>
            )
    }

    render(){
        if(this.state.services == null) 
            return (<div></div>);
        return(
            <div className={`p-5 ${this.state.screenWidth < 500? "mobile-service-display" : ""}`}>
                <div id="filter-container">
                    <h2>Choose a location:</h2>
                    <select name="location selection" defaultValue={"0"} onChange={(e) => this.displayServiceUsingLocation(e)} id="location-select">
                        <option value={"0"}>SELECT A LOCATION</option>
                        {this.displayLocations()}
                    </select>
                </div>                
                <div id="service-container">
                    {this.displayServices()}
                </div>
            </div>
        )
    }
}

export default ServiceDisplay;