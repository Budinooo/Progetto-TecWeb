import {React, useEffect, useState} from "react";
import 'mongoose';
import "./profile.css";
import mongoose from "mongoose";

export default function Profile() {
    const [profileInfo, setProfileInfo] = useState();
    const [bookings, setBookings] = useState();

    useEffect(() => {
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

    const deleteBooking = (booking) =>
    {
        let obj = {
            collection: "bookings",
            id: booking._id
        }
        console.log(obj);
        // Booking deletion
        fetch('http://localhost:8000/db/element', {
            method:'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }, 
            body: JSON.stringify(obj)
        });

        //service availability update
        let service;
        fetch(`http://localhost:8000/db/element?collection=services&id=${booking.serviceId}`).then((res) => res.json())
        .then((data) => {
            service = {collection: "services", elem: data.result};
            service.elem.availability.push(booking.date);
            fetch(`http://localhost:8000/db/element`, {
                method: "PUT",
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(service)
            });
        })
    }

    const displayBookings = () => 
    {
       if (bookings) 
       {
            return bookings.map((booking, i) => 
            {
                return(
                    <div key={booking._id} className="booking-container">
                        <h4>{booking.serviceName}</h4>
                        <p>{booking.date}</p>
                        <button className="btn-booking-del" onClick={(e) => deleteBooking(booking)}>Delete Booking</button>
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