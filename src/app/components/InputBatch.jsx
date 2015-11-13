'use strict';

import React from 'react';
import mui from 'material-ui';
const mixins = require('baobab-react/mixins');
const Paper = mui.Paper;
const Card = mui.Card;
const CardText = mui.CardText;
const TextField = mui.TextField;
const FlatButton = mui.FlatButton;
const RaisedButton = mui.RaisedButton;
const List = mui.List;
const ListItem = mui.ListItem;

const DelIcon = require('../svg-icons/del.jsx');

import * as actions from '../actions.js';
import FieldListDialog from './FieldListDialog.jsx';

// ----------------- PassThruInput COMPONENT -------------------------- //
/* What this does:
*/

const BatchInput = React.createClass({
  mixins: [mixins.branch],

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  actions: {
    toggleFieldList: actions.toggleFieldList,
    removeField: actions.removeField,
    clearInput: actions.clearInput,
    setFieldCursor: actions.setFieldCursor,
    formatRequest: actions.formatRequest,
    fetchData: actions.fetchData,
  },

  cursors: {
    tabs: ['activeTabs'],
    activeQuery: ['activeQuery'],
    input: ['query','batch','input'],
  },

  _handleInputChange(e){
    this.cursors.input.set(e.target.value);
  },

  _handleSubmit(searchType){
    this.actions.fetchData(this.actions.formatRequest(searchType));
  },

  render() {
    const input = [];

    if (this.state.tabs.Main==="batch" && this.state.tabs.Query==="input") {

      // construct the scope fields list
      let scopefields = [];
      scopefields.push(<ListItem key={'scopeAll'} className={'scopeField'} primaryText={'All Indexed Fields'} />);
      if (this.state.activeQuery.scope && this.state.activeQuery.scope.length) {
        scopefields = this.state.activeQuery.scope.map((f,i) => {
          return (
            <ListItem
              key={'scope'+i}
              className={'scopefields'}
              primaryText={f}
              rightIcon={<DelIcon className="del" onTouchTap={this.actions.removeField.bind(null,f)} />} />
          );
        });
      }

      // construct the input component contents
      input.push(
        <div key={"inputall"}>
          <Card>

            <CardText>
              <div className='qSearch'>
                <div className='row'>
                  <div className='col-xs-4 col-sm-4 col-md-4 col-lg-4'>
                    <h3>Batch Search</h3>
                  </div>
                  <div className='col-xs-8 col-sm-8 col-md-8 col-lg-8'>
                    <FlatButton ref="btnClear" className="btnClear" label="Clear" secondary={true} onTouchTap={this.actions.clearInput.bind(null,'batch')} />
                    <FlatButton ref="btnSubmit" className="btnSubmit" label="Submit" secondary={true} onTouchTap={this._handleSubmit.bind(null,'batch')} />
                  </div>
                </div>

                <TextField
                  ref={'passthruTerm'}
                  hintText="URL"
                  floatingLabelText="Enter an URL"
                  fullWidth={true}
                  onChange={this._handleInputChange}
                  value={this.state.input} />

                <div className="row" style={{marginTop:'40px'}}>
                  <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                    <h3>Limit search scope to the following fields...</h3>
                  </div>
                  <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <RaisedButton
                      labelStyle={{padding:'0px'}}
                      style={{width: '100%'}}
                      label={'+ Fields'}
                      primary={true}
                      onClick={this.actions.toggleFieldList} >
                    </RaisedButton>
                  </div>
                </div>
                <Paper style={{margin:'1% 0'}}>
                    <List>
                      {scopefields}
                    </List>
                </Paper>
                <FieldListDialog source={"scope"}/>
              </div>
            </CardText>

            <CardText>
              <div className="search-notes">
               <h3>Notes</h3>
                <p>For Batch searches, you enter comma-saparated terms.</p>
                <p>You can optionally add fields to limit the search to.</p>
                <pre>
                  <p></p>
                </pre>
              </div>
            </CardText>
          </Card>
        </div>
      )
    } // end if


    return (
      <div className={(this.state.tabs.Query==="input" ? "passthru input" : "hidey")} >
       {input}
      </div>
    )
  }

});

module.exports = BatchInput;
