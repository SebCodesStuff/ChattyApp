import React, {Component} from 'react';

import ChatBar from './components/ChatBar.jsx';
import Message from './components/Message.jsx';
import MessageList from './components/MessageList.jsx';


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: "Anonymous1",
      messages: []
    }
    this.sendMessage = this.sendMessage.bind(this);
    this.sendName = this.sendName.bind(this);
  }

  componentDidMount() {
    this.socket = new WebSocket("ws://localhost:3001")
  }


  sendName (e) {
    if (e.key === "Enter") {
      this.state.currentUser = e.target.value
    }
  }

  sendMessage (e) {
// On enter sends message to SocketServer.js
    if (e.key === "Enter"){
        var msg = {
          type: "postMessage",
          id: "",
          userName: this.state.currentUser,
          content: e.target.value
        };
      this.socket.send(JSON.stringify(msg))
      e.target.value = "";
    }

// SocketServer.js sends back
    this.socket.onmessage = (e) => {
      console.log("my data",JSON.parse(e.data));
      var msgFromClient = JSON.parse(e.data);
      console.log({messages:msgFromClient});
      this.setState(
        {messages:
          [...this.state.messages,
          {id:msgFromClient.id,
          userName:msgFromClient.userName,
          content: msgFromClient.content}]
        }
      )
    }
  }


  render() {
    console.log('app.js');
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>

        <MessageList currentUser = {this.state.currentUser}
          messages = {this.state.messages}/>
        <ChatBar currentUser = {this.state.currentUser} currentMessage = {this.state.currentMessage} sendMessage = {this.sendMessage} sendName = {this.sendName}/>
    </div>
    );
  }
}




export default App;
