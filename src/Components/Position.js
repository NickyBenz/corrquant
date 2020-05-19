import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Position extends Component {
  render() {
        return (
          <tr className="Position">
          <td>{this.props.symbol}</td>
          {this.props.quantity < 0 &&
          <td data-negative>{this.props.quantity}</td>}
          {this.props.quantity >= 0 &&
          <td>{this.props.quantity}</td>}

          <td>{this.props.currency}</td>
          {this.props.notional < 0 && 
          <td data-negative>{this.props.notional.toFixed(4).toLocaleString('en', {useGrouping:true})}</td>}
          {this.props.notional >= 0 && 
          <td>{this.props.notional.toFixed(4).toLocaleString('en', {useGrouping:true})}</td>}
          
          <td>{this.props.entryPrice}</td>
          <td>{this.props.lastPrice}</td>
          <td>{this.props.markPrice}</td>
          <td>{this.props.liquidationPrice}</td>
          {this.props.unrealisedPnl < 0 &&
          <td data-negative>{this.props.unrealisedPnl.toLocaleString('en', {useGrouping:true})}</td>}
          {this.props.unrealisedPnl >= 0 &&
          <td>{this.props.unrealisedPnl.toLocaleString('en', {useGrouping:true})}</td>}
          <td data-negative>{(-this.props.posComm).toLocaleString('en', {useGrouping:true})}</td>
        </tr>
        );
  }
}

Position.propTypes = {
  symbol: PropTypes.string,
  quantity: PropTypes.number,
  currency: PropTypes.string,
  lastPrice: PropTypes.number,
  markPrice: PropTypes.number,
  entryPrice: PropTypes.number,
  liquidationPrice: PropTypes.number,
  unrealisedPnl: PropTypes.number,
  posComm: PropTypes.number,
  notional: PropTypes.number,
};

export default Position;