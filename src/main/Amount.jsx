import React, { Component } from "react";

const App = () => (
    <div>
      <h1>US Dollar to Euro:</h1>
      <Amount render={amount => <Euro amount={amount} />} />
  
      <h1>US Dollar to Pound:</h1>
      <Amount render={amount => <Pound amount={amount} />} />
    </div>
  );
  
  class Amount extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        amount: 0,
      };
    }
  
    onIncrement = () => {
      this.setState(state => ({ amount: state.amount + 1 }));
    };
  
    onDecrement = () => {
      this.setState(state => ({ amount: state.amount - 1 }));
    };
  
    render() {
      return (
        <div>
          <button type="button" onClick={this.onIncrement}>
            +
          </button>
          <button type="button" onClick={this.onDecrement}>
            -
          </button>
  
          <p>US Dollar: {this.state.amount}</p>
  
          {this.props.render(this.state.amount)}
        </div>
      );
    }
  }
  
  const Euro = ({ amount }) => <p>Euro: {amount * 0.86}</p>;
  
  const Pound = ({ amount }) => <p>Pound: {amount * 0.76}</p>;


  export default App;
  