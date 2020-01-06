import React from 'react';
import './popup.css';

class Popup extends React.Component {
    render() {
        return (
            <div className='popup'>
                <div className='popup\_inner'>
                    <h1>{this.props.text}</h1>
                    <button className="btn btn-danger ml-2" onClick={this.props.removerMembro}>Sim</button>
                    <button className="btn btn-info" onClick={this.props.closePopup}>Não</button>
                </div>
            </div>
        );
    }
}

export default Popup;