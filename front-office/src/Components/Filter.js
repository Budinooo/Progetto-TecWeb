import React from "react";
import './Filter.css'

class Filter extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return(
            <div className="filters">
                <div className='filter w-100 container'>
                    <div><b>Category</b></div>
                    <div data-bs-toggle="collapse" data-bs-target="#collapseDog" aria-expanded="false" aria-controls="collapseDog"> Dog</div>
                    <div className="collapse" id="collapseDog">
                        <div className="card card-body">
                            Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.
                        </div>
                    </div>
                    <div data-bs-toggle="collapse" data-bs-target="#collapseCat" aria-expanded="false" aria-controls="collapseCat"> Cat</div>
                    <div className="collapse" id="collapseCat">
                        <div className="card card-body">
                            Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.
                        </div>
                    </div>
                    <div data-bs-toggle="collapse" data-bs-target="#collapseBird" aria-expanded="false" aria-controls="collapseBird"> Bird</div>
                    <div className="collapse" id="collapseBird">
                        <div className="card card-body">
                            Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.
                        </div>
                    </div>
                </div>
            </div>
        );
            
    }
}

export default Filter 