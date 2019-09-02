import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Geocode from "react-geocode";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Script from 'react-load-script';
import PropTypes from 'prop-types';


Geocode.setApiKey("AIzaSyDS7fqSLY5L2xuXAb8cIb1vyQRKt5EPXmw");

const styles = theme => ({
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
});

class ParkingForm extends React.Component {

  state = {
    address: '',
    spotsNum:''
  }


  handleChange =  event => {
    this.setState({ ...this.state,
      [event.target.name]: event.target.value
    });
  };

  handleScriptLoad = ()=> {
  // Initialize Google Autocomplete
  /*global google*/
  this.autocomplete = new google.maps.places.Autocomplete(
                        document.getElementById("autocomplete"));
  // Avoid paying for data that you don't need by restricting the
  // set of place fields that are returned to just the address
  // components and formatted address
  this.autocomplete.setFields(['address_components',
                               'formatted_address']);
  // Fire Event when a suggested name is selected
  this.autocomplete.addListener("place_changed",
                                this.handlePlaceSelect);
}
handlePlaceSelect = ()=> {

    // Extract City From Address Object
    let addressObject = this.autocomplete.getPlace();
    let address = addressObject.address_components;
    console.log("Selected Place",addressObject);
    // Check if address is valid
    if (address) {
      // Set State
      this.setState(
        {
          address: addressObject.formatted_address,
        }
      );
    }
  }


   handleSubmit = (address, spotsNum)=>{
    console.log("spotsNum",spotsNum)
    let addressObject = {address: address, spotsNum:spotsNum, fromRentor: true}
    this.props.socket.emit('client:message', addressObject)

  }

   getCurrentLocation = ()=>{
    navigator.geolocation.getCurrentPosition(position=> console.log(position))
  }

  render(){
    const {classes} = this.props
    return (
      <Card className = {classes.card}>
        <Script url="https://maps.googleapis.com/maps/api/js?key=AIzaSyDS7fqSLY5L2xuXAb8cIb1vyQRKt5EPXmw&libraries=places"
          onLoad={this.handleScriptLoad}
        />
        <CardActionArea >
          <CardMedia className = {classes.media} image = "../assets/parking_form_pic.jpeg" title = "Contemplative Reptile" />
          <CardContent >
          <form>
          <TextField name="address" id = "autocomplete"label = "Address"className = {classes.textField}
          value = {this.state.address} onChange = {this.handleChange} margin = "normal"variant = "outlined" />
          <Select
            value={this.state.spotsNum}
            onChange={this.handleChange}
            inputProps={{
              name: 'spotsNum',
              id: 'age-simple',
              }}
          >
            <MenuItem value="NONE">
            <em>None</em>
            </MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={8}>8</MenuItem>
            <MenuItem value={9}>9</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            </Select>
          </form>
          </CardContent>
          </CardActionArea>
          <CardActions >
          <Button onClick={()=>this.handleSubmit(this.state.address, this.state.spotsNum)}size = "small" color = "primary" >Find Parking!</Button>
          <Button onClick={()=>this.getCurrentLocation()}size = "small" color = "primary" >Get Current Position!</Button>
          </CardActions>
      </Card>
    );
  }
}

ParkingForm.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ParkingForm)
