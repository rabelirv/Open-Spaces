import React from 'react';

class Random extends React.Component {
  render(){
    return(
      return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >

      </PlacesAutocomplete>
    )
  }
}

<Paper className={classes.root}>
<IconButton className={classes.iconButton} aria-label="menu">
<MenuIcon />
</IconButton>
<InputBase
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
