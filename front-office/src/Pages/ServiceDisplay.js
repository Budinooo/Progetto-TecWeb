import React, { useEffect, useState } from "react";
import Service from "../Components/Service.js"

export default function ServiceDisplay(props) 
{
    const [services, setServices] = useState([{_id: 1, img: "https://larchmontvillagevet.com/wp-content/uploads/2019/02/grooming-lab-bath-1024x682.jpg", name: "Grooming", desc: "A Full Groom Includes: Pre bath brush, bath with your choice of shampoo conditioner all available in our blue room, ear cleansing, fluff up warm blow dry by hand with brush styling, pawdicure (hair clip, nail clip and file), eye stain removal, scissor cut to breed specific styling or your own style preference, your choice of cologne from the blue room, hair Accessory. PLEASE NOTE - Additional costs apply for parasites present/ heavily soiled or matted coats/ difficult / aggressive behaviour. Final cost is dependent on the complexity of the groom and how long it takes. ", price: "10€/h", availability:["2023-2-21","2023-2-22","2023-2-23"]},
    {_id: 2, img: "https://d.newsweek.com/en/full/340272/trexautopsy-030.jpg?w=790&f=97173f84ae48a1a131fb38bf93d7d861", name: "Dinosaur vet", desc: "Is your pet acting unusual? Come see our expert vet team trained on Isla Nublar. They're going to find the cause of your little friend's sickness and it will be back to normal once they're done! *We reserve the possibility of charging additional fees in case of dismemberment of staff or excessive animal size*", price: "200€/h", availability:["2023-2-21","2023-2-22","2023-2-23","2023-2-24","2023-2-27", "2023-2-28", "2023-3-1", "2023-3-2", "2023-3-3" ]}]);

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