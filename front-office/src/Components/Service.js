import React from 'react'
import './Service.css'

function disableDays()

export default function Service(props) {

  const today = new Date().toLocaleDateString();

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
            {props.service.days.map((day, i) => 
            {
              if(day){
                let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                let res = " " + weekdays[i];
                if(i>0)
                  res = "," + res;
                return (res);
              }
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
            <select name="time-slot-select">

            </select>
            <input type="date">{}</input>
            <button className="service-btn">Book Now</button>
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