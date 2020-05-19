import React, {Component} from 'react';
import { map } from 'rxjs/operators';
import { AccountBalanceService } from './AccountBalanceService';
import './AccountBalance.css';

class AccountBalance extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currency : "",
      walletBalance : 0,
      unrealizedProfit : 0,
      marginBalance : 0,
      maintMargin : 0,
      availableMargin: 0,
      marginLeverage : 0,
      ws: props.ws,
    };
  }
  
 componentWillUnmount() {
  this.subscription.unsubscribe();
 }
 
 componentDidMount() {
    this.setState({ws : this.props.ws }, () => {
        this.state.ws.subscribeAccount();
        });
      
    this.subscription = AccountBalanceService.getMessage().pipe(map(obj => obj)).subscribe(message => {
             this.handleData(message.message);
     });
  }

  handleData(data) {
        if (data[0].currency !== undefined)
            this.setState({ currency: data[0].currency});

        if (data[0].walletBalance !== undefined) 
            this.setState({ walletBalance: data[0].walletBalance});
        
        if (data[0].marginLeverage !== undefined) 
            this.setState({ marginLeverage: data[0].marginLeverage.toFixed(2)});
        
        if (data[0].marginBalance !== undefined) 
            this.setState({ marginBalance: data[0].marginBalance});
        
        if (data[0].maintMargin !== undefined) 
            this.setState({ maintMargin: data[0].maintMargin});
        
        if (data[0].availableMargin !== undefined) 
            this.setState({ availableMargin: data[0].availableMargin});
        
        if (data[0].unrealisedPnl !== undefined)
            this.setState({ unrealizedProfit: data[0].unrealisedPnl});
  }

  
  render() {
    return (
      <div className="AccountBalance">
        <table>
            <tbody>
                <tr><td>Wallet Balance</td><td>{this.state.walletBalance.toLocaleString('en', {useGrouping:true})} {this.state.currency}</td></tr>
                <tr><td>Unrealized Pnl</td><td>{this.state.unrealizedProfit.toLocaleString('en', {useGrouping:true})} {this.state.currency}</td></tr>
                <tr><td>Margin Balance</td><td>{this.state.marginBalance.toLocaleString('en', {useGrouping:true})} {this.state.currency}</td></tr>
                <tr><td>Maint Margin</td><td>{this.state.maintMargin.toLocaleString('en', {useGrouping:true})} {this.state.currency}</td></tr>
                <tr><td>Avlble Margin</td><td>{this.state.availableMargin.toLocaleString('en', {useGrouping:true})} {this.state.currency}</td></tr>
                <tr><td>margin leverage</td><td>{this.state.marginLeverage}</td></tr>
            </tbody>
        </table>
      </div>
    );
  }
}

export default AccountBalance;

