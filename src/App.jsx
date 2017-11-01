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
    this.onEnterContent = this.onEnterContent.bind(this);
    this.onContent = this.onContent.bind(this);

  }

  componentDidMount() {
    this.socket = new WebSocket("ws://localhost:3001")
  }


   idGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }

  onContent (e) {
  this.state.currentUser = e.target.value
  }

  onEnterContent (e) {
    if (e.key === "Enter"){
      this.socket.send(e.target.value)
      this.setState(
        {messages:
          [...this.state.messages,
          {id:this.idGenerator(),
          userName:this.state.currentUser,
          content: e.target.value}]
        }
      )
      //Note an arrow function does not produce it's own scope function does so using
      // function here makes this undefined
      var sendText = () => {
        var msg = {
          id: this.idGenerator(),
          userName: this.state.currentUser,
          content: e.target.value
        };
        // console.log(JSON.stringify(msg));
        this.socket.send(JSON.stringify(msg))
      }
      sendText();
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
        <ChatBar currentUser = {this.state.currentUser} currentMessage = {this.state.currentMessage} onEnterContent = {this.onEnterContent} onContent = {this.onContent}/>
    </div>
    );
  }
}




export default App;
