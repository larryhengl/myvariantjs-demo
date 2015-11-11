const React = require('react');
const mui = require('material-ui');
const utils = require('../utils');

let Colors = mui.Styles.Colors;
let IconButton = mui.IconButton;
let Dialog = mui.Dialog;
let List = mui.List;
let ListItem = mui.ListItem;
let Table = mui.Table;
let TableHeader = mui.TableHeader;
let TableHeaderColumn = mui.TableHeaderColumn;
let TableRow = mui.TableRow;
let TableRowColumn = mui.TableRowColumn;
let TableBody = mui.TableBody;
let TableFooter = mui.TableFooter;
let SvgIcon = mui.SvgIcon;
let MoreVertIcon = require('../svg-icons/more-vert.jsx');

let Details = React.createClass({
  render(){
    let items = Object.keys(this.props.data).map( (k) => {
        return (
          <div className="row">
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <span>{k}</span>
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              { k==='notes'? <span dangerouslySetInnerHTML={{__html: "<span>"+this.props.data[k]+"</span>"}}></span> : <span>{this.props.data[k]}</span>}
            </div>
          </div>
        );
    });
    return (
      <div>
        {items}
      </div>
    );
  }
});

let ResultTable = React.createClass({

   getInitialState: function() {
    return {
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: true,
      selectable: false,
      multiSelectable: true,
      enableSelectAll: false,
      deselectOnClickaway: true,
      height: "300px",
      colLimit: 5,
      moreRowNumber: 0,
    };
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  _onRowSelection(rows){
    console.log('selected',rows);
  },

  _onMore(rownum,evt){
    // get all cols for given row, format as a List
    this.setState({moreRowNumber:rownum||0});
    // push data into list dialog and show it
    this.refs.moreDialog.show();
  },

  _getColumns(){
    return Object.keys(this.props.datas[0]).slice(0,this.state.colLimit||5);
  },

  _getTableRows(){
    let cols = this._getColumns();
    let rows = this.props.datas.map( (r,i) => {
      let row = cols.map( (c,ii) => {
        let rowcol = [];
        if (c === 'notes') {
          rowcol.push(<TableRowColumn key={ii} dangerouslySetInnerHTML={{__html: r[c]}}></TableRowColumn>);
        } else {
          rowcol.push(<TableRowColumn key={ii}>{r[c]}</TableRowColumn>);
        }
        return rowcol;
      });
      // add the More icon at end of row
      row.push(<TableRowColumn key={"colMore"} >
          <IconButton
             ref={'rowNumber'+i}
             tooltip="More"
             touch={true}
             tooltipPosition="bottom-left"
             onClick={this._onMore.bind(this,i)}
             >
            <MoreVertIcon style={{fill:"rgba(0, 0, 0, 0.54)"}} />
          </IconButton>
        </TableRowColumn>);
      return (
        <TableRow rowNumber={i} key={i}>
        {row}
        </TableRow>);
    });
    return rows;
  },

  _getHeaderRow(){
    let cols = this._getColumns().map( (c,i) => {
        let col = utils._toProperCase(c);
        return (
            <TableHeaderColumn key={"hdrcol"+i} tooltip={col} >{col}</TableHeaderColumn>
        );
    });
    cols.push(<TableHeaderColumn style={{color:"rgba(0, 0, 0, 0.26)"}} key={"hdrMore"} >{"(more)"}</TableHeaderColumn>);
    return (<TableRow key={"hdrrows"}>{cols}</TableRow>);
  },

  render() {
    let rows = this._getTableRows();
    return (
      <div>
        <Table
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
          onRowSelection={this._onRowSelection}>

          <TableHeader enableSelectAll={this.state.enableSelectAll}>
            <TableRow key={"sprhdrrows"}>
              <TableHeaderColumn colSpan={this._getColumns().length+1} tooltip="Search Results" style={{textAlign: "center"}}>
                Preview Results ({rows.length + 'row' + (rows.length > 1 ? 's' : '')} )
              </TableHeaderColumn>
            </TableRow>

            {this._getHeaderRow()}

          </TableHeader>

          <TableBody
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
            preScanRows={false}
          >
            {rows}
          </TableBody>

        </Table>
        <Dialog
          ref="moreDialog"
          title={"More details for this row"}
          actions={[{ text: 'Got it' }]}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}>
            <div style={{height: '1000px'}}>
              <Details data={this.props.datas[this.state.moreRowNumber]}/>
            </div>
        </Dialog>
      </div>
    );
  },

});

module.exports = ResultTable;
