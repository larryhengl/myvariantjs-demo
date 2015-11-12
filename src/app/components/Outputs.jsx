'use strict';

import React from 'react';
const mixins = require('baobab-react/mixins');
import mui from 'material-ui';
const Paper = mui.Paper;
const RadioButtonGroup = mui.RadioButtonGroup;
const RadioButton = mui.RadioButton;
const List = mui.List;
const ListItem = mui.ListItem;
const FlatButton = mui.FlatButton;
const RaisedButton = mui.RaisedButton;
const SelectField = mui.SelectField;
const TextField = mui.TextField;

const DelIcon = require('../svg-icons/del.jsx');

import * as actions from '../actions.js';
import FieldListDialog from './FieldListDialog.jsx';


// -----------------  Outputs COMPONENT -------------------------------------- //
/* What this does:
 *  The +Fields Button opens the global fieldlist dialog showing available fields to filter/select.
  * All selected fields would be passed to the query output during the service call.
 *  The field list shows the active/selected fields.  You can add or remove accordingly.
 *  The Size element dictates how many rows to fetch from the service call. Default is 10.
 *   NOTE: For the github demo Size is disabled (and fixed at 10).  Remove <XXXX> to enable this element.
 * The From element is used for paging effect, to offest the result fetching (usually by pagesize).
 * The Copy From element allows for the output settings to be copied from a different search type (Exact, Search, Batch).
 *  Each search type can have their own output settings.
*/


const Outputs = React.createClass({
  mixins: [mixins.branch],

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  actions: {
    clearInput: actions.clearInput,
    removeField: actions.removeField,
    toggleFieldList: actions.toggleFieldList,
    copyOutput: actions.copyOutput,
  },

  cursors: {
    tabs: ['activeTabs'],
    activeQuery: ['activeQuery'],
    query: ['query'],
    copyOutputFrom: ['copyOutputFrom'],
  },

  getInitialState(){
    return {
      sizes: [
          {name:'10',value:10},
          {name:'50',value:50},
          {name:'100',value:100},
          {name:'1000',value:1000},
          {name:'all',value:50000}
        ]
      };
  },

  _handleSizeChange(e){
    this.cursors.query.select(this.state.tabs.Main,'output').set('size',e.target.value);
  },

  _handleFromChange(e){
    this.cursors.query.select(this.state.tabs.Main,'output').set('from',+e.target.value);
  },

  _copyOutput(e,s){
    if (e==='defaults') {
      this.actions.copyOutput(e);
    } else {
      this.actions.copyOutput(s);
    }
  },

  _handleSubmit(searchType){
    this.actions.fetchData(this.actions.formatRequest(searchType));
  },

  render() {
    const self = this;
    const output = [];

    if (self.state.tabs.Query==="output") {

      // construct the output fields list
      let outputFields = [];
      outputFields.push(<ListItem key={'outputAll'} className={'outputField'} primaryText={'All Fields'} />);
      if (self.state.activeQuery.output.fields.length) {
        outputFields = self.state.activeQuery.output.fields.map(function(f,i){
          return (
            <ListItem
              key={'output'+i}
              className={'outputFields'}
              primaryText={f}
              rightIcon={<DelIcon className="del" onTouchTap={self.actions.removeField.bind(null,f)} />} />
          );
        });
      }
      // construct the output component contents
      output.push(
        <div key={"outputs"} className="row">

          <div className="left col-xs-8 col-sm-8 col-md-8 col-lg-8">
            <div className="row">
              <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                <h3>Limit Output to the Following Fields...</h3>
              </div>
              <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                <RaisedButton
                  labelStyle={{padding:'0px'}}
                  style={{width: '100%'}}
                  label={'+ Fields'}
                  primary={true}
                  onClick={self.actions.toggleFieldList} >
                </RaisedButton>
              </div>
            </div>
            <Paper style={{margin:'1% 0'}}>
                <List>
                  {outputFields}
                </List>
            </Paper>
            <FieldListDialog source={"output"}/>
          </div>

          <div className="right col-xs-4 col-sm-4 col-md-4 col-lg-4">
            <Paper style={{padding: '20px'}}>
              <p>Copy Output Settings From...</p>
              <RadioButtonGroup
                name="copiers"
                defaultSelected={self.state.activeQuery.copyOutputFrom || ""}
                onChange={self._copyOutput} >
                <RadioButton
                  value="exact"
                  label="Exact"
                  style={{marginBottom:2}} />
                <RadioButton
                  value="search"
                  label="Search"
                  style={{marginBottom:2}} />
                <RadioButton
                  value="batch"
                  label="Batch"
                  style={{marginBottom:2}} />
              </RadioButtonGroup>
            </Paper>

            <Paper style={{padding: '20px'}}>
              <SelectField
                ref="selectSize"
                value={this.state.activeQuery.output.size}
                onChange={this._handleSizeChange}
                floatingLabelText="Select Row Batch Size"
                fullWidth={true}
                valueMember="value"
                displayMember="name"
                menuItems={this.state.sizes} />

              <TextField
                hintText="Assign Page Size Offset (optional)"
                floatingLabelText="Assign Page Size Offset (optional)"
                fullWidth={true}
                value={this.state.activeQuery.output.from}
                onChange={this._handleFromChange} />

              <div className='row outputButtons'>
                <FlatButton ref="btnSubmit" className="btnSubmit col-xs-6 col-sm-6 col-md-6 col-lg-6" label="Re-Submit Search" secondary={true} onTouchTap={self._handleSubmit.bind(null, this.state.tabs.Main)} />
                <FlatButton ref="btnReset" className="btnReset col-xs-6 col-sm-6 col-md-6 col-lg-6" label="Reset" secondary={true} onTouchTap={self._copyOutput.bind(null,'defaults')} />
              </div>

            </Paper>
          </div>
        </div>
      )
    }

    return (
      <div className={(self.state.tabs.Query==="output" ? "output" : "hidey")} >
       {output}
      </div>
    )
  }

});

module.exports = Outputs;
