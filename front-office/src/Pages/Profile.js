import {React, useEffect, useState} from "react";
import {TailSpin} from 'react-loader-spinner';
import "./profile.css";

export default function Profile() {
    const [profileInfo, setProfileInfo] = useState();
    const [bookings, setBookings] = useState();
    const [firstTime, setFirstTime] = useState(true);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        //Get profileInfo
        if(firstTime) {  
            console.log("fetching profile info");
            let userId = JSON.parse(localStorage.getItem("login")).id;
            fetch(`/db/element?id=${userId}&collection=users`)
            .then((res)=>res.json())
            .then((data) => setProfileInfo(data.result));
            setFirstTime(false);
        }        
    });
    
    useEffect(() => 
    {
        //Get bookings
        if(!bookings && profileInfo) {
            console.log("old bookings: " + bookings + ", fetching bookings");
            fetch(`/db/getUserBookings?id=${profileInfo._id}`)
            .then((res) => res.json())
            .then((data) => 
            {
                setBookings(data);
                setLoading(false);
            });
        }
    }, [profileInfo, bookings]);
    
    const displayPets = () => 
    {
        if(profileInfo.pets.length>0) 
        {
            return profileInfo.pets.map((pet) => 
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
            });
        } else {
            return(
                <div>
                    <h4 className="no-pet-alert">Add your pets <a href="/game/yourpets">here</a></h4>
                </div>
            )
        }
    }
        
    const deleteBooking = (e) => (booking) =>
    {
        // updating state bookings
        /*debugger;
        let deletedIndex = bookings.findIndex((arrBooking) => arrBooking._id == booking._id);
        let remainingBookings = [];
        remainingBookings = bookings;
        remainingBookings.splice(deletedIndex, 1);*/
        
        let obj = {
            collection: "bookings",
            id: booking._id
        }
        // Booking deletion
        fetch('/db/element', {
            method:'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }, 
            body: JSON.stringify(obj)
        }).then((res) => 
        {
            fetch(`/db/getUserBookings?id=${profileInfo._id}`)
            .then((res) => res.json())
            .then((data) => 
            {
                setBookings(data);
                setLoading(false);
            });
            debugger;
            fetch(`/db/element?collection=locations&id=${booking.location}`).then((res) => res.json())
            .then((data) =>
            {
                //service availability update
                let updatedLocation = data.result;
                let serviceList = updatedLocation.services;
                let updatedServiceName = booking.serviceName;
    
                // creaiamo un nuovo array disponibilità senza la data appena prenotata
                let newAvailability = [];
                serviceList.map((service) =>
                {
                    if(service.name == updatedServiceName)
                    newAvailability = service.availability;
                })
                newAvailability.push(booking.date);
                
                //togliamo il servizio che stiamo modificando dalla lista servizi
                let serviceIndex = serviceList.findIndex(service => service.name == updatedServiceName);
                serviceList.splice(serviceIndex, 1);
                // rimettiamo il servizio appena ricreato con la nuova disponibilità nella lista servizi
                let updatedService = {name: updatedServiceName, availability: newAvailability};
                serviceList.push(updatedService);
    
                //rimettiamo la lista servizi aggiornata nella location 
                updatedLocation.services = serviceList;
    
                //PUT della location con disponibilità servizi aggiornata
                fetch(`/db/element`, {method: "PUT",headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                    }, 
                    body: JSON.stringify({
                    collection: "locations", 
                    elem: updatedLocation
                    })
                });
            })
        })
        setLoading(true);
    }

    const displaySpinner = (bool) => 
    {
        return (
            <div className="mx-auto" id="spinner-container">
                <TailSpin height={100} width={100} ariaLabel="loading" visible={bool} color="rgb(186, 186, 186)"/> 
            </div>
        )
    }

    const displayBookings = () => 
    {
        if (bookings && !loading) 
        {
            if(bookings.length <= 0)
                return (
                    <div className="mt-4">
                        <h4 className="no-pet-alert">Book a service <a href="/services">here</a></h4>
                    </div>
                );
            else {
                return bookings.map((booking) => 
                {
                    return(
                        <div key={booking._id} className="booking-container">
                            <h4 className="booking-title">{booking.serviceName}</h4>
                            <p className="booking-date">{booking.date} at {booking.locationName}</p>
                            <button className="btn-booking-del" onClick={(e) => deleteBooking(e)(booking)}>Cancel</button>
                        </div>
                    )
                })
            }
        }
        else {
            return (
                <div></div>
            );
        }
    }
    
    if(profileInfo == null)
        return (
            <div>
            </div>
        )
    return (
        <div className="profile-container">
            <div id="profile-header">
                <h1 id="username">{profileInfo.username}</h1>
                <h2 id="email">{profileInfo.email}</h2>
            </div>
            <div className="container mt-5" id="info-container">
                <div className="row align-items-center">
                    {displayPets()}
                </div>
                <div className="row mt-4">
                    <h3>My Bookings:</h3>
                    {displaySpinner(loading)}
                    {displayBookings()}
                </div>
            </div>
        </div>
    )
}