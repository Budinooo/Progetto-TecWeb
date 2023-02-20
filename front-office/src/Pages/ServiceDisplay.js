import React, { useEffect, useState } from "react";
import Service from "../Components/Service.js"

export default function ServiceDisplay(props) 
{
    const [services, setServices] = useState([{id: 1, img: "https://larchmontvillagevet.com/wp-content/uploads/2019/02/grooming-lab-bath-1024x682.jpg", name: "Grooming", desc: "A Full Groom Includes: Pre bath brush, bath with your choice of shampoo conditioner all available in our blue room, ear cleansing, fluff up warm blow dry by hand with brush styling, pawdicure (hair clip, nail clip and file), eye stain removal, scissor cut to breed specific styling or your own style preference, your choice of cologne from the blue room, hair Accessory. PLEASE NOTE - Additional costs apply for parasites present/ heavily soiled or matted coats/ difficult / aggressive behaviour. Final cost is dependent on the complexity of the groom and how long it takes. ", price: "10€/h", availability:["20-2-2023","21-2-2023","22-2-2023"]}]);

    return(
        <>
        <div id="service-container" className="mx-5 mt-5">
            {services.map((service) => 
            {
                return <Service key={service.id} short={false} service={service}/>
            })}
        </div>
        </>
    )
}