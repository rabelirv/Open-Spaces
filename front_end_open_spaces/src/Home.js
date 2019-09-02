import React from 'react';
import './Home.css';
import SearchBar from "./components/SearchBar";
import Geocode from "react-geocode";
import io from 'socket.io-client';
import config from './config';
import Popup from 'react-popup';
import { withRouter } from 'react-router-dom';


Geocode.setApiKey("AIzaSyDS7fqSLY5L2xuXAb8cIb1vyQRKt5EPXmw");

class Home extends React.Component{
  socket = {};

  constructor(){
    super()
    this.state = {
      addresses:[],
      distance:"",
      parkingSpots:[]
    }
    this.socket = io(config.api).connect()

  }

  componentDidMount(){
    this.socket.on('server:message', (data)=>{
      console.log("Server Message",data);
      let distanceMatrix = this.props.google.maps.DistanceMatrixService.prototype
      distanceMatrix.getDistanceMatrix({
    origins: [this.props.currentLocation],
    destinations: [data.currentLocation],
    travelMode: 'DRIVING',
    unitSystem:this.props.google.maps.UnitSystem.IMPERIAL
  },(res, status)=>{
    if (status === "OK") {
      this.setState({...this.state.addresses,distance:res.rows[0].elements[0].distance.value})
      if (data.fromRentee && this.state.distance <= 8046.72) {
        this.promptUser(data)
      }else if(data.address !== undefined && data.fromRentor){
        this.confirmParkingSpot(data)
      }
    } else {
      console.error("status:",status)
    }
  }
  )
    if (data.address !== undefined && data.fromRentor) {
      this.confirmParkingSpot(data)
    }

    this.props.getSocket(this.socket)
  })

}


  withinRegion = (point,position, radius) => {
    const google = window.google
        const to = new google.maps.LatLng(position.lat, position.lng);
        const distance = google.maps.geometry.spherical.computeDistanceBetween;
          const from = new google.maps.LatLng(point.lat, point.lng);
          console.log(distance(from,to), radius)
          return distance(from, to) <= radius;
      }

  addAddress =(address)=>{
      this.setState({ addresses:[...this.state.addresses,address] })
    }


    promptUser = (data)=>{
      let goToParkingForm = ()=>this.props.history.push('/parkingform')
      Popup.create({
      title: null,
      content: `A User is requesting a Parking Spot at ${data.address}! Do you accept?`,
      buttons: {
          left: [{
              text: '👎',
              action: function () {
                  Popup.close();
              }
          }],
          right: [{
              text: '👍',
              action: function () {
                Popup.close()
                  // Passing true as the second argument to the create method
                  // displays it directly, without interupting the queue.
                  goToParkingForm()
                  Popup.create({
                      title: null,
                      content: 'We are waiting for the Rentee to confirm!',
                      buttons: {
                          left: [{
                            text:'👍',
                            action:()=>{
                              Popup.close()
                            }

                          }],
                      }
                  });
              }
          }]
      }
  });
    }

    confirmParkingSpot = (data)=>{
      let  addParkingSpot = (spot)=> this.setState({...this.state,parkingSpots:[...this.state.parkingSpots,spot]})
      let goToMap = ()=>this.props.history.push('/map')
      let getParkingSpot = (locationObject)=>this.props.getParkingSpot(locationObject)
      console.log("socket",data);
      Popup.create({
      title: null,
      content: `A Rentor has found ${data.spotsNum} at ${data.address}, is this ok?`,
      buttons: {
          left: [{
              text: '👎',
              action: function () {
                  Popup.close();
              }
          }],
          right: [{
              text: `👍`,
              action: function () {
                  // Passing true as the second argument to the create method
                  // displays it directly, without interupting the queue.
                  goToMap()
                  let parkingObject = {}
                  Geocode.fromAddress(data.address).then(
                    response => {
                      const {
                        lat,
                        lng
                      } = response.results[0].geometry.location;
                      getParkingSpot({lat, lng})
                      parkingObject.parkingSpot = {lat, lng}
                      parkingObject.fromRentor = true
                      addParkingSpot(parkingObject)
                    },
                    error => {
                      console.error(error);
                    }
                  );
                  Popup.close()
                  Popup.create({
                      title: null,
                      content: 'Here is your parking spot, start walking towards it!',
                      buttons: {
                          left: [{
                            text:'👍',
                            action: ()=>{
                              Popup.close()
                            }
                          }]
                      }
                  });
              }
          }]
      }
  })
    }

  findParking = (input)=>{
    Geocode.fromAddress(input).then(
  response => {
    const locationObject = response.results[0].geometry.location;
    console.log("locationObject",locationObject);
    this.addAddress(locationObject)
    locationObject.fromRentee = true;
    locationObject.address = input
    locationObject.currentLocation = this.props.currentLocation
    this.socket.emit('client:message', locationObject)

  },
  error => {
    console.error(error);
  }
);
  }
render(){
  console.log(this.state.parkingSpots)
  return (
      <div className="home-container">
      <header className='header'>
            <div className="header__logo-box">
            </div>
            <div className="header__text-box">
              <h1 className="heading-primary">
                <span className="heading-primary--main">Open Spaces</span>
                <span className="heading-primary--sub">Find Parking</span>
              </h1>
              <SearchBar findParking={this.findParking}/>
            </div>
            <br/>
            </header>
      </div>
    );
  }

}

export default withRouter(Home);
