// Import React components
import React from 'react'
// Import a Color Picker implementation
import { TwitterPicker } from 'react-color'
// Adding css styling
import './Playersbar.css';
// Import a Slider implementation
import 'react-rangeslider/lib/index.css'

class Playersbar extends React.Component {
    constructor(props) {
        super(props);
        // Initialize React state - they trigger re-rendering
        this.state = {
            players: [{
                uid: 2,
                name: "paul",
                points: 1
            },
            {
                uid: 3,
                name: "leire",
                points: 99
            }]
        };
    }

    render() {
        const players = this.state.players;
        // Render the sidebar element by element
        return (
            <div className="playersbar" >
                playersbar
                {players.map(player => (
                    <div key={player.uid}>
                        <div>
                            <h5>{player.name}</h5>
                            <p>{player.points}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

export default Playersbar;