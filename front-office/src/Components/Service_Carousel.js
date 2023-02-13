import React, { useState } from 'react';
import Service from './Service.js';
import Carousel from 'react-bootstrap/Carousel';

function Service_Carousel() {
    const [services, setServices] = useState(0);
    


    return(
        <Carousel>
            <Carousel.Item>
                {
                    state.services.map((service) => 
                    {
                        return(
                            <Service props={service} />
                        )
                    })
                }
            </Carousel.Item>
        </Carousel>
    )
}