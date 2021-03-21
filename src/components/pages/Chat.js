import React, { Component } from 'react';
import { auth, db } from '../services/Firebase';
import { logout } from "../helpers/auth";
import '../../Css/chat.css';

export default class Chat extends Component {
    constructor(props) {
        super(props);
        //Lấy dữ liệu từ Firebase
        this.state = {
            currentUser: auth().currentUser,
            user: {},
            chats: [],
            content: '',
            readError: null,
            writeError: null
        };
    }
    componentDidMount = async () => {
        this.setState({ readError: null });
        //lấy dữ liệu bảng chats trên firebase => push vào mảng chats
        try {
            db.ref("chats").on("value", snapshot => {
                let chats = [];
                snapshot.forEach((snap) => {
                    chats.push(snap.val());
                });
                this.setState({ chats });
            });
        } catch (error) {
            this.setState({ readError: error.message });
        }
        //lấy dữ liệu mảng user
        try {
            db.ref("user").on("value", snapshot => {
                let user = {};
                snapshot.forEach((snap) => {
                    if (snap.val().uid === this.state.currentUser.uid) {
                        user=snap.val()
                    }
                });
                this.setState({ user });
            
            });
        } catch (error) {
            this.setState({ readError: error.message });
        }
    }
    handleChange = (event) => {
        this.setState({
            content: event.target.value
        });
    }
    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState({ writeError: null });
        try {
            await db.ref("chats").push({
                content: this.state.content,
                timestamp: Date.now(),
                uid: this.state.user.uid
            });
            this.setState({ content: '' });
        } catch (error) {
            this.setState({ writeError: error.message });
        }
    }
    logout=() =>{
        logout();
        window.location.href = '/';
    }
    chat = () => {
        return this.state.chats.map(chat => {
            if (chat.content !== '') {
                if (this.state.user.uid === chat.uid) {
                    return (
                        <li key={chat.timestamp} className="message right appeared">
                            <div className="avatar"></div>
                            <div className="text_wrapper">
                                <div className="text">{chat.content}</div>
                            </div>
                        </li>
                    )
                } else {
                    return (
                        <li key={chat.timestamp} className="message left appeared">
                            <div className="avatar"></div>
                            <div className="text_wrapper">
                                <div className="text">{chat.content}</div>
                            </div>
                        </li>
                    )
                }
            }
        })
    }
    render() {
        return (
            // <div>
            //     <div>
            //         Login in as: <strong>{this.state.user.email}</strong>
            //     </div>
            //     <div className="chat_window">
            //         <div className="top_menu">
            //             <div className="buttons">
            //                 <div className="button close" />
            //                 <div className="button minimize" />
            //                 <div className="button maximize" />
            //             </div>
            //             <div className="title">Chat</div>
            //         </div>
            //         <ul className="messages">{this.chat()}</ul>
            //         <div className="bottom_wrapper clearfix">
            //             <form onSubmit={this.handleSubmit}>
            //                 <div>
            //                     <input className="message_input_wrapper" placeholder="Type your message here..."
            //                         onChange={this.handleChange} value={this.state.content}></input>
            //                     {this.state.error ? <p>{this.state.writeError}</p> : null}
            //                     <div className="send_message">
            // <button className="btn--send" type="submit">Send</button>
            //                     </div>
            //                 </div>
            //             </form>
            //         </div>
            //     </div>
            //     <div className="message_template">
            //         <li className="message">
            //             <div className="avatar" />
            //             <div className="text_wrapper">
            //                 <div className="text" />
            //             </div>
            //         </li>
            //     </div>
            // </div>

            <div className="container-fluid">
                <div className="row">
                    <div id="user-name" className="col-3">
                        <div className="container">
                            <div className="row">
                            <div className="col-3">
                                <a><img className="avatar" src={this.state.user.image} /></a>
                            </div>
                                <div className="col-6 mt-1 pl-0">{this.state.user.name}</div>
                                <div className="col-3 mt-1 pl-0"><a href='' className="logout" onClick={this.logout} >Log Out</a></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <form onSubmit={this.handleSubmit}>
                            <div>
                                <input className="message_input_wrapper" placeholder="Type your message here..."
                                    onChange={this.handleChange} value={this.state.content}></input>
                                {this.state.error ? <p>{this.state.writeError}</p> : null}
                                <div className="send_message">
                                    <button className="btn--send" type="submit">Send</button>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        )
    }
}
