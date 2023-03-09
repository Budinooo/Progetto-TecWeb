import React from 'react'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Service.css'

class Service extends React.Component {

  constructor(props){
    super(props);
    let date = null;
    let service = null;
    this.state = {service: service, date: date};
  }

  componentDidUpdate(){
    if(this.props.service != this.state.service)
      this.setState({service: this.props.service})
  }

  book = (date) => (e) =>  
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
      serviceId: this.state.service._id,
      serviceName: this.state.service.name,
      date: formattedDate
    };
    
    // POST NEW BOOKING
    fetch("http://site212229.tw.cs.unibo.it/db/element", {method: "POST", headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      }, 
      body: JSON.stringify({ 
        collection: "bookings", 
        elem: newBooking
      })
    });

    let updatedService = this.state.service;
    let dateIndex = updatedService.availability.findIndex(date => date==formattedDate);
    updatedService.availability.splice(dateIndex, 1);

    // UPDATE SERVICE AVAILABILITY
    fetch(`http://site212229.tw.cs.unibo.it/db/element`, {method: "PUT",headers: {
      'Content-type': 'application/json',
      'Accept': 'application/json'
      }, 
      body: JSON.stringify({
        collection: "services", 
        elem: updatedService
      })})
      .then((res)=>{
        fetch(`http://site212229.tw.cs.unibo.it/db/element?id=${this.state.service._id}&collection=services`, {method: "GET"})
        .then((res) => res.json).then((data) => this.setState({service:(data.result)}));
      });
  }
  
  render() {
    if (this.state.service != null){
      if(this.props.short == true) {
        return (
          <div className="d-flex service-container">
            <div className="service-img">
              <img width="100%" src={this.state.service.img} />
            </div>
            <div className="service-body-container">
              <h4 className="service-name">{this.state.service.name}</h4>
              <p className="service-desc">{this.state.service.description}</p>
              <p className="service-price">{this.state.service.price}</p>
              <a className='more-btn' href="/services">LEARN MORE</a>
            </div>
          </div>
        )
      }
      else {
        return (
          <div className='d-flex service-container'>
            <div className="service-img">
              <img width="100%" src={this.state.service.img} />
            </div>
            <div className="service-body-container">
              <h4 className="service-name">{this.state.service.name}</h4>
              <p className="service-desc">{this.state.service.description}</p>
              <p className="service-price">{this.state.service.price}</p>
              <form id="booking-form" className='d-flex flex-column'>
                <div className='d-flex'>
                  <Calendar
                    onChange={(value, e) => {this.setState({date:value})}}
                    minDetail='month'
                    minDate={new Date()} 
                    tileDisabled={({date})=> !this.state.service.availability.includes(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)} 
                  />            
                </div>
                <button onClick={(e) => this.book(this.state.date)(e)} className="mx-auto book-btn">Book Now</button>
              </form>      
            </div>
          </div>
        )
      }
    }else{
      return null;
    }
  }
 
}

export default Service


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