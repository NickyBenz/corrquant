import React, {Component} from 'react';
import { map } from 'rxjs/operators';
import Position from './Position';
import { PositionDataService } from './PositionDataService';
import './PositionData.css';

class PositionData extends Component {

  constructor(props) {
    super(props);
    this.state = {
      positions: [],
      ws: props.ws,
    };
  }
  
 componentWillUnmount() {
  this.subscription.unsubscribe();
 }
 
 componentDidMount() {
    this.setState({ws : this.props.ws }, () => {
        this.state.ws.subscribePositions();
        });
      
    this.subscription = PositionDataService.getMessage().pipe(map(obj => obj)).subscribe(message => {
             this.handleData(message.message);
     });
  }

  handleData(items) {
    let pos = [];
    for (let i =0; i < this.state.positions.length; ++i)
    {
        pos.push(this.state.positions[i]);
    }
    for (let i =0; i < items.length; ++i)
    {
        const idx = pos.findIndex(_item => _item.symbol === items[i].symbol);
        if (idx > -1) 
        {
            if (items[i].currentQty !== undefined)
                pos[idx].quantity = items[i].currentQty;

            if (items[i].avgCostPrice !== undefined)
                pos[idx].entryPrice = items[i].avgCostPrice;

            if (items[i].lastPrice !== undefined)
                pos[idx].lastPrice = items[i].lastPrice;

            if (items[i].markPrice !== undefined)
                pos[idx].markPrice = items[i].markPrice;

            if (items[i].liquidationPrice !== undefined)
                pos[idx].liquidationPrice = items[i].liquidationPrice;

            if (items[i].unrealisedPnl !== undefined)
                pos[idx].unrealisedPnl = items[i].unrealisedPnl;

            if (items[i].posComm !== undefined)
                pos[idx].posComm = items[i].posComm;

            if (items[i].homeNotional !== undefined)
                pos[idx].notional = items[i].homeNotional;

        }
        else
        {
            let newpos = {};
            newpos.symbol = items[i].symbol;
            newpos.currency = items[i].currency;
            newpos.quantity = items[i].currentQty;
            newpos.entryPrice = items[i].avgCostPrice;
            newpos.lastPrice = items[i].lastPrice;
            newpos.markPrice = items[i].markPrice;
            newpos.liquidationPrice = items[i].liquidationPrice;
            newpos.unrealisedPnl = items[i].unrealisedPnl;
            newpos.posComm = items[i].posComm;
            newpos.notional = items[i].homeNotional;
            pos.push(newpos);
        }
    }  

    this.setState( { positions : pos });
  }

  
  render() {
    let deepCopyArrayOfObj = (arr => arr.map(position => Object.assign({}, position)));

    // Deep copy and sort orders
    let positions = deepCopyArrayOfObj(this.state.positions);

    function renderPositions(ComponentClass, positions) {
      return positions.map((position, index) => {
        return (<ComponentClass key={index} {...position} />);
      });
    }

    return (
      <div className="PositionData">
        <table>
            <thead><tr>
            <th>Symbol</th>
            <th>Quantity</th>
            <th>Currency</th>
            <th>Notional</th>
            <th>Entry</th>
            <th>Last</th>
            <th>Mark</th>
            <th>Liquidation</th>
            <th>Live Pnl</th>
            <th>Commission</th></tr></thead>
            <tbody>
            {renderPositions(Position, positions)}
            </tbody>
        </table>
      </div>
    );
  }
}

export default PositionData;
