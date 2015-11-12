'use strict';

import React from 'react';
import mui from 'material-ui';
const mixins = require('baobab-react/mixins');
const utils = require('../utils');
const List = mui.List;
const ListItem = mui.ListItem;
const ListDivider = mui.ListDivider;
const SvgIcon = mui.SvgIcon;
const IconButton = mui.IconButton;
const ArrowRightIcon = require('../svg-icons/chevron-right.jsx');


import * as actions from '../actions.js';

// ----------------- ExamplesInput COMPONENT -------------------------------------- //
/* What this does:
*/


const ExamplesInput = React.createClass({
  mixins: [mixins.branch],

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  actions: {
    fetchData: actions.fetchData,
  },

  cursors: {
    colors: ['colors'],
    tabs: ['activeTabs'],
    examples: ['query','examples'],
    lastExample: ['query','examples','lastExample'],
  },

  _listItemTap(val) {
    this.actions.fetchData(val);
  },

  render() {
    const input = [];

    if (this.state.tabs.Main==="examples" && this.state.tabs.Query==="input") {

      // ----------------- example LIST ITEM COMPONENT -------------------------------------- //
      let ExampleItem = React.createClass({
        render(){
          return (
            <ListItem
              primaryText={
                <div className="row">
                  <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                    <ArrowRightIcon style={{fill: (this.props.lastExample===this.props.example.num ? this.props.colors.green : this.props.colors.white)}} width="50" height="50" className="chevron-right" />
                  </div>
                  <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11">
                    <span className="itemPrimaryTitle" style={{color: this.props.colors.green}} dangerouslySetInnerHTML={utils._htmlify(this.props.example.title1)}></span><br/>
                    <span className="itemSecondaryTitle title2">{this.props.example.title2}</span>
                  </div>
                </div>
              }
              onTouchTap={this.props.onListItemTap.bind(null,this.props.example.num)} />
          )
        }
      });

      // ---------------- EXAMPLE example ITEMS ----------------------------- //
      let items = this.state.examples.data.map((a,i)=>{
        return (
          <ExampleItem
            key={"example"+i}
            colors={this.state.colors}
            example={a}
            lastExample={this.state.lastExample}
            onListItemTap={this._listItemTap} />
          );
      });
      items.splice(2,0,<ListDivider key="divider1" />);
      items.splice(5,0,<ListDivider key="divider2" />);

      input.push(
        <List key="examplesInput" insetSubheader={true} subheader={"Click an Example below"}>
          {items}
        </List>
      )
    }

    return (
      <div className={(this.state.tabs.Query==="input" ? "input examples" : "hidey")} >
       {input}
      </div>
    )
  }

});

module.exports = ExamplesInput;
