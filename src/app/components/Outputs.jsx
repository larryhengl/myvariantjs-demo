'use strict';

import React from 'react';
const mixins = require('baobab-react/mixins');
import mui from 'material-ui';
const Paper = mui.Paper;
const List = mui.List;
const ListItem = mui.ListItem;
const RaisedButton = mui.RaisedButton;
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
    removeField: actions.removeField,
    toggleFieldList: actions.toggleFieldList,
  },

  cursors: {
    tab: ['activeTabs','Query'],
    activeQuery: ['activeQuery'],    
  },

  render() {
    const self = this;
    const output = [];
    if (self.state.tab==="output") {
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
        <div key={"outputs"}>
          <div style={{marginTop: '20px', marginLeft: '47.5%'}}>
            <RaisedButton
              labelStyle={{'padding':'0px'}}
              label={'+ Fields'}
              primary={true}
              onClick={self.actions.toggleFieldList} >
            </RaisedButton>
          </div>
          <Paper style={{margin:'1% 20%'}}>
              <List>
                {outputFields}
              </List>
          </Paper>
          <FieldListDialog />
        </div>
      )
    }

    return (
      <div className={(self.state.tab==="output" ? "output" : "hidey")} >
       {output}
      </div>
    )
  }

});

module.exports = Outputs;
