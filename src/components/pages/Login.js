import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { signin, signInWithGoogle, } from "../helpers/auth";
import '../../Css/Login.css'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            email: "",
            password: ""
        };
    }
    handleChange=(event)=> {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    handleSubmit=async(event)=> {
        event.preventDefault();
        this.setState({ error: "" });
        try {
            await signin(this.state.email, this.state.password);
        } catch (error) {
            this.setState({ error: error.message });
        }
    }
    googleSignIn=async() =>{
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
                    {/* Login Form */}
                    <form autoComplete="off" onSubmit={this.handleSubmit}>
                        {this.state.error ? (<p className="text-danger">{this.state.error}</p>) : null}
                        <input
                            className='fadeIn second'
                            placeholder="Email"
                            name="email"
                            type="email"
                            onChange={this.handleChange}
                            value={this.state.email}
                        />
                        <input
                            className='fadeIn third'
                            placeholder="Password"
                            name="password"
                            onChange={this.handleChange}
                            value={this.state.password}
                            type="password"
                        />

                        <input type="submit" className="fadeIn fourth" value="Log In" />
                        <div className="text-center fadeIn fifth">Or</div>
                        <div className="social-container ">
                            {/* <a href="#" className="social"><i className="fab fa-facebook-f" /></a> */}
                            <a onClick={this.googleSignIn} className="social fadeIn sixth"><i className="fab fa-google-plus-g" /></a>
                            {/* <a href="#" className="social"><i className="fab fa-linkedin-in" /></a> */}
                        </div>
                    </form>
                    {/* Sign up*/}
                    <div id="formFooter">
                        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                    </div>
                </div>
            </div>


        )
    }
}
