import React, {Fragment}from 'react';
import { Circle, Marker } from 'react-google-maps';

class CurrentPerson extends React.Component {
  render(){
    return(
      <Fragment>
        <Marker position={this.props.center}/>
        <Circle center={this.props.center} radius={this.props.radius}/>
      </Fragment>
    )
  }
}

export default CurrentPerson
