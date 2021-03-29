import React, { Component } from 'react';
import { auth, db } from '../services/Firebase';
import '../../Css/chat.css';
import Rename from './Rename';
import HeaderChat from './HeaderChat';

export default class Chat extends Component {
    constructor(props) {
        super(props);
        //Lấy dữ liệu từ Firebase
        this.state = {
            currentUser: auth().currentUser,
            listUser: [],
            user:{},
            chats: [],
            content: '',
            readError: null,
            writeError: null,
            ToChat: {},
            isLoading: true,
        };
    }
    componentDidMount = async () => {
        this.setState({
            readError: null
        });
        //lấy dữ liệu bảng chats trên firebase => push vào mảng chats
        try {
            db.ref("user").on("value", snapshot => {
                let listUser = [];
                snapshot.forEach((snap) => {
                    listUser.push(snap.val());
                });
                //đẩy dữ liệu lên firebase
                if (listUser.filter(us => us.uid === this.state.currentUser.uid).length === 0) {
                    db.ref("user/" + this.state.currentUser.uid).set({
                        uid: this.state.currentUser.uid,
                        email: this.state.currentUser.email,
                        timestamp: Date.now(),
                        image:
                            this.state.currentUser.photoURL || "./images/avatar.png",
                        name: this.state.currentUser.displayName || this.state.currentUser.email,
                    });
                }
                //lấy dữ liệu mảng user
                db.ref('user/' + auth().currentUser.uid)
                    .get()
                    .then(dt => {
                        let user = dt.val();
                        this.setState({
                            user
                        })
                    })
                this.setState({
                    listUser,
                    isLoading: false,
                });
            });
            db.ref("chats").on("value", snapshot => {
                let chats = [];
                snapshot.forEach((snap) => {
                    chats.push(snap.val());
                });
                this.setState({
                    chats
                }, () => this.handleScroll());
            });
        } catch (error) {
            this.setState({
                readError: error.message
            });
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
                touid: this.state.ToChat.uid,
                uid: this.state.currentUser.uid
            });
            this.setState({ content: '' });
        } catch (error) {
            this.setState({ writeError: error.message });
        }
    }

    getToChat = (data) => {
        this.setState({
            ToChat: data,
        })
    }
    handleScroll = () => {
        const scroll = document.getElementById("scroll");
        scroll.scrollTop = scroll.scrollHeight;
    }
    //loc chat
    chat = () => {
        return this.state.chats.filter(chat => (chat.uid === this.state.currentUser.uid || chat.uid === this.state.ToChat.uid) && (chat.touid === this.state.ToChat.uid || chat.touid === this.state.currentUser.uid)).map(chat => {
            if (this.state.ToChat !== '') {
                if (chat.content !== '') {
                    if (this.state.currentUser.uid === chat.uid) {
                        return (
                            <li key={chat.timestamp} className="message right appeared">
                                <div>{
                                    !this.state.user.image ? <img className="avatar" src="./images/avatar.png" />
                                        : <img className="avatar" src={this.state.user.image} />
                                }</div>
                                <div className="text_wrapper">
                                    <div className="text">{chat.content}</div>
                                </div>
                            </li>
                        )
                    } else {
                        return (
                            <li key={chat.timestamp} className="message left appeared">
                                <div> {
                                    !this.state.ToChat.image ? <img className="avatar" src="./images/avatar.png" />
                                        : <img className="avatar" src={this.state.ToChat.image} />
                                }</div>
                                <div className="text_wrapper">
                                    <div className="text">{chat.content}</div>
                                </div>
                            </li>
                        )
                    }
                }
            }
        })
    }
    //rename user
    renameUser = (editName, image) => {
        db.ref("user/" + this.state.currentUser.uid).set({
            name: editName,
            image: image,
            uid: this.state.currentUser.uid,
            email: this.state.currentUser.email,
            timestamp: Date.now(),
        },
        );
    }
    renderListChat = () => {
        return this.state.listUser.map((ob, index) => {
            if (ob.uid !== this.state.currentUser.uid) {
                if (!ob.name) {
                    return (
                        <div onClick={() => { this.getToChat(ob) }}
                            className="contacts__item" key={index}>
                            <div >{
                                !ob.image ? <img className="avatar" src="./images/avatar.png" />
                                    : <img className="avatar" src={ob.image} />
                            }</div>
                            <div className="mt-1"><p>{ob.email}</p></div>
                        </div>

                    )
                } else {
                    return (
                        <div onClick={() => { this.getToChat(ob) }} className="contacts__item" key={index}>
                            <div >{
                                !ob.image ? <img className="avatar" src="./images/avatar.png" />
                                    : <img className="avatar" src={ob.image} />
                            }</div>
                            <div className="mt-1"><p>{ob.name}</p></div>
                        </div>
                    )
                }
            }
        })
    }
    render() {
        console.log(this.state.isLoading);
        return (
            <div>
                {this.state.isLoading ?
                    <h2>Loading...</h2> : (
                        <div className="container-fluid">
                            <Rename user={this.state.user} renameUser={this.renameUser} />
                            <div className="row">
                                <div className="col-3 tab__contacts">
                                    <div className="container">
                                        <HeaderChat />
                                        <div id="contacts-search" className="row">
                                            <div className="col-9">
                                                <input type="text" id="contacts-search-input" className="form-control" placeholder="Search" aria-label="Search" aria-describedby="basic-addon1" />
                                            </div>
                                            <div className="col-3 mt-2"><i style={{ cursor: 'pointer' }} className="fas fa-user-plus"></i></div>
                                        </div>
                                        <div className="contacts">
                                            <div>
                                                <span>Chat</span>
                                            </div>
                                            <div className="contacts__list pr-5">
                                                {this.renderListChat()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="message__container col-9">
                                    <div className="header__message">
                                        <div>{
                                            !this.state.ToChat.image ? <img className="avatar" src="./images/avatar.png" />
                                                : <img className="avatar" src={this.state.ToChat.image} />
                                        }
                                        </div>
                                        <div>{
                                            !this.state.ToChat.name ? <p>{this.state.ToChat.email}</p>
                                                : <p>{this.state.ToChat.name}</p>
                                        }
                                        </div>
                                    </div>

                                    <div>
                                        <ul id="scroll" className="messages">{this.chat()}</ul>
                                    </div>
                                    <form className='footer__message' onSubmit={this.handleSubmit}>
                                            <div className="bottom_wrapper">
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
                    )}
            </div>
        )
    }
}
