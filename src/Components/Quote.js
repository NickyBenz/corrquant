import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Quote extends Component {
  render() {
      if (this.props.reorder) {
        return (
          <tr className="BidOrders">
          <td>{this.props.quantity}</td>
          <td>{this.props.price.toFixed(this.props.fixed)}</td>
          <td></td>
          <td></td>
        </tr>
        );
      } else {
        return (
          <tr className="AskOrders">
          <td></td>
          <td></td>
          <td>{this.props.price.toFixed(this.props.fixed)}</td>
          <td>{this.props.quantity}</td>
        </tr>
        );
      }
  }
}

Quote.propTypes = {
  quantity: PropTypes.number,
  price: PropTypes.number,
  fixed: PropTypes.number,
  reorder: PropTypes.bool,
};

export default Quote;