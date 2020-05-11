// Import React components
import React, { Component } from 'react';
// Adding css styling
import './App.css';
// Using external libraries to use immutable collections
import { List, updateIn, remove, Map } from 'immutable';
// Import the two child components
import Sidebar from "./Sidebar";
import Playersbar from "./Playersbar";
import Chat from "./Chat";
import Drawing from "./Drawing";
// Utility functions to process line-points of the shapes
import relativeCoordinates from "./utils/relativeCoordinates";

import firebase from 'firebase';
import firebaseConfig from './config';

class App extends Component {
    constructor(props) {
        super(props);
        firebase.initializeApp(firebaseConfig);
        // Initialize React state - they trigger re-rendering
        this.state = {
            lines: new List(),
            isDrawing: false,
            strokeColor: '#4284f5',
            fillColor: 'transparent',
            strokeWidth: 5,
            colors: new List(),
            fills: new List(),
            widths: new List(),
            developers: [],
            toSave: new List()
        }
        // Setting up references for DIV elements manipulation
        this.canvasRef = React.createRef();
        // Binding function to make them accessible
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }
    // Add eventListener to all the doucument
    componentDidMount() {
        document.addEventListener("mouseup", this.handleMouseUp);
        this.resetCanvasDB();
        //this.getUserData();
        var canvasDbRef = firebase.database().ref('gameRooms/1/canvas');
        
        canvasDbRef.on('value', (snapshot) => {
            var canvas = snapshot.val();
            console.log(this.state.isDrawing);
            if (this.state.isDrawing == false && canvas && canvas.widths && canvas.lines && canvas.colors) {
                console.log("received update")
                let linesList = [];

                for(var i = 0; i<canvas.lines.length; i++){
                    var line = [];
                    for(var j = 0; j<canvas.lines[i].length; j++){
                        line.push(new Map({
                            x: canvas.lines[i][j].x,
                            y: canvas.lines[i][j].y
                        }))
                    }
                    linesList.push(new List(line));
                }
                var finalList = new List(linesList);
                this.setState(({
                    lines: finalList,
                    widths: new List(canvas.widths),
                    colors: new List(canvas.colors),
                    fills: new List(canvas.fills)
                }))
                //console.log(this.lines);
                //Drawing(this.lines,this.colors, this.fills, this.isDrawing,)
                //console.log(this.state)
                /*this.lines = new List(canvas.line);
                this.state.widths = new List(canvas.widths);
                this.state.strokes = new List(canvas.strokes);*/
            }else if(this.state.isDrawing == false && canvas == null){
                this.setState({
                    lines: new List(),
                    colors: new List(),
                    fills: new List(),
                    widths: new List(),
                });
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        // check on previous state
        // only write when it's different with the new state
        if (prevState !== this.state && this.state.isDrawing && this.state.lines && this.state.widths && this.state.colors) {
            this.saveCanvas();
        }
    }
    // Remove on component creation (best practice)
    componentWillUnmount() {
        document.removeEventListener("mouseup", this.handleMouseUp);
    }

    saveCanvas = () => {
        firebase.database()
            .ref('/gameRooms/1/canvas')
            .set({
                lines: JSON.parse(JSON.stringify(this.state.lines)),
                colors: JSON.parse(JSON.stringify(this.state.colors)),
                widths: JSON.parse(JSON.stringify(this.state.widths)),
                fills: JSON.parse(JSON.stringify(this.state.fills))
            });
        console.log("DATA SAVED");
    };

    resetCanvasDB = () => {
        firebase.database().ref('/gameRooms/1/canvas').set({})
    }

    /*
    getUserData = () => {
        let ref = firebase.database().ref("/");
        ref.on("value", snapshot => {
            const state = snapshot.val();
            this.setState(state);
        });
    };
    */

    // If the user is drawing display and act accordingly the different cases
    drawHandStroke() {
        const point = new Map({
            x: Math.floor(this.currentHandCoordinates.x * this.handDrawingScaleFactorX),
            y: Math.floor(this.currentHandCoordinates.y * this.handDrawingScaleFactorY),
        });
        // if first stroke
        if (this.state.lines.size === 0) {
            this.setState(prevState => ({
                lines: prevState.lines.push(new List([point])),
                colors: prevState.colors.push(prevState.strokeColor),
                fills: prevState.fills.push(prevState.fillColor),
                widths: prevState.widths.push(prevState.strokeWidth),
                isDrawing: true
            }));
        } else if (this.state.lines.get(-1).size > 0 && !this.state.isDrawing) {
            this.setState(prevState => ({
                lines: prevState.lines.push(new List([point])),
                colors: prevState.colors.push(prevState.strokeColor),
                fills: prevState.fills.push(prevState.fillColor),
                widths: prevState.widths.push(prevState.strokeWidth),
                isDrawing: true
            }));
        } else if (this.state.lines.get(-1).size > 0 && this.state.isDrawing) {
            if (this.handDrawing) {
                this.setState(prevState => ({
                    lines: updateIn(prevState.lines, [prevState.lines.size - 1], line => line.push(point)),
                }));
            } else {
                if (this.state.lines.last()) {
                    let processedLine = this.state.lines.last(); //processPoints(this.state.lines.last());

                    if (!processedLine.isEmpty()) {
                        this.setState(prevState => ({
                            lines: updateIn(prevState.lines, [prevState.lines.size - 1], _ => processedLine),
                            isDrawing: false
                        }));
                    } else {
                        this.setState(prevState => ({
                            lines: remove(prevState.lines, prevState.lines.size - 1),
                            colors: remove(prevState.colors, prevState.colors.size - 1),
                            fills: remove(prevState.fills, prevState.fills.size - 1),
                            widths: remove(prevState.widths, prevState.widths.size - 1),
                            isDrawing: false
                        }));
                    }
                }
            }
        }
    }

    // Event handler for mouse drawing
    handleMouseDown(mouseEvent) {
        if (mouseEvent.button !== 0) {
            return;
        }

        const point = relativeCoordinates(mouseEvent, this.canvasRef.current);

        this.setState(prevState => ({
            lines: prevState.lines.push(new List([point])),
            colors: prevState.colors.push(prevState.strokeColor),
            fills: prevState.fills.push(prevState.fillColor),
            widths: prevState.widths.push(prevState.strokeWidth),
            isDrawing: true
        }));
    }

    handleMouseMove(mouseEvent) {
        if (!this.state.isDrawing) {
            return;
        }

        const point = relativeCoordinates(mouseEvent, this.canvasRef.current);

        this.setState(prevState => ({
            lines: updateIn(prevState.lines, [prevState.lines.size - 1], line => line.push(point)),
        }));
    }

    handleMouseUp() {
        if (this.state.lines.last()) {
            let processedLine = this.state.lines.last(); //processPoints(this.state.lines.last());

            if (!processedLine.isEmpty()) {
                this.setState(prevState => ({
                    lines: updateIn(prevState.lines, [prevState.lines.size - 1], _ => processedLine),
                    isDrawing: false
                }));
            } else {
                this.setState(prevState => ({
                    lines: remove(prevState.lines, prevState.lines.size - 1),
                    colors: remove(prevState.colors, prevState.colors.size - 1),
                    fills: remove(prevState.fills, prevState.fills.size - 1),
                    widths: remove(prevState.widths, prevState.widths.size - 1),
                    isDrawing: false
                }));
            }
        }
    }

    // Clear the canvas of all the previous strokes
    clearCanvas = () => {
        this.resetCanvasDB();
        this.setState({
            lines: new List(),
            colors: new List(),
            fills: new List(),
            widths: new List(),
        });
    };

    // Change the stroke color
    changeColor = (color) => {
        this.setState({
            strokeColor: color,
        });
    };

    // Change the fill color
    changeColorFill = (color) => {
        this.setState({
            fillColor: color,
        });
    };

    // Change the stroke width
    changeStroke = (width) => {
        this.setState({
            strokeWidth: width,
        });
    };
    // Render the application
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-2">
                        <div className="row">
                            <Playersbar />
                        </div>
                        <div className="row">
                            <Sidebar
                                onColorPicked={this.changeColor}
                                onColorPickedFill={this.changeColorFill}
                                onClearCanvas={this.clearCanvas}
                                onStrokePicked={this.changeStroke}
                            />
                        </div>
                    </div>
                    <div className="col-8 p-0">
                        <div
                            className="drawArea"
                            ref={this.canvasRef}
                            onMouseDown={this.handleMouseDown}
                            onMouseMove={this.handleMouseMove}>
                            <Drawing
                                lines={this.state.lines}
                                color={this.state.colors}
                                fill={this.state.fills}
                                isDrawing={this.state.isDrawing}
                                width={this.state.widths}
                            />
                        </div>
                    </div>
                    <div className="col-2 p-0">
                        <Chat />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
