import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import { Redirect } from 'react-router-dom';
import {Link } from "react-router-dom";
const socket = socketIOClient("http://localhost:4001");


export class Private extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      room_name: null,
      to: null,
      user: null,
      chat: [],
      users_list: [],
      room_list: [],
      leave: false
    };
    socket.on('get message',function(data){ 
    })
  }
//TODO faire les states du private room
  componentDidMount(){
    var room = this.state.room_name
    var {to} = this.props.location.state
    var {from} = this.props.location.state
    if(room == null){
      this.setState({username: from, to: to, room_name: from + ' & ' + to})
    }
    if(to !== undefined){
        socket.emit('/create', from + ' & ' + to)
        socket.emit('/join', from + ' & ' + to, from)
    }
    this.direct_message()
  }


  direct_message = () =>{
    var timer = setInterval(() => {
      socket.emit('get_chat', 'null')
      socket.on('tab_chat', (data) => {
        this.setState({chat: data})
      })
      socket.emit('/users', 'null')
      socket.on('/users_list', (data) => {
        this.setState({users_list: data})
      })
      socket.emit('/list', null)
      socket.on('list_show', (list) => {
          this.setState({ room_list: list })
      })
    }, 1000);
  }
  
  leave_room(){
    socket.emit('/part', this.state.username, this.state.room_name);
    this.setState({leave: true})
  }

  redirection = (room) => {
    this.setState({
      room_name: room,
    })
    console.log(this.state.username)
      socket.emit('/join', room, this.state.username)
    socket.on('connectToRoom',(data) => {
      var text = document.getElementById("titre")
      text.innerHTML = data
    });
  }

  change = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }
  
  submit = e => {
    e.preventDefault();
    socket.emit('message', this.state.username, this.state.message, this.state.room_name);
    socket.on('get message', (data) => { 
      this.setState({ chat: data })
    })
    return false;
  }


  render () {
    var value = this.state.redirect_room
    var username = this.state.username
    if (this.state.redirect){
      return <Redirect to={{
        pathname: '/room',
        state: { room_name: {value}, user: {username}}
    }}/>
  }
  if (this.state.leave){
    return <Redirect to={{
      pathname: '/',
      state: {user: {username}}
    }}/>
  }
    const numRows = this.state.chat.length
    const numRows_2 = this.state.users_list.length
    const numRows_3 =this.state.room_list.length
    var room_name = this.state.room_name
    socket.on('send_name',function(data) {
    });
    return(
      <div>
        <div id='champ_message'>
          <h2>VOUS ETES DANS LA ROOM </h2><h3 id="titre">{room_name}</h3>
        </div>
        <div id="chat2">
        {numRows > 0 ?(
          this.state.chat.map((key, value) => 
          key.room === room_name ? (
            key.user === username ?(
              <p id="user_message" key={value}>
                <img src= {'/user.png'} width="50" height="50"/>
                <p className="otor">{key.user}</p> {key.message}</p>
            ) :(
              key.user === 'notification' ? (
                <p id="notification" key={value}>{key.message}</p>
              ):(
                <p id="contact_message" key={value}><p className="copain">{key.user}</p> {key.message}</p> 
                )
              )
            ) : ("")
          )
        ) : ""}
        </div>
        <form className="form2" onSubmit={this.submit}>
            <input type="text" id="message"  placeholder = {"Ecrivez votre message ici"} onChange={this.change}/>
            <br/>
            <button className="btn shadow" onClick={this._onPressButton}>Envoyer</button>
          </form>
          <div className="leave">
            <button onClick={ () => this.leave_room() }>Quitter la room</button>
          </div>
        <div id="list">
          <h4>UTILISATEUR CONNECTE</h4>
          {numRows_2 > 0 ?(
            this.state.users_list.map((key, value) => 
            key.room === room_name ? (<p key={value}>{key.user}</p>) : 
            ("")
          )
          ) : ""}
          <h3>Liste des Rooms</h3>
          { numRows_3 > 0 ?
            this.state.room_list.map((value, index) =>
            <p onClick={ () => this.redirection(value)} key={index}>{value}<br></br></p>
            ) : ""}
        </div>
      </div>
    )
  }
}

export default Private;