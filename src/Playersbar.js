// Import React components
import React from 'react'
// Import a Color Picker implementation
import { TwitterPicker } from 'react-color'
// Adding css styling
import './Playersbar.css';
// Import a Slider implementation
import 'react-rangeslider/lib/index.css'
import firebase from 'firebase';

import Cookies from 'universal-cookie';
import { remove } from 'immutable';


class Playersbar extends React.Component {
    constructor(props) {
        super(props);
        // Initialize React state - they trigger re-rendering
        this.state = {
            loggedIn: false,
            me: {
                name: null,
                points: null,
                isTurn: null,
                justWon: null,
                uid: null
            },
            players: {}
        };
    }
    componentDidMount() {
        this.getUserData();
    }

    getUserData = () => {
        var playersDbRef = firebase.database().ref('gameRooms/1/players/');

        playersDbRef.on('value', (snapshot) => {
            var players = snapshot.val();

            this.setState({
                players: snapshot.val()
            })

            if(this.state.loggedIn === false) this.retrieveUserInfo(players);
            if(!players){
                this.setState({
                    loggedIn: false
            })}
        })
    }


    retrieveUserInfo = (players) => {
        const cookies = new Cookies();

        if (players && players[cookies.get('uid')]){
            let myself = players[cookies.get('uid')];
            this.setState({
                me: {
                    name: myself.name,
                    points: myself.points,
                    isTurn: myself.isTurn,
                    justWon: myself.justWon,
                    uid: cookies.get('uid')
                },
                loggedIn: true
            })
        }else{
            cookies.remove('uid');
            this.setState({
                loggedIn: false
            })
        }
    }

    registerUser = event => {
        console.log('called')
        event.preventDefault();

        console.log(event);
        let name = event.target.name.value

        // Get a key for a new Post.
        var newPlayerKey = firebase.database().ref('/gameRooms/1/').child('players').push().key;

        this.state.me = {
            name: name,
            points: 0,
            isTurn: false,
            justWon: false,
            uid: newPlayerKey
        }
        this.state.loggedIn = true;
        this.setState({
            loggedIn : true
        })

        var playerUpdate = {};

        playerUpdate['/players/' + newPlayerKey] = {
            name: this.state.me.name,
            isTurn: this.state.me.isTurn,
            justWon: this.state.me.justWon,
            points: this.state.me.points,
            uid: newPlayerKey
        };
        firebase.database().ref('/gameRooms/1/').update(playerUpdate);

        const cookies = new Cookies();
        cookies.set('uid', newPlayerKey, { path: '/' });
    }

    UserLogIn = (props) => {
        let registerUser = "";
        console.log(props.status);
        if (props.status === false) {
            return (
                <form onSubmit={this.registerUser}>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Name"
                    />
                    <button type="submit" className="btn btn-primary">Save</button>
                </form>
            )
        } else return null
    }


    render() {
        const players = this.state.players;
        // Render the sidebar element by element
        const playersList = [];
        if (players) {
            Object.entries(players).map(([key, player]) => {
                playersList.push(<h5 key={key}>{player.name} - {player.points} - {player.justWon.toString()} - {player.isTurn.toString()}</h5>)
            })
        }

        return (
            <div className="playersbar" >
                <this.UserLogIn status={this.state.loggedIn} />
                {playersList}
            </div >
        );
    }
}



export default Playersbar;