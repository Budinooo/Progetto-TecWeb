import React from "react";
import Service from "../Components/Service.js"

class ServiceDisplay extends React.Component 
{
    constructor(props) {
        super(props);
        let services = [];
        this.state = {services};
        fetch(`http://localhost:8000/db/collection?collection=services`)
        .then((res)=> res.json()).then((data) => this.setState({services: data.result}));
    }

    render(){
        return(
            <div id="service-container" className="mx-5 mt-5">
                {this.state.services.map((service) => 
                {
                    return <Service key={service._id} short={false} service={service}/>
                })}
            </div>
        )
    }
}

export default ServiceDisplay;