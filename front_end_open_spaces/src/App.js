import React from 'react';
import Home from './Home'
import './App.css';
import NavBar from './components/NavBar'
import SignUp from './components/SignUp'
import Profile from './components/Profile'
import MapView from './components/MapView'
import ParkingForm from './components/ParkingForm'
import {Switch, Route, Redirect} from 'react-router-dom'
import Popup from 'react-popup';
import HttpsRedirect from 'react-https-redirect';
import {GoogleApiWrapper} from 'google-maps-react';
import axios from 'axios';
import Pusher from 'pusher-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class App extends React.Component {
  constructor(){
    super()
    this.state = {
      user: null,
      parkingSpots: [],
      currentLocation:{lat:40.73,lng:-73.93},
      locations:{},
      users_online:[],
      current_user:'',
      isRentor: false,
      socket: {},
      recenterMap: null,
      radius: 365.7600
    }
  }

  componentDidMount(){
    let pusher = new Pusher("79c071887a3fc9980665", {
      authEndpoint: "https://open-spaces-locationserver.herokuapp.com/pusher/auth",
      cluster:"us2"
    })
    this.presenceChannel = pusher.subscribe('presence-channel');
    this.presenceChannel.bind('pusher:subscription_succeeded', members=>{
      this.setState({
        users_online:members.members,
        current_user:members.myID
      });
      this.getLocation();
      this.notify();
    })

    this.presenceChannel.bind('location-update', body =>{
      this.setState((prevState, props)=>{
        const newState = {...prevState}
        newState.locations[`${body.username}`] = body.location;
        return newState
      });
    });

    this.presenceChannel.bind('pusher:member_removed', member =>{
      this.setState((prevState, props) =>{
        const newState = {...prevState};
        // remove member location once they go offline
        delete newState.locations[`${member.id}`];
        // delete member from the list of online users
        delete newState.users_online[`${member.id}`];
        return newState;
      })
      this.notify()
    })

    this.presenceChannel.bind('pusher:member_added', member =>{
      this.notify()
    })
  }
  removeSpot = ()=>{
    this.setState({parkingSpots:[]})
  }

  getLocation = ()=>{
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(position =>{
        let location = {lat: position.coords.latitude, lng: position.coords.longitude};
        this.setState((prevState,props)=>{
          let newState = {...prevState};
          newState.currentLocation = location;
          newState.locations[`${prevState.current_user}`] = location;
          return newState
        });
        axios.post("https://open-spaces-locationserver.herokuapp.com/update-location",{
          username:this.state.current_user,
          location: location
        }).then(res =>{
          if (res.status === 200) {
            console.log("new location updated successfully");
          }
        });
      })
    }else {
      alert("Sorry, gelocation is not avilable on this device. You need that to use this app.")
    }
  }
  notify = () => toast(`Users online : ${Object.keys(this.state.users_online).length}`,{
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    type: 'info'
  })


  getParkingSpot = (spot) =>{
    this.setState({
      parkingSpots:[...this.state.parkingSpots, spot]})
  }

  getSocket = (socket)=>{
    this.setState({socket: socket})
  }
  grabRecenter = (func)=>{
    this.setState({
      recenterMap: func
    })
  }

  logOut = () => {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token')
      this.setState({user: null})
    } else {
      return null
    }
  }

  createNewUser = (user) => {
    fetch('https://open-spaces-api.herokuapp.com/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({user})
    }).then(res => res.json()).then(res => {
      localStorage.setItem("token", res.jwt)
      this.setState({user: res.user})
      this.getProfile(res.jwt)
    }).then(res => <Redirect to="/"/>).catch(err => console.log(err))
  }

  logIn = (user) => {
    fetch('https://open-spaces-api.herokuapp.com/api/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({user})
    }).then(res => res.json()).then(res => {
      localStorage.setItem("token", res.jwt)
      this.setState({user: res.user})
      this.getProfile(res.jwt)
    }).catch(err => console.log(err))

  }

  getProfile = (token) => {
    fetch('https://open-spaces-api.herokuapp.com/api/v1/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => res.json()).then(res => this.setState({user: res.user}))
  }

  render() {
    console.log("Current  location", this.state.currentLocation);
    return (<div className="app-container">
    <HttpsRedirect>
      <NavBar user={this.state.user} logOut={this.logOut} recenterMap={this.state.recenterMap}/>
      <ToastContainer/>
      <Popup />
      <Switch>
        <Route exact="exact" path='/' render={() => <Home google={this.props.google}getParkingSpot={this.getParkingSpot} radius={this.state.radius}currentLocation={this.state.currentLocation}isRentor={this.state.isRentor} getSocket={this.getSocket}/>}/>
        <Route exact="exact" path='/parkingform' render={() => <ParkingForm getParkingSpot={this.getParkingSpot} socket={this.state.socket}/>}/>
        <Route exact="exact" path='/map' render={() => <MapView removeSpot={this.removeSpot}grabRecenter={this.grabRecenter}parkingSpots={this.state.parkingSpots} radius={this.state.radius}center={this.state.currentLocation} />}/>
        <Route exact="exact" path='/signup' render={() =>< SignUp createNewUser = {
            this.createNewUser
          } />}/>
        <Route exact="exact" path='/profile' render={() =>< Profile user = {
            this.state.user
          } />}/>
      </Switch>
      </HttpsRedirect>
    </div>);
  }

}

export default GoogleApiWrapper({apiKey: "AIzaSyDS7fqSLY5L2xuXAb8cIb1vyQRKt5EPXmw"})(App);
