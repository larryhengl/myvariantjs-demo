let React = require("react");
let mui = require("material-ui");
let ThemeManager = new mui.Styles.ThemeManager();
let Colors = mui.Styles.Colors;
let IconButton = mui.IconButton;

let Table = mui.Table;
let TableHeader = mui.TableHeader;
let TableHeaderColumn = mui.TableHeaderColumn;
let TableRow = mui.TableRow;
let TableRowColumn = mui.TableRowColumn;
let TableBody = mui.TableBody;
let TableFooter = mui.TableFooter;

//import MoreVertIcon from 'react-material-icons/icons/navigation/more-vert';
//import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
//          <MoreVertIcon style={{fill:"rgba(0, 0, 0, 0.54)"}} />

let SvgIcon = mui.SvgIcon;

let MoreVertIcon = React.createClass({
  render: function() {
    return (
      <SvgIcon {...this.props}>
        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
      </SvgIcon>
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

  _onMore(e){
    // what row?
    // get all cols for given row
    // format as a List
    // push into dialog + paper, scrollable
    console.log('more',e.currentTarget)
  },

  _getColumns(){
    return Object.keys(this.props.datas[0]).slice(0,this.state.colLimit||5);
  },

  _getTableRows(){
    let cols = this._getColumns();
    let rows = this.props.datas.map( (r,i) => {
      let row = cols.map( (c,ii) => {
        return (
            <TableRowColumn key={ii} dangerouslySetInnerHTML={{__html: r[c]}}></TableRowColumn>
        );
      });
      // add the More icon at end of row
      row.push(<TableRowColumn key={"colMore"} >
          <IconButton tooltip="More" onClick={this._onMore}>
            <MoreVertIcon style={{fill:"rgba(0, 0, 0, 0.54)"}} />
          </IconButton>
        </TableRowColumn>);
      return <TableRow key={i}>{row}</TableRow>;
    });
    return rows;
  },
/*
  _getRowColumns(){
    let cols = this._getColumns().map( (c,i) => {
        return (
            <TableRowColumn key={"col"+i} >{c}</TableRowColumn>
        );
    });
    return (<TableRow>{cols}</TableRow>);
  },
*/
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
          stripedRows={this.state.stripedRows}>

          {rows}

        </TableBody>

      </Table>
    );
  },

});

module.exports = ResultTable;
