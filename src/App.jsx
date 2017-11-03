import React, {Component} from 'react';

import ChatBar from './components/ChatBar.jsx';
import Message from './components/Message.jsx';
import MessageList from './components/MessageList.jsx';


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formerUser: "Anonymous",
      currentUser: "Anonymous",
      messages: [],
      type:"",
      users: null,
    }
    this.sendMessage = this.sendMessage.bind(this);
    this.sendName = this.sendName.bind(this);
  }


  componentDidMount() {
    this.socket = new WebSocket("ws://localhost:3001")


// SocketServer.js sends back
    this.socket.onmessage = (e) => {
      var msgFromClient = JSON.parse(e.data);
      switch(msgFromClient.type) {
        case "incomingMessage" : {
          this.setState(
            {type:"msg",
              messages:
              [...this.state.messages,
                {id:msgFromClient.id,
                  userName:msgFromClient.currentUser,
                  content: msgFromClient.content}]
            }
          )
        }
        break;
        case "incomingNotification" : {
          console.log("client"+msgFromClient.currentUser);
          this.setState(
            { type:"notification",
              formerUser:msgFromClient.formerUser,
              currentUser:msgFromClient.currentUser,
              messages:
              [...this.state.messages,
              {id:msgFromClient.id,
              userName:msgFromClient.currentUser,
              content:`${msgFromClient.formerUser} changed their name to ${msgFromClient.currentUser}`
              }]
            }
          )
        }
        break;
        case "user" : {
          this.setState ({users:msgFromClient.num})
          break;
        }
      }
    }
  }

  sendMessage (e) {
    // On enter sends message to SocketServer.js
    if (e.key === "Enter"){
      var msg = {
        type: "postMessage",
        id: "",
        currentUser: this.state.currentUser,
        content: e.target.value
      };
      this.socket.send(JSON.stringify(msg))
      e.target.value = "";
    }
  }

  sendName (e) {
    if (e.key === "Enter") {
      var name = {
        type: "postNotification",
        formerUser: this.state.currentUser,
        currentUser: e.target.value,
        content:[]
      }
      this.socket.send(JSON.stringify(name))
    }
  }

  render() {
    console.log('app.js');
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <div className="users">{this.state.users} Users Connected</div>
        </nav>

        <MessageList currentUser = {this.state.currentUser}
          messages = {this.state.messages} type = {this.state.type}/>
        <ChatBar currentUser = {this.state.currentUser} currentMessage = {this.state.currentMessage} sendMessage = {this.sendMessage} sendName = {this.sendName}/>
    </div>
    );
  }
}




export default App;
