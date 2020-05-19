import React, { Component } from 'react';
import crypto from 'crypto-js';
import Order from './Order';
import './Order.css';

class OrderHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
          orders: [],
        };
      }

    componentWillUnmount() {

    }
    
  componentDidMount() {
    this.loadData();
    //setInterval(this.loadData, 10000);
  }

  async loadData() {
     try {
        var expires = Math.round(new Date().getTime() / 1000) + 60; // 1 min in the future
        var path = "/api/v1/order?count=10&reverse=true"
        var signature = crypto.HmacSHA256("GET" + path + expires.toString(), "-7WPuRxgmNDNyx5S2YUotCf_-EQBVT47XtBGPbiHjpMLk5xg");
        signature = crypto.enc.Hex.stringify(signature);
        const res = await fetch("https://cors-anywhere.herokuapp.com/https://www.bitmex.com" + path, { 
            headers: 
            { 
                'api-key': "csfqcId4lFq3Kp9A7MGne-Ii",
                'api-expires': expires, 
                'api-signature': signature, 
            }
        });
        const data = await res.json();
        this.handleData(data);
    } catch (e) {
        console.log(e);
    }
  }

handleData(data) {
    let orders = []
    for(let i=0; i < data.length; ++i)
    {
        let dat = data[i];
        let obj = {}
        obj.symbol = dat.symbol;
        obj.side = dat.side;
        obj.currency = dat.currency;
        obj.orderQty = dat.orderQty;
        obj.ordType = dat.ordType;
        obj.ordStatus = dat.ordStatus;
        obj.cumQty = dat.cumQty;
        obj.timestamp = dat.timestamp.toString();
        orders.push(obj);
    }

    this.setState({ orders : orders});
}

    render() {
        let deepCopyArrayOfObj = (arr => arr.map(order => Object.assign({}, order)));

        // Deep copy and sort orders
        let orders = deepCopyArrayOfObj(this.state.orders);
    
        function renderOrders(ComponentClass, orders) {
          return orders.map((order, index) => {
            return (<ComponentClass key={index} {...order} />);
          });
        }
    
        return (
            <div className="Order">
            <table>
                <thead>
                    <tr>
                    <th style={{width:'10ch'}}>Symbol</th>
                    <th style={{width:'10ch'}}>Side</th>
                    <th style={{width:'10ch'}}>Currency</th>
                    <th style={{width:'10ch'}}>OrderQty</th>
                    <th style={{width:'10ch'}}>OrderType</th>
                    <th style={{width:'10ch'}}>OrdStatus</th>
                    <th style={{width:'10ch'}}>CumQty</th>
                    <th style={{width:'50ch'}}>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                {renderOrders(Order, orders)}
                </tbody>
            </table>
            </div>
        );
    }
 }


export default OrderHistory;