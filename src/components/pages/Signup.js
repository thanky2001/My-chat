import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { signup, signInWithGoogle, } from '../helpers/auth';
import '../../Css/Login.css';

export default class Signup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      email: '',
      password: '',
    };
  }
  handleChange=(event)=>{
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  handleSubmit=async(event)=> {
    event.preventDefault();
    this.setState({ error: '' });
    try {
      await signup(
        this.state.email, 
        this.state.password);
    } catch (error) {
      this.setState({ error: error.message });
    }
  }
  googleSignIn=async()=> {
    try {
      await signInWithGoogle();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }
  render() {
    return (
      
      <div className="wrapper fadeInDown">
        <div id="formContent">
          {/* Icon */}
          <div className="fadeIn first">
            <img src="./images/avatar.png" id="icon" alt="User Icon" />
          </div>
          {/* sign up Form */}
          <form autoComplete="off" onSubmit={this.handleSubmit}>
            {this.state.error ? (<p className="text-danger">{this.state.error}</p>) : null}
            <input 
              className='fadeIn second'
              placeholder="Email"
              name="email"
              type="email"
              onChange={this.handleChange}
              value={this.state.email}>
            </input>
            <input
              className='fadeIn third'
              placeholder="Password"
              name="password"
              onChange={this.handleChange}
              value={this.state.password}
              type="password">
            </input>
            <input type="submit" className="fadeIn fourth" value="Sign up" />
            <div className="text-center fadeIn fifth">Or</div>
            <div className="social-container ">
              {/* <a href="#" className="social"><i className="fab fa-facebook-f" /></a> */}
              <a onClick={this.googleSignIn} className="social fadeIn sixth"><i className="fab fa-google-plus-g" /></a>
              {/* <a href="#" className="social"><i className="fab fa-linkedin-in" /></a> */}
            </div>
          </form>
          {/* Sign in*/}
          <div id="formFooter">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </div>
      </div>
    )
  }
}
