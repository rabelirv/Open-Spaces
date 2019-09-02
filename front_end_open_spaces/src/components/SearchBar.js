import React from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Script from 'react-load-script';


const styles = theme=>({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
});

 class SearchBar extends React.Component{
  state = {
    address: ""
  }
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

   handleChange = (input)=>{
     this.setState({address: input})
   }
render(){
  const {classes} = this.props
  return (
    <Paper className={classes.root}>
    <Script url="https://maps.googleapis.com/maps/api/js?key=AIzaSyDS7fqSLY5L2xuXAb8cIb1vyQRKt5EPXmw&libraries=places"
      onLoad={this.handleScriptLoad}
    />
      <IconButton className={classes.iconButton} aria-label="menu">
        <MenuIcon />
      </IconButton>
      <InputBase
      id="autocomplete"
        className={classes.input}
        placeholder="Search Open Spaces"
        inputProps={{ 'aria-label': 'search google maps' }}
        onChange={e=> this.handleChange(e.target.value)}
      />
      <IconButton className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
      <Divider className={classes.divider} />
      <IconButton onClick={()=>this.props.findParking(this.state.address)}color="primary" className={classes.iconButton} aria-label="directions">
        <DirectionsIcon />
      </IconButton>
    </Paper>
  );

}
}

SearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchBar)
