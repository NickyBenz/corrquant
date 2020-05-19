import {Component} from 'react';
import crypto from 'crypto-js';
import { MarketDataService } from './MarketDataService';
import { PositionDataService } from './PositionDataService';
import { AccountBalanceService } from './AccountBalanceService';
import { LiveOrderService } from './LiveOrderService';

class BitmexSocket extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ws: null,
            emitter: null,
        };
    }

    setEmitter(emitter) { this.state = { ws: null, emitter: emitter}; }

    render() { return false; }

    subscribeLiveOrders() {
        if (this.state.ws != null)
        {
            var req = {"op" : "subscribe", "args": "order"};
            this.state.ws.send(JSON.stringify(req));
        }
    }

    subscribeAccount() {
        if (this.state.ws != null)
        {
            var req = {"op" : "subscribe", "args": "margin"};
            this.state.ws.send(JSON.stringify(req));
        }
    }

    subscribePositions() {
        if (this.state.ws != null)
        {
            var req = {"op" : "subscribe", "args": "position"};
            this.state.ws.send(JSON.stringify(req));
        }
    }
    subscribeOrderBook(topic) {

        if (this.state.ws != null)
        {
            var req = {"op": "subscribe", "args": topic};
            this.state.ws.send(JSON.stringify(req));
        }
        else
        {
            console.log('web socket is not initialized');
        }
    }

    timeout = 250; // Initial timeout duration as a class variable

    /**
     * @function connect
     * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
     */
    connect = (emitter) => {
        var ws = new WebSocket("wss://www.bitmex.com/realtime");
        let that = this; // cache the this
        var connectInterval;
        // websocket onopen event listener
         ws.onopen = () => {
            console.log("connected websocket main component");

            var expires = Math.round(new Date().getTime() / 1000) + 60; // 1 min in the future
            var signature = crypto.HmacSHA256('GET/realtime' + expires, "-7WPuRxgmNDNyx5S2YUotCf_-EQBVT47XtBGPbiHjpMLk5xg");
            signature = crypto.enc.Hex.stringify(signature);
            var req = {"op": "authKeyExpires", "args": ["csfqcId4lFq3Kp9A7MGne-Ii", expires, signature]}
            ws.send(JSON.stringify(req));
    
            this.state.ws = ws;
            this.state.emitter.emit("connect");
            that.timeout = 250; // reset timer to 250 on open of websocket connection 
            clearTimeout(connectInterval); // clear Interval on on open of websocket connection
        };

        // websocket onclose event listener
        ws.onclose = e => {
            console.log(
                `Socket is closed. Reconnect will be attempted in ${Math.min(
                    10000 / 1000,
                    (that.timeout + that.timeout) / 1000
                )} second.`,
                e.reason
            );

            that.timeout = that.timeout + that.timeout; //increment retry interval
            connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
        };

        // websocket onerror event listener
        ws.onerror = err => {
            console.error(
                "Socket encountered error: ",
                err.message,
                "Closing socket"
            );

            ws.close();
        };

        ws.onmessage = evt => {
            const message = JSON.parse(evt.data);
            if (message.hasOwnProperty("table"))
            {
                 if (message.table === "orderBook10")
                 {
                     if (message.data != null)
                     {
                        MarketDataService.sendMessage(message.data[0]);
                     }
                 }
                 else if (message.table === "position")
                 {
                     if (message.data != null)
                     {
                         PositionDataService.sendMessage(message.data);
                     }
                 }
                 else if (message.table === "margin")
                 {
                     if (message.data != null)
                     {
                          AccountBalanceService.sendMessage(message.data);
                     }
                 }
                 else if (message.table === "order")
                 {
                     if (message.data != null)
                     {
                         LiveOrderService.sendMessage(message);
                     }
                 }
            }
            else
            {
                //console.log(evt.data);
            }
        }
    };

    /**
     * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
     */
    check = () => {
        const { ws } = this.state;
        if (!ws || ws.readyState === WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
    };    
}

export default BitmexSocket;