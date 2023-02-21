import React from 'react'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Service.css'

export default function Service(props) {

  if(props.short == true)
    return (
      <div className="d-flex service-container">
        <div className="service-img">
          <img width="100%" src={props.service.img} />
        </div>
        <div className="service-body-container">
          <h4 className="service-name">{props.service.name}</h4>
          <p className="service-desc">{props.service.desc}</p>
          <p className="service-price">{props.service.price}</p>
          <p className='availability'>Available slots on
            {props.service.availability.map((day, i) => 
            {
              
            })}
          </p>
          <button className="service-btn">Book Now</button>
        </div>
      </div>
    )
  else {
    return (
      <div className='d-flex service-container'>
        <div className="service-img">
          <img width="100%" src={props.service.img} />
        </div>
        <div className="service-body-container">
          <h4 className="service-name">{props.service.name}</h4>
          <p className="service-desc">{props.service.desc}</p>
          <p className="service-price">{props.service.price}</p>
          <form id="booking-form">
            <div>
              <Calendar 
                minDetail='month'
                minDate={new Date()} 
                tileDisabled={({date})=> !props.service.availability.includes(`${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`)} 
              />            
              <label className='label-select' htmlFor="time-slot-select">Select Time Slot:</label>
              <select name="time-slot-select" className="time-slot-select">
              </select>
            </div>

            <button className="book-btn">Book Now</button>
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