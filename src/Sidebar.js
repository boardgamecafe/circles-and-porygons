// Import React components
import React from 'react'
// Import a Color Picker implementation
import { TwitterPicker } from 'react-color'
// Adding css styling
import './Sidebar.css';
// Import a Slider implementation
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        // Initialize React state - they trigger re-rendering
        this.state = {
            displayColorPicker: false,
            colorPicked: '#4284f5',
            displayColorPickerFill: false,
            colorPickedFill: 'transparent',
            width: 5,
            developers: [{
                uid: 2,
                name: "paul",
                role: "CEO"
            }]
        };
    }


    // Setup event handlers
    handleClickPicker = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };
    handleClosePicker = () => {
        this.setState({ displayColorPicker: false })
    };
    handleChangeColor = (color) => {
        this.setState({ colorPicked: color.hex });
        this.props.onColorPicked(color.hex);
    };

    handleClickPickerFill = () => {
        this.setState({ displayColorPickerFill: !this.state.displayColorPickerFill })
    };

    handleClosePickerFill = () => {
        this.setState({ displayColorPickerFill: false })
    };

    handleChangeColorFill = (color) => {
        this.setState({ colorPickedFill: color.hex });
        this.props.onColorPickedFill(color.hex);
    };

    handleChangeWidth = (width) => {
        this.setState({ width: width });
        this.props.onStrokePicked(width);
    };

    handleSubmit = event => {
        event.preventDefault();
        let name = this.refs.name.value;
        let role = this.refs.role.value;
        let uid = this.refs.uid.value;

        if (uid && name && role) {
            const { developers } = this.state;
            const devIndex = developers.findIndex(data => {
                return data.uid === uid;
            });
            developers[devIndex].name = name;
            developers[devIndex].role = role;
            this.setState({ developers });
        } else if (name && role) {
            const uid = new Date().getTime().toString();
            const { developers } = this.state;
            developers.push({ uid, name, role });
            this.setState({ developers });
        }

        this.refs.name.value = "";
        this.refs.role.value = "";
        this.refs.uid.value = "";
    };

    render() {
        const developers = this.state.developers;

        // Initialize inline styling to change dynamically the picker color
        const smallColoredSquare = {
            width: '14px',
            height: '14px',
            borderRadius: '2px',
            background: this.state.colorPicked,
        };

        const smallColoredSquareFill = {
            width: '14px',
            height: '14px',
            borderRadius: '2px',
            background: this.state.colorPickedFill,
        };

        // Render the sidebar element by element
        return (
            <div className="sidebar" >
                sidebar
                <button
                    className="sidebar-menu-element btn-secondary"
                    onClick={() => this.props.onClearCanvas()}
                    variant="light"
                >
                    Clear Canvas
                </button>

                <div className="sidebar-menu-element picker-text-style row">
                    <p>Stroke Color</p>
                    <div
                        className="square-container"
                        onClick={this.handleClickPicker}
                    >
                        <div style={smallColoredSquare} />
                    </div>
                    {this.state.displayColorPicker ? <div className="popover">
                        <div className="cover" onClick={this.handleClosePicker} />
                        <TwitterPicker
                            onChangeComplete={this.handleChangeColor}
                        />
                    </div> : null}
                </div>

                <div className="sidebar-menu-element picker-text-style row">
                    <p>Fill Color</p>
                    <div
                        className="square-container"
                        onClick={this.handleClickPickerFill}
                    >
                        <div style={smallColoredSquareFill} />
                    </div>
                    {this.state.displayColorPickerFill ? <div className="popover">
                        <div className="cover" onClick={this.handleClosePickerFill} />
                        <TwitterPicker
                            onChangeComplete={this.handleChangeColorFill}
                        />
                    </div> : null}
                </div>
                <div className='slider orientation-reversed'>
                    <div className='slider-group'>
                        <div className='slider-horizontal'>
                            <div className="sidebar-menu-element picker-text-style">
                                <p>Stroke Width</p>
                            </div>
                            <Slider
                                min={1}
                                max={20}
                                value={this.state.width}
                                orientation='horizontal'
                                onChange={this.handleChangeWidth}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Sidebar;
