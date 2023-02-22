import React, { useEffect, useState } from "react";
import Service from "../Components/Service.js"

export default function ServiceDisplay(props) 
{
    const [services, setServices] = useState(fetch(`/db/collection?collection=services`)
                                    .then((res)=> res.json()).then((data) => data.result));

    return(
        <>
        <div id="service-container" className="mx-5 mt-5">
            {services.map((service) => 
            {
                return <Service key={service._id} short={false} service={service}/>
            })}
        </div>
        </>
    )
}