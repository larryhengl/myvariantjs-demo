const React = require('react');
const mui = require('material-ui');
let ThemeManager = new mui.Styles.ThemeManager();
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

  componentWillMount() {
    ThemeManager.setPalette({
      primary1Color: "#62CE2B",
      secondary1Color: "#2679E1",
    });
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  },

  _onRowSelection(rows){
    console.log('selected',rows);
  },

  _onMore(e){
    // push into dialog + paper, scrollable
    console.log('more',e.currentTarget.getAttribute('data-row'))
    // what row?
    let row = this.props.datas[e.currentTarget.getAttribute('data-row')];
    // get all cols for given row, format as a List

    // push data into list dialog

    this.setState({moreRowNumber:row||0});
    this.refs.moreDialog.show();
  },

  _getListData(){
    return {'a':1,"b":2};
  },

  _getColumns(){
    return Object.keys(this.props.datas[0]).slice(0,this.state.colLimit||5);
  },

  _getTableRows(){
    let cols = this._getColumns();
    let rows = this.props.datas.map( (r,i) => {
      let row = cols.map( (c,ii) => {
        let rowcol = c === "notes" ?
            <TableRowColumn key={ii} dangerouslySetInnerHTML={{__html: r[c]}}></TableRowColumn> :
            <TableRowColumn key={ii}>{r[c]}</TableRowColumn>;
        return (
            {rowcol}
        );
      });
      // add the More icon at end of row
      row.push(<TableRowColumn key={"colMore"} >
          <IconButton
             tooltip="More"
             touch={true}
             tooltipPosition="bottom-left"
             onClick={this._onMore}
             >
            <MoreVertIcon style={{fill:"rgba(0, 0, 0, 0.54)"}} />
          </IconButton>
        </TableRowColumn>);
      return (
        <TableRow rowNumber={i} key={i} onClick={this._onMore}>
        {row}
        </TableRow>);
    });
    return rows;
  },

  _getHeaderRow(){
    let cols = this._getColumns().map( (c,i) => {
        let col = this._toProperCase(c);
        return (
            <TableHeaderColumn key={"hdrcol"+i} tooltip={col} >{col}</TableHeaderColumn>
        );
    });
    cols.push(<TableHeaderColumn style={{color:"rgba(0, 0, 0, 0.26)"}} key={"hdrMore"} >{"(more)"}</TableHeaderColumn>);
    return (<TableRow key={"hdrrows"}>{cols}</TableRow>);
  },

  _toProperCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
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
                Results ({rows.length} rows)
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
