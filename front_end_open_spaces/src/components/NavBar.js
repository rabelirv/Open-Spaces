import React from 'react'
import {Link } from 'react-router-dom'
class NavBar extends React.Component{
  render(){
    return(
      <div className="navbar">
      {!this.props.user ?(<div>
        {window.location.href === "https://openspacesapp.herokuapp.com/map" ? (<button className="center-map"onClick={()=>this.props.recenterMap()}>Center Map</button>):(null)}
        <Link to="/signup" className="navbu">SIGN UP</Link>
        <Link to="/map"className="navbu">MAP</Link>
        <Link to="/parkingform"className="navbu">Post a Parking Spot!</Link>
        <Link to="/" className="navbu">HOME</Link>

      </div>):(
        <div>
          <Link to="/"className="navbu" onClick={this.props.logOut}>LOG OUT</Link>
          <Link to="/profile" className="navbu">PROFILE</Link>
          <Link to="/" className="navbu">HOME</Link>
        </div>
        )}

      </div>
    )
  }
}

export default NavBar
