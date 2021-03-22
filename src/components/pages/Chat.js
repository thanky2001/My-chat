import React, { Component } from 'react';
import { auth, db } from '../services/Firebase';
import { logout } from "../helpers/auth";
import '../../Css/chat.css';
import Rename from './Rename';

export default class Chat extends Component {
    constructor(props) {
        super(props);
        //Lấy dữ liệu từ Firebase
        this.state = {
            currentUser: auth().currentUser,
            user: {},
            listUser:[],
            chats: [],
            content: '',
            readError: null,
            writeError: null,
            ToChat:'',
            editName:'',
            image:'',
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
                this.setState({ 
                    chats 
                },()=>this.handleScroll());
            });
        } catch (error) {
            this.setState({ 
                readError: error.message 
            });
        }
        //lấy dữ liệu mảng user
        try {
            db.ref("user").on("value", snapshot => {
                let listUser=[];
                let user = {};
                let acc=[];
                snapshot.forEach((snap) => {
                    acc.push(snap.val());
                    if (snap.val().uid === this.state.currentUser.uid) {
                        user = snap.val();
                    }else{
                        listUser.push(snap.val());
                    }
                },);
                // đẩy dữ liệu lên firebase
                let index=acc.filter(us=>us.uid===this.state.currentUser.uid);
                if(index!==-1){
                    db.ref("user/" +this.state.currentUser.uid).set({
                        uid:this.state.currentUser.uid,
                        email:this.state.currentUser.email,
                        timestamp: Date.now(),
                        image:this.state.currentUser.photoURL,
                        name:this.state.currentUser.displayName,
                    })
                    }
                    // else{
                //     db.ref("user").push({
                //         image:this.state.image,
                //         name:this.state.editName,
                //     });
                // }
                this.setState({
                    user, 
                    listUser,
                });

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
                touid:this.state.ToChat.uid,
                uid: this.state.user.uid
            });
            this.setState({ content: '' });
        } catch (error) {
            this.setState({ writeError: error.message });
        }
    }
    logout = () => {
        logout();
        window.location.href = '/';
    }
    getToChat=(data)=>{
        this.setState({
            ToChat:data,
        })
    }
    handleScroll=()=>{
        const scroll= document.getElementById("scroll");
        scroll.scrollTop=scroll.scrollHeight;
    }
    //loc chat
    chat = () => {
        return this.state.chats.filter(chat=>(chat.uid===this.state.currentUser.uid||chat.uid===this.state.ToChat.uid)&& (chat.touid===this.state.ToChat.uid||chat.touid===this.state.currentUser.uid)).map(chat => {
            if(this.state.ToChat!==''){
             if (chat.content !== '') {
                if (this.state.user.uid === chat.uid) {
                    return (
                        <li key={chat.timestamp} className="message right appeared">
                            <div>{
                                !this.state.user.image ? <img className="avatar" src="./images/avatar.png"/>
                                :<img className="avatar" src={this.state.user.image}/>
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
                                !this.state.ToChat.image ? <img className="avatar" src="./images/avatar.png"/>
                                :<img className="avatar" src={this.state.ToChat.image}/>
                                }</div>
                            <div className="text_wrapper">
                                <div className="text">{chat.content}</div>
                            </div>
                        </li>
                    )
                }
            }
        }
        },)
    }
    //rename user
    renameUser=(editName,image)=>{
        this.setState({
            editName,
            image,
        },()=>console.log(this.state.editName))
    }
    renderListChat=()=>{
        return this.state.listUser.map((ob,index)=>{
                if(!ob.name){
                    return (
                        <div onClick={()=>{this.getToChat(ob)}} 
                        className="contacts__item" key={index}>
                            <div >{
                                !ob.image ? <img className="avatar" src="./images/avatar.png"/>
                                :<img className="avatar" src={ob.image}/>
                                }</div>
                            <div className="mt-1"><p>{ob.email}</p></div>
                        </div>
                        
                    )
                } else{
                    return (
                        <div onClick={()=>{this.getToChat(ob)}} className="contacts__item" key={index}>
                            <div >{
                                !ob.image ? <img className="avatar" src="./images/avatar.png"/>
                                :<img className="avatar" src={ob.image}/>
                                }</div>
                            <div className="mt-1"><p>{ob.name}</p></div>
                        </div>
                    )
                }
            
        })
    }
    render() {
        return (
            <div className="container-fluid">
                <Rename user={this.state.user} renameUser={this.renameUser} />
                <div className="row">
                    <div className="col-3 tab__contacts">
                        <div className="container">
                            <div className="row">
                                <div className="col-3">
                                    <a href="#" data-toggle="modal" data-target="#modelId">{
                                        !this.state.user.image ? <img className="avatar" src="./images/avatar.png"/>
                                        :<img className="avatar" src={this.state.user.image}/>
                                    }
                                    </a>
                                </div>
                                <div className="col-6 mt-3 pl-0">
                                    <p>{this.state.user.name}</p>
                                    <a href="#"></a>
                                </div>
                                <div className="col-3 mt-3   pl-0"><a href='' className="logout" onClick={this.logout} >Log Out</a></div>
                            </div>
                            <div id="contacts-search" className="row">
                                <div  className="col-9">
                                    <input type="text" id="contacts-search-input" className="form-control" placeholder="Search" aria-label="Search" aria-describedby="basic-addon1" />
                                </div>
                                <div className="col-3 mt-2"><i style={{cursor:'pointer'}} class="fas fa-user-plus"></i></div>
                            </div>
                            <div class="contacts">
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
                                !this.state.ToChat.image ? <img className="avatar" src="./images/avatar.png"/>
                                :<img className="avatar" src={this.state.ToChat.image}/>
                                }
                            </div>
                            <div>{
                                !this.state.ToChat.name ? <p>{this.state.ToChat.email}</p>
                                :<p>{this.state.ToChat.name}</p>
                                }
                            </div>
                        </div>
                        
                        <div>
                            <ul id="scroll" className="messages">{this.chat()}</ul>
                            <form onSubmit={this.handleSubmit}>
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
            </div>
        )
    }
}
