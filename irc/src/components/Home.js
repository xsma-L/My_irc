import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { BrowserRouter, Route, Link } from "react-router-dom";
const socket = socketIOClient("http://localhost:4001");


export class Home extends Component {
    constructor() {
    super();
    this.state = {
      username: null,
      new_room: null,
      room_list: null,
      // name: null
    };
}

//TODO Verification si il n'y a pas de props
componentDidMount(){
  if(this.props.location.state !== undefined){
    var {user} = this.props.location.state
    console.log(user.username)
    if (user !== undefined) {
      this.setState({username: user.username})
    }
  }
}

change = e => {
    this.setState({
        [e.target.id]: e.target.value
    })
}

//TODO afficher les rooms
list(){
    socket.emit('/list', null)
    socket.on('list_show', (list) => {
        this.setState({ room_list: list })
    })
  }
  
  submit = e => {
      e.preventDefault();
      var name = this.state.username
      var room = this.state.new_room
      if(name !== null){
        socket.emit('/nik', this.state.username)
        socket.on('show_name', (data) => {
        if(data === false){
            alert("Le nickname est déja prit")
          }else {
            this.setState({ username: data })
          }
        })
      }
      if(room !== null){
          socket.emit('/create', this.state.new_room)
        }
        socket.on('room_verif', (data) => {
          if(data === false){
            alert("Une room a déja ce nom")
            return
          }
        })
  }

  render() {
    var numRows
    var username
    var room_name = this.state.room_list
    if (this.state.room_list !== null)
    {
     numRows = this.state.room_list.length
    }
    if(this.state.username !== null)
    {
      username = this.state.username 
    }

    return (
      <div>
          <form className="form" onSubmit={this.submit}>
            <h2>MY IRC</h2>
            <hr/>
            <div className="input">
              <label htmlFor ="username">Ecrivez votre username:</label>
              <input type="text" id="username" onChange={this.change}/>
            <br/>
            </div>
            <div className="input">
              <label htmlFor ="new_room">Créer un nouveau channel:</label>
              <input type="text" id="new_room" onChange={this.change}/>
            <br/>
            </div>
            <button className="btn2 cercle" onClick={this._onPressButton}>Envoyer</button>
          </form>
          <span className="leschan" onClick={ () => this.list()}>Cliquez-ici pour actualiser les channels</span><br></br>
          <div className="link">
          { numRows > 0 ?
              this.state.room_list.map((value, index) =>
              <Link key={index} to={{ pathname: '/room', state: { room_name: {value}, user: {username}} }}>{value}<br></br></Link>
            ) : ""}
          </div>
        </div>  
    )
  }
}

export default Home;