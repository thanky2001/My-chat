import React, { Component } from 'react';
import { auth, db } from '../services/Firebase';
import { logout } from "../helpers/auth";

export default class HeaderChat extends Component {
    constructor(props) {
        super(props)
        this.state={
            user:{},
        }
    }
    logout = () => {
        logout();
        window.location.href = '/';
    }
    componentDidMount = async () => {
        this.setState({ 
            readError: null 
        });
        db.ref('user/'+auth().currentUser.uid)
        .get()
        .then(dt=>{
            let user=dt.val();
            this.setState({
                user
            })
        })
    }
    
    render() {
        return (
            <div className="row">
                <div className="col-3">
                    <a href="#" data-toggle="modal" data-target="#modelId">
                        <img className="avatar" src={this.state.user.image} />
                    </a>
                </div>
                <div className="col-6 mt-3 pl-0">
                    <p>{this.state.user.name}</p>
                    <a href="#"></a>
                </div>
                <div className="col-3 mt-3   pl-0"><a href='' className="logout" onClick={this.logout} >Log Out</a></div>
            </div>
        )
    }
}
