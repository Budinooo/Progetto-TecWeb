import React, { useState } from 'react'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Service.css'

export default function Service(props) {

  const [date, setdate] = useState(null);
  const [service, setservice] = useState(props.service);
  
  const book = (date) => (e) =>  
  {
    e.preventDefault();
    if(date == null){
      alert("Select a date");
      return;
    }
    let logged =JSON.parse(localStorage.getItem("login")).islogged;
    if(!logged)
    {
      alert("Please log in");
      return;
    }
    let formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    let newBooking = {
      userId: JSON.parse(localStorage.getItem("login")).id,
      serviceId: service._id,
      date: formattedDate
    };

    fetch("/db/element", {method: "POST", headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      }, 
      body: JSON.stringify({ 
        collection: "bookings", 
        elem: newBooking
      })
    });

    let updatedService = service;
    let dateIndex = updatedService.availability.findIndex(date => date==formattedDate);
    updatedService.availability.splice(dateIndex, 1);

    fetch(`/db/element`, {method: "PUT",headers: {
      'Content-type': 'application/json',
      'Accept': 'application/json'
      }, 
      body: JSON.stringify({
        collection: "services", 
        elem: updatedService
      })})
      .then((res)=>{
        fetch(`/db/element?id=${service._id}&collection=services`, {method: "GET"})
        .then((res) => res.json).them((data) => setservice(data.result));
      });
    alert('prenotazione avvenuta con successo')
  }
  
  if(props.short == true)
    return (
      <div className="d-flex service-container">
        <div className="service-img">
          <img width="100%" src={service.img} />
        </div>
        <div className="service-body-container">
          <h4 className="service-name">{service.name}</h4>
          <p className="service-desc">{service.desc}</p>
          <p className="service-price">{service.price}</p>
          <p className='availability'>Available slots on
          </p>
          <button className="service-btn">Book Now</button>
        </div>
      </div>
    )
  else {
    return (
      <div className='d-flex service-container'>
        <div className="service-img">
          <img width="100%" src={service.img} />
        </div>
        <div className="service-body-container">
          <h4 className="service-name">{service.name}</h4>
          <p className="service-desc">{service.desc}</p>
          <p className="service-price">{service.price}</p>
          <form id="booking-form" className='d-flex flex-column'>
            <div className='d-flex'>
              <Calendar
                onChange={(value, e) => {setdate(value)}}
                minDetail='month'
                minDate={new Date()} 
                tileDisabled={({date})=> !service.availability.includes(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)} 
              />            
            </div>
            <button onClick={(e) => book(date)(e)} className="mx-auto book-btn">Book Now</button>
          </form>      
        </div>
      </div>
    )
  }
}


/*            {props.service.days.map((day, i) => 
            {
              if(day){
                let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                let res = " " + weekdays[i];
                if(i>0)
                  res = "," + res;
                return (res);
              }
            })}*/