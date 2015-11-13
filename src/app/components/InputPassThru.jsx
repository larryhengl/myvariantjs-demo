'use strict';

import React from 'react';
import mui from 'material-ui';
const mixins = require('baobab-react/mixins');
const Card = mui.Card;
const CardText = mui.CardText;
const TextField = mui.TextField;
const FlatButton = mui.FlatButton;

import * as actions from '../actions.js';

// ----------------- PassThruInput COMPONENT -------------------------- //
/* What this does:
*/

const PassThruInput = React.createClass({
  mixins: [mixins.branch],

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  actions: {
    toggleFieldList: actions.toggleFieldList,
    removeSearchField: actions.removeSearchField,
    clearInput: actions.clearInput,
    setFieldCursor: actions.setFieldCursor,
    formatRequest: actions.formatRequest,
    fetchData: actions.fetchData,
  },

  cursors: {
    tabs: ['activeTabs'],
    input: ['query','passthru','input'],
  },

  _handleInputChange(e){
    this.cursors.input.set(e.target.value);
  },


  _handleSubmit(searchType){
    this.actions.fetchData(this.actions.formatRequest(searchType));
  },

  render() {
    const input = [];

    if (this.state.tabs.Main==="passthru" && this.state.tabs.Query==="input") {
      // construct the input component contents
      input.push(
        <div key={"inputall"}>
          <Card>

            <CardText>
              <div className='qSearch'>
                <div className='row'>
                  <div className='col-xs-4 col-sm-4 col-md-4 col-lg-4'>
                    <h3>Pass-Thru Search</h3>
                  </div>
                  <div className='col-xs-8 col-sm-8 col-md-8 col-lg-8'>
                    <FlatButton ref="btnClear" className="btnClear" label="Clear" secondary={true} onTouchTap={this.actions.clearInput.bind(null,'passthru')} />
                    <FlatButton ref="btnSubmit" className="btnSubmit" label="Submit" secondary={true} onTouchTap={this._handleSubmit.bind(null,'passthru')} />
                  </div>
                </div>

                <TextField
                  ref={'passthruTerm'}
                  hintText="URL"
                  floatingLabelText="Enter an URL"
                  fullWidth={true}
                  onChange={this._handleInputChange}
                  value={this.state.input} />
              </div>
            </CardText>

            <CardText>
              <div className="search-notes">
               <h3>Notes</h3>
                <p>For Pass-thru searches, you simply enter a full and valid url that gets sent directly to the service.</p>
                <p>There is no output to configure; that must be included in the URL.</p>
                <pre>
                  <p>http://myvariant.info/v1/variant/chr17:g.40690453T>G?fields=cadd</p>
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

module.exports = PassThruInput;
