import React, {Component} from 'react';

class ChatBar extends Component {

// this.onContent = this.onContent.bind(this);

  render() {
    console.log("chatbar", this.props);
    return (
        <footer className="chatbar">
          <input
            className="chatbar-username"
            placeholder="Your Name (Optional)"
            onKeyUp={this.props.onContent}/>
          <input className="chatbar-message"
            placeholder="Type a message and hit ENTER"
            onKeyPress={this.props.onEnterContent} />
        </footer>
    );
  }
}
export default ChatBar;
