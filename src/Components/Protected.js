import React from 'react';
import ReactDOM from 'react-dom'
import events from 'events';
import GoldenLayout from 'golden-layout';
import OrderBook from './OrderBook';
import PositionData from './Positions';
import Orders from './Orders';
import OrderHistory from './OrderHistory';
import AccountBalance from './AccountBalance';
import BitmexSocket from './BitmexSocket';
import MainNavigation from './MainNavigation';

window.React = React;
window.ReactDOM = ReactDOM;

var emitter = new events.EventEmitter();
var global_ws = new BitmexSocket();
global_ws.setEmitter(emitter);

var onConnectListener = function() {
  let layoutconfig = {
    settings:{
      hasHeaders: true,
      constrainDragToContainer: false,
      reorderEnabled: false,
      selectionEnabled: false,
      popoutWholeStack: false,
      blockedPopoutsThrowError: true,
      closePopoutsOnUnload: true,
      showPopoutIcon: false,
      showMaximiseIcon: false,
      showCloseIcon: false
  },
  content: [
              {
                  type: 'column',
                  content:[
                              {
                                 type: 'row',
                                 height: 40,
                                 content:[
                                            {
                                                type:'react-component',
                                                component: 'OB',
                                                title: "XBTUSD",
                                                isClosable: false,
                                                props: { instrument: 'XBTUSD', fixed: 1, ws : global_ws }
                                            },{
                                                type:'react-component',
                                                component: 'OB',
                                                title: "ETHUSD",
                                                isClosable: false,
                                                props: { instrument: 'ETHUSD', fixed: 2, ws : global_ws }
                                            },{
                                                type:'react-component',
                                                component: 'OB',
                                                title: "ETHBTC",
                                                isClosable: false,
                                                props: { instrument: 'ETHM20', fixed: 5, ws: global_ws }
                                            }
                                         ]
                               },
                               {
                                  type: 'row',
                                   content:[
                                              {
                                                  type:'column',
                                                  content:[
                                                            {
                                                              type:'react-component',
                                                              component: 'PB',
                                                              title: "Positions",
                                                              isClosable: false,
                                                              props: { ws : global_ws },
                                                              height: 50,
                                                            },
                                                            {     type:'stack',
                                                                    content: [
                                                                    {
                                                                        type:'react-component',
                                                                        component: 'OR',
                                                                        title: "Orders",
                                                                        isClosable: false,
                                                                        props: { ws : global_ws },
                                                                    },
                                                                    {
                                                                        type: 'react-component',
                                                                        component: 'OH',
                                                                        title: 'History',
                                                                        isClosable: false,
                                                                        props: { orders : [] },
                                                                    }]
                                                                  }
                                                                
                                                          ]
                                                },
                                                {     type:'column',
                                                      width: 33.33,
                                                                    content: [
                                                                    {
                                                                        type:'react-component',
                                                                        component: 'AB',
                                                                        title: "Account",
                                                                        isClosable: false,
                                                                        props: { ws : global_ws },
                                                                    },
                                                                    ]
                                                }
                                                ]  },                                              
                                  ]
                               }
                               
                    ]
              };
     
    
  
  setTimeout(() => {
    var layout = new GoldenLayout(layoutconfig);
    layout.root = document.getElementById("root");
    layout.registerComponent("OR", Orders);
    layout.registerComponent("OB", OrderBook);
    layout.registerComponent("OH", OrderHistory);
    layout.registerComponent("PB", PositionData);
    layout.registerComponent("AB", AccountBalance);
    layout.init();
  }, 0);
}

class Protected extends React.Component {

    constructor() {
        super();
        emitter.addListener("connect", onConnectListener);
        global_ws.connect();
    }

    render() {
        return false;
    }
}

export default Protected;