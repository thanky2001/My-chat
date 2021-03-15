import React, { Component } from 'react';
import { auth, db } from '../services/Firebase';

export default class Chat extends Component {
    constructor(props) {
        super(props);
        //Lấy dữ liệu từ Firebase
        this.state = {
            user: auth().currentUser,
            chats: [],
            content: '',
            readError: null,
            writeError: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    async componentDidMount() {
        this.setState({ readError: null });
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
    }
    handleChange(event) {
        this.setState({
            content: event.target.value
        });
    }
    async handleSubmit(event) {
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
            <div>
                <div>
                    Login in as: <strong>{this.state.user.email}</strong>
                </div>
                <div className="chat_window">
                    <div className="top_menu">
                        <div className="buttons">
                            <div className="button close" />
                            <div className="button minimize" />
                            <div className="button maximize" />
                        </div>
                        <div className="title">Chat</div>
                    </div>
                    <ul className="messages">{this.chat()}</ul>
                    <div className="bottom_wrapper clearfix">
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
                <div className="message_template">
                    <li className="message">
                        <div className="avatar" />
                        <div className="text_wrapper">
                            <div className="text" />
                        </div>
                    </li>
                </div>
            </div>

            // <div>
            //     <div>
            //         Login in as: <strong>{this.state.user.email}</strong>
            //     </div>
            //     <div className="chats container bg-light">
            //         {this.chat()}
            //     </div>
            //     <div>
            // <form onSubmit={this.handleSubmit}>
            //     <input onChange={this.handleChange} value={this.state.content}></input>
            //     {this.state.error ? <p>{this.state.writeError}</p> : null}
            //     <button type="submit">Send</button>
            // </form>
            //     </div>
            // </div>
        )
    }
}
