import React from 'react';
import {GoogleApiWrapper, Marker, InfoWindow} from 'google-maps-react';
import CurrentLocation from './CurrentLocation';
import Popup from 'react-popup';

class MapView extends React.Component {
  state = {
    showingInfoWindow: {},
    activeMarker: {},
    selectedPlace: {}
  }
  static defaultProps = {
    zoom: 8
  }

  checkDistance = ()=>{
    console.log("Number of Parking Spots",this.props.parkingSpots.length);
    if(this.props.parkingSpots.length>=1){
      const within = this.withinRegion(this.props.parkingSpots[0],this.props.center,this.props.radius)
      console.log("within",within);
      if (within) {
        this.alertUser()
      }
    }
  }

  withinRegion = (point,position, radius) => {
    const google = window.google
        const to = new google.maps.LatLng(position.lat, position.lng);
        const distance = google.maps.geometry.spherical.computeDistanceBetween;
          const from = new google.maps.LatLng(point.lat, point.lng);
          console.log(distance(from,to), radius)
          return distance(from, to) <= radius;
      }

  onMarkerClick =(props, marker, e)=>{
    this.setState({
      selectedPlace:props,
      activeMarker: marker,
      showingInfoWindow: true
    })
  }

  onClose = (props)=>{
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker:null
      })
    }
  }

  alertUser = ()=>{
    console.log("hit alertUSer!");
    Popup.create({
      title:"All Done!",
      content: "You've arrived at your parking spot!",
      buttons:{
        left:[{
          text:"👍",
          action:()=>{
            this.props.removeSpot()
            Popup.close()
          }
        }]

      }
    })
  }


  render(){
    console.log(this.props.parkingSpots);
    let parkingSpots= this.props.parkingSpots.map(spot=> <Marker name={'Kenyatta International Convention Centre'} onClick={this.onMarkerClick}position={{lat:spot.lat, lng:spot.lng}}/>)
    return(
        <CurrentLocation
        center = {this.props.center}
        grabRecenter={this.props.grabRecenter}
          centerAroundCurrentLocation
          google={this.props.google}
        >
        {this.checkDistance()}
          <Marker name={'You Are Here'} onClick={this.onMarkerClick} position={this.props.center}/>
          {parkingSpots}
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.onClose}
          >
            <div>
              <h4>{this.state.selectedPlace.name}</h4>
            </div>
          </InfoWindow>
        </CurrentLocation>
    )
  }
}

export default GoogleApiWrapper({apiKey: "AIzaSyDS7fqSLY5L2xuXAb8cIb1vyQRKt5EPXmw"}) (MapView)
