'use strict';

const React = require('react');
const mixins = require('baobab-react/mixins');
const mui = require('material-ui');
const Dialog = mui.Dialog;
const SvgIcon = mui.SvgIcon;
const MoreVertIcon = require('../svg-icons/more-vert.jsx');
//const ArrowRightIcon = require('../svg-icons/arrow-forward.jsx');
const MoreHorizIcon = require('../svg-icons/more-horiz.jsx');

import * as actions from '../actions.js';


// ----------------- FIELD LIST DIALOG COMPONENT -------------------------------------- //
/*
state manage selected fields
state manage filtered value
state manage local list of fields (filtered?)
link filter value
allowMultiselect
state manage mulitselects
*/

const FieldList = React.createClass({
  mixins: [mixins.branch],
  contextTypes: {
    muiTheme: React.PropTypes.object,
  },
  actions: {
    addField: actions.addField,
    addSearchField: actions.addSearchField,
    toggleFieldList: actions.toggleFieldList
  },
  cursors: {
    fields: ['fields'],
    showFieldList: ['showFieldList'],
    activeFields: ['activeFields'],
  },

  getInitialState(){
    return {
      filteredData: [],
    };
  },

  componentDidMount(){
    this.setState({
      filteredData: this.state.fields || []
    });
  },

  shouldComponentUpdate(nextProps,nextState){
    if (nextState.fields !== this.state.fields) {
      this.setState({
        filteredData: nextState.fields || []
      });
      return true;
    }
    else if (
      nextState.showFieldList !== this.state.showFieldList ||
      nextState.activeFields !== this.state.activeFields ||
      nextState.filteredData.length !== this.state.filteredData.length
    ) return true;
    else return false;
  },

  componentDidUpdate(){
    if (this.state.showFieldList) this.refs.fieldsDialog.show();
  },

  _filterData(event) {
    const regex = new RegExp(event.target.value, 'i');
    let filtered = this.state.fields.filter( f => f.fieldname.search(regex) > -1 );
    this.setState({
      filteredData: filtered,
    });
  },

  _clearFilter(){
/*
    this.setState({
      filteredData: this.state.fields,
    },this.actions.toggleFieldList);
*/
    this.refs.refDialogInput.value = null;
    //this.actions.toggleFieldList
  },

  _selectField(field){
    //const action = self.props.source === "input" ? self.actions.addSearchField.bind(null, f.fieldname) : self.actions.addField.bind(null,{idx: i, name: f.fieldname});
    this.actions.addField(field);
    if (this.props.source === "input") {
      this.actions.addSearchField(field);
      this.refs.fieldsDialog.dismiss();
    }
  },

  render() {
    const self = this;

    const dotSpaces = (dots) => {
      let arr = [];
      for (let i = 0; i < dots; i++) {
        arr.push(<span key={'spaces'+i}>&nbsp;&nbsp;&nbsp;</span>)
      }
      return arr;
    }

    const prettyRows = this.state.filteredData.map(function(f,i) {
      let dots = f.fieldname.split(".").length - 1;
      let isSelected = self.state.activeFields.indexOf(f.fieldname) > -1; // is it in the mapped set?
      return (
          <div key={"field"+i} className={"row"+(isSelected ? " selected" : "")} onClick={self._selectField.bind(null,{idx: i, name: f.fieldname})} >
            <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11 col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-lg-offset-1">
              <span>{dotSpaces(dots)}{ dots > 0 && <span><MoreVertIcon/><MoreHorizIcon style={{marginBottom: '-7px',marginLeft: '-10px'}}/></span>}<span title={f.notes}>{f.fieldname}</span></span>
            </div>
{/*
            <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5">
              { f.notes ? <span dangerouslySetInnerHTML={{__html: "<span>"+f.notes+"</span>"}}></span> : <span></span>}
            </div>
*/}
          </div>
      );
    });

    return (
        <Dialog
          ref="fieldsDialog"
          title={
            <div className="row" style={{padding:'20px 25px'}}>
              <div className="col-sm-4 col-md-4 col-lg-3">Select a Field</div>
              <input
                ref="refDialogInput"
                type="text"
                className="list-filter-input form-control col-sm-8 col-md-8 col-lg-9"
                onChange={this._filterData}
                placeholder="Search" />
            </div>
          }
          actions={[{ text: 'Done' }]}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
          onDismiss={this._clearFilter}
          modal={true}>
          <div className="fieldsDialog" style={{height: '1000px'}}>
            { prettyRows }
          </div>
        </Dialog>
    )
  }

});

module.exports = FieldList;
