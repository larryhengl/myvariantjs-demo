'use strict';

import React from 'react';
const PureRenderMixin = require('react/addons').addons.PureRenderMixin;
import Immutable from 'immutable';
const mui = require('material-ui');
let Dialog = mui.Dialog;
let SvgIcon = mui.SvgIcon;
let MoreVertIcon = require('../svg-icons/more-vert.jsx');
//let ArrowRightIcon = require('../svg-icons/arrow-forward.jsx');
let MoreHorizIcon = require('../svg-icons/more-horiz.jsx');


// ----------------- FIELD LIST COMPONENT -------------------------------------- //
/*
state manage selected fields
state manage filtered value
state manage local list of fields (filtered?)
link filter value
allowMultiselect
state manage mulitselects
*/

export default class FieldList extends React.Component {

  constructor() {
    super();
    this.state = {
      data: Immutable.List(),
      filteredData: Immutable.List(),
      fields: Immutable.List(),
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  }

  componentWillMount() {
    this.setState({
      data: Immutable.fromJS(this.props.fields).toList(),
      filteredData: Immutable.fromJS(this.props.fields).toList()
    });
  }

  _filterData(event) {
    event.preventDefault();
    const regex = new RegExp(event.target.value, 'i');
    const filtered = this.state.data.filter(function(datum) {
      return (datum.get('fieldname').search(regex) > -1);
    });

    this.setState({
      filteredData: filtered,
    });
  }

  _fieldItemTap(field){
    this.props.fieldItemTap(field)
  }

  render() {
    const self = this;
    //const primaryColor = this.context.muiTheme.flatButton.primaryTextColor;
    const { filteredData } = this.state;
    const tree = (field) => {
      let dots = field.split(".").length - 1;
      return  dots > 0 ? "&nbsp;&nbsp;&nbsp;".repeat(3*dots) : "";
    }
    const dotSpaces = (dots) => {
      let arr = [];
      for (let i = 0; i < dots; i++) {
        arr.push(<span>&nbsp;&nbsp;&nbsp;</span>)
      }
      return arr;
    }

    const prettyRows = filteredData.map(function(f,i) {
      let fieldname = f.get("fieldname");
      let notes = f.get("notes");
      let dots = fieldname.split(".").length - 1;
      let isSelected = self.props.activeFields.includes(fieldname); // is it in the mapped set?
      return (
          <div key={"field"+i} className={"row"+(isSelected ? " selected" : "")} onClick={self._fieldItemTap.bind(self,fieldname)} >
            <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11 col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-lg-offset-1">
              <span>{dotSpaces(dots)}{ dots > 0 && <span><MoreVertIcon/><MoreHorizIcon style={{marginBottom: '-7px',marginLeft: '-10px'}}/></span>}<span title={notes}>{fieldname}</span></span>
            </div>
{/*
            <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5">
              { notes ? <span dangerouslySetInnerHTML={{__html: "<span>"+notes+"</span>"}}></span> : <span></span>}
            </div>
*/}
          </div>
      );
    });

    return (
        <Dialog
          openImmediately={this.props.showFieldList}
          ref="fieldsDialog"
          title={
            <div className="row" style={{padding:'20px 25px'}}>
              <div className="col-sm-4 col-md-4 col-lg-3">Select a Field</div>
              <input
                type="text"
                className="list-filter-input form-control col-sm-8 col-md-8 col-lg-9"
                onChange={this._filterData.bind(this)}
                placeholder="Search" />
            </div>
          }
          actions={[{ text: 'Done' }]}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
          onDismiss={this.props.closeFieldList}
          modal={true}>
          <div className="fieldsDialog" style={{height: '1000px'}}>
            { prettyRows }
          </div>
        </Dialog>
    )
  }

};
