import React, { Component } from 'react';
import { map } from 'rxjs/operators';
import { LiveOrderService } from './LiveOrderService';
import Order from './Order';
import './Order.css';

class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
          orders: [],
          ws: null,
        };
      }

    componentWillUnmount() {
    this.subscription.unsubscribe();
    }
    
    componentDidMount() {
        this.setState({ws : this.props.ws }, () => {
            this.state.ws.subscribeLiveOrders();
            });
        
        this.subscription = LiveOrderService.getMessage().pipe(map(obj => obj)).subscribe(message => {
                this.handleData(message.message);
        });
    }

    handleData(message) {
        if (message.action === "insert")
        {
            for(let i=0; i < message.data.length; ++i)
            {
                let dat = message.data[i];
                let obj = {}
                obj.orderId = dat.orderId;
                obj.symbol = dat.symbol;
                obj.side = dat.side;
                obj.currency = dat.currency;
                obj.orderQty = dat.orderQty;
                obj.ordType = dat.ordType;
                obj.ordStatus = dat.ordStatus;
                obj.cumQty = dat.cumQty;
                obj.timestamp = dat.timestamp;
                this.state.orders.push(obj);
            }
        }
        else if (message.action === "delete")
        {
            for(let j=0; j < message.data.length; ++j)
            {
                for (let i = this.state.orders.length - 1; i >= 0; --i) {
                    if (this.state.orders[i].orderId === message.data[j].orderId) {
                        this.state.orders.splice(i,1);
                    }
                }
            }
        }
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


export default Orders;