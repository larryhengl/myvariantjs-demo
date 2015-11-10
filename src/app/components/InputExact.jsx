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
  },

  cursors: {
    tabs: ['activeTabs'],
    input: ['query','exact','input'],
  },

  _handleInputChange(i,e){
    // if ref=searchTerm then set the cursors.query.search.q e.target.value
    // if ref=searchFieldTerm then look and add to input array
    if (i.source === 'search') {
      this.cursors.search.select(i.idx,'value').set(e.target.value);
    } else if (i.source === 'q') {
      this.cursors.q.set(e.target.value);
    }
  },


  _handleSubmit(searchType){
debugger
    this.actions._fetchData(this._formatRequest(searchType));
  },

  render() {
    const self = this;
    const input = [];

    if (self.state.tabs.Query==="input") {
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
                  ref={'searchTerm'}
                  hintText="Search"
                  floatingLabelText="Enter VariantIDs"
                  fullWidth={true}
                  onChange={self._handleInputChange.bind(null,{source: 'exact'})}
                  value={self.state.input} />
              </div>
            </CardText>

            <CardText>
              <div className="search-notes">
               <h3>Notes</h3>
                <p>If running a general search without field names, it will be limited to rsid and hgvs names.</p>
                <p>Wildcard character “*” or ”?” is supported in either simple queries or fielded queries:</p>
                <pre>
                  <p>dbnsfp.genename:CDK?</p>
                  <p>dbnsfp.genename:CDK*</p>
                </pre>
                <p>Wildcard character can not be the first character. It will be ignored.</p>
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
