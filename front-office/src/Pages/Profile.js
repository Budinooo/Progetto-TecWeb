import {React, useEffect, useState} from "react";
import "./profile.css";

export default function Profile() {
    const [profileInfo, setProfileInfo] = useState();
    const [bookings, setBookings] = useState();
    const [bookedServices, setBookedServices] = useState();
    const [didRender, setDidRender] = useState(false);

    useEffect(() => {
        setDidRender(true);
        setProfileInfo(null);
        let userId = JSON.parse(localStorage.getItem("login")).id;
        //Get profileInfo
        fetch(`http://localhost:8000/db/element?id=${userId}&collection=users`)
        .then((res)=>res.json())
            .then((data) => setProfileInfo(data.result));

        //Get bookings
        fetch(`http://localhost:8000/db/getUserBookings?id=${userId}`)
        .then((res) => res.json())
        .then((data) => 
        {
            console.log(data)
            setBookings(data);
        });
        
    },[]);

    useEffect(() => 
    {   
        if(didRender == true) {
            let services = [];
            console.log("2")
            
        }
    }, [bookings])

    const displayBookings = () => 
    {
       if (bookings && bookedServices) 
       {
            return bookings.map((booking, i) => 
            {
                return(
                    <div key={booking._id} className="booking-container">
                        <h4>{bookedServices[i]}</h4>
                        <p>{booking.date}</p>
                    </div>
                )
            })
       }
       else {
            return <div></div>;
       }
    }

    if(profileInfo == null)
        return (
            <div>
            </div>
        )
    else 
        return (
            <div className="profile-container">
                <div id="profile-header">
                    <h1 id="username">{profileInfo.username}</h1>
                    <h2 id="email">{profileInfo.email}</h2>
                </div>
                <div className="container mt-5" id="info-container">
                    <div className="row align-items-center">
                    {profileInfo.pets.map((pet) => 
                        {
                            return(
                                <div key={profileInfo.id + pet.name} className="pet-container col-md-3 col-sm-6 d-flex align-items-center">
                                    <div className="pet-icon">
                                        {pet.icon}
                                    </div>
                                    <div className="pet-name-container h-25">
                                        <p className="pet-name m-0">{pet.name}</p>
                                    </div>
                                    <div className="ms-auto edit-btn">
                                        <a href="/game/yourpets"><img src="http://cdn.onlinewebfonts.com/svg/img_202435.png" /></a>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="row mt-4">
                        <h3>My Bookings:</h3>
                        {displayBookings()}
                    </div>
                </div>
            </div>
        )
}