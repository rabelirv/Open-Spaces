import React from 'react';

class SignUp extends React.Component{

  state = {
    username:'',
    password:'',
    bio: "",
    avatar:""
  }

  handleChange= (e)=>{
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = (e)=>{
    e.preventDefault()
    this.props.createNewUser(this.state)
  }
  render(){
    return(
      <div className="form">
        <h1>Sign Up </h1>
        <form onChange={(e)=>this.handleChange(e)} onSubmit={(e)=>this.handleSubmit(e)}>
          <input autoComplete="off" type='text' name="username"/>
            <br/>
            <br/>
          <input autoComplete="off" type='password' name="password"/>
            <br/>
            <br/>
          <input autoComplete="off" type='text' name="bio"/>
            <br/>
            <br/>
          <input autoComplete="off" type='text' name="avatar"/>
            <br/>
            <br/>
          <input autoComplete="off" type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

export default SignUp
