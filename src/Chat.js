// Import React components
import React from 'react'
// Import a Color Picker implementation
import { TwitterPicker } from 'react-color'
// Adding css styling
import './Chat.css';
// Import a Slider implementation
import 'react-rangeslider/lib/index.css'

class Chat extends React.Component {
    constructor(props) {
        super(props);
        // Initialize React state - they trigger re-rendering
        this.state = {
            messages: [{
                uid: 2,
                name: "paul",
                message: "Hello everyone"
            },
            {
                uid: 3,
                name: "leire",
                message: "Hola amor"
            }]
        };
    }

    render() {
        const messages = this.state.messages;
        // Render the sidebar element by element
        return (
            <div className="chatbar" >
                chatbar
                {messages.map(message => (
                    <div key={message.uid}>
                        <div>
                            <h5>{message.name}</h5>
                            <p>{message.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

export default Chat;