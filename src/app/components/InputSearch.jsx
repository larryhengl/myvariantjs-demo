'use strict';

import React from 'react';
import mui from 'material-ui';
const mixins = require('baobab-react/mixins');
const Card = mui.Card;
const CardText = mui.CardText;
const TextField = mui.TextField;
const FlatButton = mui.FlatButton;
const RaisedButton = mui.RaisedButton;
const DelIcon = require('../svg-icons/del.jsx');

import * as actions from '../actions.js';
import FieldListDialog from './FieldListDialog.jsx';


// ----------------- SearchInput COMPONENT -------------------------------------- //
/* What this does:
*/


const SearchInput = React.createClass({
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
    search: ['query','search','input'],
    q: ['query','search','q'],
  },


  _openFieldList(fieldIdx){
    this.actions.setFieldCursor(fieldIdx);
    this.actions.toggleFieldList();
  },

  _handleInputChange(i,e){
    // if ref=searchTerm then set the cursors.query.search.q e.target.value
    // if ref=searchFieldTerm then look and add to input array
    if (i.source === 'search') {
      this.cursors.search.select(i.idx,'value').set(e.target.value);
    } else if (i.source === 'search.q') {
      this.cursors.q.set(e.target.value);
    }
  },


  _handleSubmit(searchType){
    this.actions.fetchData(this.actions.formatRequest(searchType));
  },

  render() {
    const self = this;
    const input = [];

    if (self.state.tabs.Main==="search" && self.state.tabs.Query==="input") {

      // -------------------- SEARCH FIELDS ------------------------------- //
      let searchInputFields = self.state.search.map(function(f,i){
        return (
          <div key={"input"+i} className="searchInputFields row">
              <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1" style={{'marginTop':'25px', 'padding':'0px'}} >
                <RaisedButton
                  ref={'searchField'+i}
                  className={'btnField'}
                  labelStyle={{'padding':'0px'}}
                  label={'+ Field'}
                  primary={true}
                  fullWidth={true}
                  onClick={self._openFieldList.bind(null,i)} >
                </RaisedButton>
              </div>

              <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-lg-offset-1">
                <TextField
                  disabled={true}
                  ref={'searchFieldName'+i}
                  floatingLabelText="Search Field"
                  fullWidth={true}
                  value={f.name} />
              </div>

              <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                <TextField
                  ref={'searchFieldTerm'+i}
                  floatingLabelText="Search Term"
                  fullWidth={true}
                  value={f.value}
                  onChange={self._handleInputChange.bind(null,{source: 'search',idx: i})} />
              </div>

              <DelIcon
                className="del faded-grey col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-lg-offset-1"
                style={{'marginTop':'40px'}}
                onTouchTap={self.actions.removeSearchField.bind(null,i)} />
          </div>
        );
      });

      // construct the input component contents
      input.push(
        <div key={"inputall"}>
          <Card>
            <CardText>
              <div className='fSearch'>
                <div className='row'>
                  <div className='col-xs-4 col-sm-4 col-md-4 col-lg-4'>
                    <h3>Field Search</h3>
                  </div>
                  <div className='col-xs-8 col-sm-8 col-md-8 col-lg-8'>
                    <FlatButton ref="btnClear" className="btnClear" label="Clear Search Inputs" secondary={true} onTouchTap={self.actions.clearInput.bind(null,'search')} />
                    <FlatButton ref="btnSubmit" className="btnSubmit" label="Submit" secondary={true} onTouchTap={self._handleSubmit.bind(null,'search')} />
                  </div>
                </div>
                {searchInputFields}
              </div>
            </CardText>

           <div style={{position:'relative'}}>
             <div className="or">Or</div>
             <hr/>
           </div>

            <CardText>
              <div className='qSearch'>
                <div className='row'>
                  <div className='col-xs-4 col-sm-4 col-md-4 col-lg-4'>
                    <h3>Simple Search</h3>
                  </div>
                  <div className='col-xs-8 col-sm-8 col-md-8 col-lg-8'>
                    <FlatButton ref="btnClear" className="btnClear" label="Clear Search Inputs" secondary={true} onTouchTap={self.actions.clearInput.bind(null,'search.q')} />
                    <FlatButton ref="btnSubmit" className="btnSubmit" label="Submit" secondary={true} onTouchTap={self._handleSubmit.bind(null,'search.q')} />
                  </div>
                </div>

                <TextField
                  ref={'searchTerm'}
                  hintText="Search"
                  floatingLabelText="Enter the full fielded query string or simple search term here"
                  fullWidth={true}
                  onChange={self._handleInputChange.bind(null,{source: 'search.q'})}
                  value={self.state.q} />
              </div>
            </CardText>

            <CardText>
              <div className="search-notes">
               <h3>Notes</h3>
                <p>Wildcard character “*” or ”?” is supported in either simple queries or fielded queries:</p>
                <pre>
                  <p>dbnsfp.genename:CDK?</p>
                  <p>dbnsfp.genename:CDK*</p>
                </pre>
                <p>Wildcard character can not be the first character. It will be ignored.</p>
                <br/>
                <p>If running a general search without field names, it will be limited to rsid and hgvs names.</p>
                <pre>
                  <p>rs58991260</p>
                  <p>c.1112C>G</p>
                  <p>chr1:69000-70000</p>
                </pre>
                <p>The detailed query syntax can be found <a href="http://docs.myvariant.info/en/latest/doc/variant_query_service.html#query-syntax">here</a></p>
              </div>
            </CardText>
          </Card>

          <FieldListDialog source={"input"} />
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

module.exports = SearchInput;
