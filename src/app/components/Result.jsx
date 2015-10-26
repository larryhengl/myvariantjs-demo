require("babelify/polyfill");

const converter = require('json-2-csv');
const flat = require('flat');
const React = require('react');
const mui = require('material-ui');
const mv = require('myvariantjs');
const utils = require('../utils');

let FlatButton = mui.FlatButton;
let IconButton = mui.IconButton;
let Paper = mui.Paper;
let Dialog = mui.Dialog;
let SvgIcon = mui.SvgIcon;
let ResultTable = require('./ResultTable.jsx');
let HelpIcon = require('../svg-icons/help-outline.jsx');

let FormatResults = React.createClass({
  render(){
    var comp;
    if (this.props.format==='table') {
      if (Array.isArray(this.props.datas) && !this.props.datas.length) {
        comp = <div className="center-xs ">-- No results --<br/><br/>Run a new search.<br/>Find variants that satisfy specific field values.<br/>Or hit one of the example queries.</div>;
      } else {
        comp = <ResultTable ref="resulttable" datas={this.props.datas} format={this.props.format}/>;
      }
    }
    if (this.props.format==='json') {
      comp = <div className="code-view" ref="page"><pre class="javascript"><code>{JSON.stringify(this.props.datas,null,2)}</code></pre></div>;
    }
    if (['csv','tsv'].includes(this.props.format)) {
      comp = <div className="code-view" ref="page"><span><pre><code>{this.props.datas}</code></pre></span></div>;
    }
    return (
      <div>
        {comp}
      </div>
    );
  }

});

let Result = React.createClass({
  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getInitialState(){
    return {
      dataj: null,
      datas: null,
      dataFormat: 'table',  // can be json, csv, tsv, table (default)
    };
  },

  componentWillMount() {
    this.setState({
      dataj: utils._deepCopy(this.props.data),
      datas: utils._deepCopy(this.props.data),
    });
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataj: utils._deepCopy(nextProps.data),
      datas: utils._deepCopy(nextProps.data),
    });
  },

  _onFormatTap(e) {
    let format = e.currentTarget.getAttribute("data-format");
    if (format && format !== this.state.dataFormat)
      this._convertFormat(format);
  },

  _convertFormat(format){
    if (!this.props.lastAction) {
      this.setState({dataFormat: format});
      return;
    }
    let res = this.state.dataj;
    // from * to json
    if (format === 'json') {
      this.setState({'datas': utils._deepCopy(res), 'dataFormat': format});
    } else {
      // flatten dataj , then pass converted form into datas
      let dat = res;
      if (!Array.isArray(res)) dat = [res];
      if (this.props.lastAction.caller === 'getfields') dat = utils._flatten(res);
      dat = dat.map( (d) => flat(d) );

      if (['table','flat'].includes(format)) {
        this.setState({datas: dat, dataFormat: format});
      };

      // from json to tsv
      if (['csv','tsv'].includes(format)) {
        let opts = {CHECK_SCHEMA_DIFFERENCES: false, 'DELIMITER': {'FIELD': (format === 'tsv' ? '\t' : ',') ,WRAP: '"'}};
        converter.json2csv(dat, (err, csv) => {
            if (err) throw err;
            this.setState({datas: csv, dataFormat: format});
        }, opts);
      }
    }
  },

  _onExportTap() {
    let data = this.state.datas;
    if (this.state.dataFormat === 'table') {
      let opts = {CHECK_SCHEMA_DIFFERENCES: false, 'DELIMITER': {'FIELD': '\t',WRAP: '"'}};
      converter.json2csv(this.state.datas, (err, tsv) => {
          if (err) throw err;
          let blob = new Blob([tsv]);
          let url = URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.download = "data.table";
          a.href = url;
          a.click();
      }, opts);
    } else {
        if (this.state.dataFormat === 'json') data = JSON.stringify(this.state.datas);
        let blob = new Blob([data]);
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.download = "data."+this.state.dataFormat;
        a.href = url;
        a.click();
    }
  },

  _onHelpTap() {
    this.refs.helpDialog.show();
  },

  render() {
    const primaryColor = this.context.muiTheme.flatButton.primaryTextColor;
    const secondaryColor = this.context.muiTheme.flatButton.secondaryTextColor;
    const defaultColor = "#FFFFFF";
    return (
          <div className="result right col-xs-12 col-sm-8 col-md-8 col-lg-8">

            <div className="action-buttons center-xs">
              <FlatButton data-format={"json"} ref="btnJSON" label="JSON" primary={true} style={{borderBottom:(this.state.dataFormat==='json' ? '2px solid '+primaryColor : 'none')}} onTouchTap={this._onFormatTap} />
              <FlatButton data-format={"csv"} ref="btnCSV" label="CSV" primary={true} style={{borderBottom:(this.state.dataFormat==='csv' ? '2px solid '+primaryColor : 'none')}} onTouchTap={this._onFormatTap} />
              <FlatButton data-format={"tsv"} ref="btnTSV" label="TSV" primary={true} style={{borderBottom:(this.state.dataFormat==='tsv' ? '2px solid '+primaryColor : 'none')}} onTouchTap={this._onFormatTap} />
              <FlatButton data-format={"table"} ref="btnTable" label="Table" primary={true} style={{borderBottom:(this.state.dataFormat==='table' ? '2px solid '+primaryColor : 'none')}} onTouchTap={this._onFormatTap} />

              <FlatButton ref="btnExport" label="Export" secondary={true} onTouchTap={this._onExportTap} />

              <IconButton className="btnHelp" tooltip="Help" touch={true} onTouchTap={this._onHelpTap}>
                <HelpIcon className="faded-grey" />
              </IconButton>

              <Dialog
                ref="helpDialog"
                title={"Help?"}
                actions={[{ text: 'Got it' }]}
              >
                <p>After clicking an action at the left, a service query is made. <br/>The results will live in the panel below.</p>
                <p>You can toggle the format of the result data: json, csv, tab-delimited (tsv), table.</p>
                <p>The Export button will download a file of the results according to the selected format, containing all the fields fetched.</p>
              </Dialog>

            </div>

            <div className="results">
                { this.props.isLoading ?
                    <div className="center-xs ">Loading...</div> :
                    <FormatResults datas={this.state.datas} format={this.state.dataFormat}/>
                }
            </div>

          </div>
    );
  },
});

module.exports = Result;
