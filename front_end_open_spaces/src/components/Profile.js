import React from 'react';
import {Redirect} from 'react-router-dom';

class Profile extends React.Component{
  render(){
    return(
      <div className="under">
      {this.props.user ? (<div>
        <h1>Hello Profile {this.props.user.username}!</h1>
        <img alt="avatar"src={this.props.user.avatar}/>
        </div>):(<Redirect to='/'/>)}

      </div>
    )
  }
}

export default Profile
