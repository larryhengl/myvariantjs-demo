'use strict';

const flat = require('flat');
const React = require('react');
const mui = require('material-ui');
const mv = require('myvariantjs');
const utils = require('../utils');
const mixins = require('baobab-react/mixins');
const Tabs = mui.Tabs;
const Tab = mui.Tab;
const Paper = mui.Paper;
const Card = mui.Card;
const CardHeader = mui.CardHeader;
const CardText = mui.CardText;

import * as actions from '../actions.js';
import Summary from './Summary.jsx';
import Inputs from './Inputs.jsx';
import Outputs from './Outputs.jsx';
import Results from './Results.jsx';

// --------------- MAIN QUERY ---------------------------------------- //
const Query = React.createClass({
  mixins: [mixins.branch],
  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  actions: {
    //setWatchers: actions.setWatchers,
  },

  cursors: {
    colors: ['colors'],
    activeTabs: ['activeTabs'],
    activeQuery: ['activeQuery'],
  },

  componentDidMount(){
    //this.actions.setWatchers;
  },

  _setTab(t){
    if (this.state.activeTabs.Main !== t) {
      this.cursors.activeTabs.set('Main',t);
      if (['passthru','examples'].indexOf(t) > -1 && this.state.activeTabs.Query === 'output') this.cursors.activeTabs.set('Query','input');
    }
  },

  render() {
    const tabs = this.state.activeTabs;
    const self = this;

    // -------------------- RENDER --------------------------------------- //
    return (
      <div className="query col-xs-12 col-sm-12 col-md-12 col-lg-12">

        <Tabs style={{'paddingBottom':'1.5em'}} value={tabs.Main}>

          {/* -------- Exact Tab --------------*/}
          <Tab label="Exact" className="query-tab col-xs-2 col-sm-2 col-md-2 col-lg-2" style={{color:this.state.colors.green}} value="exact" onActive={this._setTab.bind(this,'exact')}>
          </Tab>


          {/* -------- Search Tab --------------*/}
          <Tab label="Search" className="query-tab col-xs-2 col-sm-2 col-md-2 col-lg-2" style={{color:this.state.colors.green}} value="search" onActive={this._setTab.bind(this,'search')}>
          </Tab>


          {/* -------- Batch Tab --------------*/}
          <Tab label="Batch" className="query-tab col-xs-2 col-sm-2 col-md-2 col-lg-2" style={{color:this.state.colors.green}} value="batch" onActive={this._setTab.bind(this,'batch')}>
          </Tab>


          {/* -------- Pass-Thru Tab --------------*/}
          <Tab label="Pass-Thru" className="query-tab col-xs-2 col-sm-2 col-md-2 col-lg-2" style={{color:this.state.colors.green}} value="passthru" onActive={this._setTab.bind(this,'passthru')}>
          </Tab>


          {/* -------- Examples Tab --------------*/}
          <Tab label="Examples" className="query-tab col-xs-2 col-sm-2 col-md-2 col-lg-2" style={{color:this.state.colors.green}} value="examples" onActive={this._setTab.bind(this,'examples')}>
          </Tab>

        </Tabs>


        <Paper style={{'padding':'20px 25px'}}>
          <Summary />
          <Inputs />
          <Outputs />
          <Results />
        </Paper>

      </div>
    );
  },

});

module.exports = Query;
