import React from 'react';
import {Redirect} from 'react-router-dom';

class Login extends React.Component{
  state = {
    username:'',
    password:''
  }

  handleChange= (e)=>{
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = (e)=>{
    e.preventDefault()
    this.props.logIn(this.state)
  }

  render(){
    return(
      <div >
      {!this.props.user ? (
        <div className="form">
        <h1>Login</h1>
      <form onChange={(e)=>this.handleChange(e)} onSubmit={(e)=>this.handleSubmit(e)}>
        <input type='text' name="username"/>
          <br/>
          <br/>
        <input type='password' name="password"/>
          <br/>
          <br/>
        <input type="submit" value="Submit" />
      </form>
      </div>
    ):(<Redirect to='/profile'/>)}

      </div>
    )
  }
}

export default Login
