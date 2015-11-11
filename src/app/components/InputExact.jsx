'use strict';

import React from 'react';
import mui from 'material-ui';
const mixins = require('baobab-react/mixins');
const Card = mui.Card;
const CardText = mui.CardText;
const TextField = mui.TextField;
const FlatButton = mui.FlatButton;

import * as actions from '../actions.js';

// ----------------- ExactInput COMPONENT -------------------------------------- //
/* What this does:
*/


const ExactInput = React.createClass({
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
    input: ['query','exact','input'],
  },

  _handleInputChange(e){
    this.cursors.input.set(e.target.value);
  },


  _handleSubmit(searchType){
    this.actions.fetchData(this.actions.formatRequest(searchType));
  },

  render() {
    const self = this;
    const input = [];

    if (self.state.tabs.Main==="exact" && self.state.tabs.Query==="input") {
      // construct the input component contents
      input.push(
        <div key={"inputall"}>
          <Card>

            <CardText>
              <div className='qSearch'>
                <div className='row'>
                  <div className='col-xs-4 col-sm-4 col-md-4 col-lg-4'>
                    <h3>Simple Search</h3>
                  </div>
                  <div className='col-xs-8 col-sm-8 col-md-8 col-lg-8'>
                    <FlatButton ref="btnClear" className="btnClear" label="Clear Search Inputs" secondary={true} onTouchTap={self.actions.clearInput.bind(null,'exact')} />
                    <FlatButton ref="btnSubmit" className="btnSubmit" label="Submit" secondary={true} onTouchTap={self._handleSubmit.bind(null,'exact')} />
                  </div>
                </div>

                <TextField
                  ref={'exactTerm'}
                  hintText="Search"
                  floatingLabelText="Enter HGVS VariantIDs"
                  fullWidth={true}
                  onChange={self._handleInputChange}
                  value={self.state.input} />
              </div>
            </CardText>

            <CardText>
              <div className="search-notes">
               <h3>Notes</h3>
                <p>For Exact searches, you retrieve variant annotations based on HGVS name based ids.</p>
                <pre>
                  <p>chr9:g.107620835G>A</p>
                </pre>
                <p>You can enter multiple ids separated by a comma.</p>
                <pre>
                  <p>chr1:g.866422C>T,chr1:g.876664G>A,chr1:g.69635G>C</p>
                </pre>
              </div>
            </CardText>
          </Card>
        </div>
      )
    } // end if


    return (
      <div className={(self.state.tabs.Query==="input" ? "input" : "hidey")} >
       {input}
      </div>
    )
  }

});

module.exports = ExactInput;
