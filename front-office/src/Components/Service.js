import React from 'react'
import Calendar from 'react-calendar';
import {toast} from 'react-toastify';
import 'react-calendar/dist/Calendar.css';
import './Service.css'

class Service extends React.Component {

  constructor(props){
    super(props);
    let date = null;
    let service = null;
    let location = null;
    this.state = {service: service, date: date, location: location};
  }

  componentDidUpdate(){
    if(this.props.service != this.state.service)
      this.setState({service: this.props.service});
    if(this.props.location != this.state.location)
      this.setState({location: this.props.location});
  }

  makeStandardDate(date){
    let newDate = date.getFullYear();
    if([...Array(10).keys()].includes(date.getMonth()+1))
      newDate += '-' + '0' + (date.getMonth()+1);
    else
      newDate += '-' + (date.getMonth()+1) ;
    if([...Array(10).keys()].includes(date.getDate()))
      newDate += '-' + '0' + (date.getDate());
    else
      newDate += '-' + (date.getDate());
    return newDate;
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
    let formattedDate = this.makeStandardDate(date);
    let newBooking = {
      userId: JSON.parse(localStorage.getItem("login")).id,
      serviceId: this.state.service._id,
      serviceName: this.state.service.name,
      date: formattedDate,
      location: this.state.location
    };
    
    // POST NEW BOOKING
    fetch("http://localhost:8000/db/element", {method: "POST", headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      }, 
      body: JSON.stringify({ 
        collection: "bookings", 
        elem: newBooking
      })
    });

    // UPDATE LOCATION SERVICE AVAILABILITY
    let updatedLocation = this.state.location;
    let serviceList = updatedLocation.services;
    let updatedServiceName = this.state.service.name;
    //togliamo il servizio che stiamo modificando dalla lista servizi
    let serviceIndex = serviceList.findIndex(service => service.name == updatedServiceName);
    serviceList.splice(serviceIndex, 1);
    // creaiamo un nuovo array disponibilità senza la data appena prenotata
    let newAvailability = [];
    serviceList.map((service) =>
    {
      if(service.name = updatedServiceName)
        newAvailability = service.availability;
    })
    let dateIndex = newAvailability.findIndex(date => date==formattedDate);
    newAvailability.splice(dateIndex, 1);
    // rimettiamo il servizio appena ricreato con la nuova disponibilità nella lista servizi
    let updatedService = {name: updatedServiceName, availability: newAvailability};
    serviceList.push(updatedService);
    //rimettiamo la lista servizi aggiornata nella location 
    updatedLocation.services = serviceList;

    // Facciamo finalmente la put al server
    fetch(`http://localhost:8000/db/element`, {method: "PUT",headers: {
      'Content-type': 'application/json',
      'Accept': 'application/json'
      }, 
      body: JSON.stringify({
        collection: "locations", 
        elem: updatedLocation
      })})
      .then((res)=>{
        fetch(`http://localhost:8000/db/element?id=${this.state.location._id}&collection=locations`, {method: "GET"})
        .then((res) => res.json).then((data) => 
        {
          data.result.services.map((service) =>
          {
            if(this.state.service.name == service.name)
              this.setState({service: service});
          })  
        });
      });
    toast(`${this.state.service.name} booked for ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`)
  }

  displayCalendar() 
  {
    let availability;
    this.state.location.services.map((service) => 
    {
      if(service.name == this.state.service.name)
        availability = service.availability;
    });
    return (
      <Calendar
          onChange={(value, e) => {this.setState({date:value})}}
          minDetail='month'
          minDate={new Date()} 
          tileDisabled={({date})=> !availability.includes(this.makeStandardDate(date))} 
      />
    )
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
              <p className="service-price">€ {this.state.service.price}</p>
              <form id="booking-form" className='d-flex flex-column'>
                <div className='d-flex'>
                  {this.displayCalendar()}
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