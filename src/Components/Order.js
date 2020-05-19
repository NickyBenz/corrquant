import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Order extends Component {
  render() {
        return (               
        <tr>
            <td>{this.props.symbol}</td>
            <td>{this.props.side}</td>
            <td>{this.props.currency}</td>
            <td>{this.props.orderQty}</td>
            <td>{this.props.ordType}</td>
            <td>{this.props.ordStatus}</td>
            <td>{this.props.cumQty}</td>
            <td>{this.props.timestamp}</td>
        </tr>

        );
  }
}


Order.propTypes = {
    symbol: PropTypes.string,
    side: PropTypes.string,
    currency: PropTypes.string,
    orderQty: PropTypes.number,
    ordType: PropTypes.string,
    ordStatus: PropTypes.string,
    cumQty: PropTypes.number,
    timestamp: PropTypes.string,
  };

export default Order;