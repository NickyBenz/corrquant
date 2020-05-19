import React, {Component} from 'react';
import { filter, map } from 'rxjs/operators';
import Quote from './Quote';
import { MarketDataService } from './MarketDataService';
import './OrderBook.css';

class OrderBook extends Component {

  constructor(props) {
    super(props);
    this.state = {
      instrument: props.instrument,
      fixed: props.fixed,
      askOrders: [],
      bidOrders: [],
      ws: props.ws,
    };
  }
  
 componentWillUnmount() {
  this.subscription.unsubscribe();
 }
 
 componentDidMount() {
    this.setState({ws : this.props.ws }, () => {
    this.state.ws.subscribeOrderBook("orderBook10:" + this.state.instrument);
    });
    this.subscription = MarketDataService.getMessage().pipe(map(obj => obj),
      filter(obj => 
            { 
                if (obj != null && obj !== undefined)
                {
                  return obj.message.symbol === this.state.instrument; 
                }
              })).subscribe(message => {
             this.handleData(message.message);
     });
  }

  handleData(data) {
    let orderData = data;

    let askOrders = orderData.asks.map(ask => ({
      price: ask[0],
      quantity: ask[1],
      fixed: this.props.fixed,
      reorder: false,
    }));

    let bidOrders = orderData.bids.map(bid => ({
      price: bid[0],
      quantity: bid[1],
      fixed: this.props.fixed,
      reorder: true,
    }));

    this.setState({
      askOrders: askOrders,
      bidOrders: bidOrders
    });
  }

  render() {
    let deepCopyArrayOfObj = (arr => arr.map(order => Object.assign({}, order)));

    // Deep copy and sort orders
    let askOrders = deepCopyArrayOfObj(this.state.askOrders).sort((a, b) => a.price > b.price); // ascending order
    let bidOrders = deepCopyArrayOfObj(this.state.bidOrders).sort((a, b) => a.price < b.price); // descending order


    function renderOrders(ComponentClass, orders) {
      let topOrders = orders.slice(0,5);
      return topOrders.map((order, index) => {
        return (<ComponentClass key={index} {...order} />);
      });
    }

    return (
      <div className="OrderBook">
        <table>
          <thead>
            <tr>
              <th>BuyQ</th>
              <th>BuyP</th>
              <th>SellP</th>
              <th>SellQ</th>
            </tr>
          </thead>
          <tbody>
            {renderOrders(Quote, askOrders).reverse()}
          </tbody>
          <tbody>
            {renderOrders(Quote, bidOrders)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default OrderBook;
