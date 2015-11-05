require("babelify/polyfill");

//import jsonexport from 'jsonexport';
import converter from 'json-2-csv';
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
        // chop to 7 rows for preview
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
      dataj: null,    // original json formatted results
      datas: null,    // converted format according to dataFormat
      limit: 7,
      dataFormat: 'table',  // can be json, csv, tsv, table (default)
    };
  },

  componentWillMount() {
    this.setState({
      dataj: utils._deepCopy(this.props.data),
      datas: utils._deepCopy(this.props.data.slice(0,this.state.limit)),
    });
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataj: utils._deepCopy(nextProps.data),
      datas: utils._deepCopy(nextProps.data.slice(0,this.state.limit)),
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
    this._conversion(format, 'preview', (data) => this.setState(data))
  },

  _conversion(format, dest, cb){
    let res = this.state.dataj;
    let dat;
    let ret;
    let isPreview = (dest === 'preview');
    let calledGetFields = ((typeof this.props.lastAction === "string" ? this.props.actions[this.props.lastAction].caller : this.props.lastAction.caller) === 'getfields');
    // from * to json
    if (format === 'json') {
      if (calledGetFields) {
        dat = utils._flatten(res);
      } else {
        dat = isPreview ? res.slice(0,this.state.limit) : res;
      }
      // call setState for preview or export click for export
      cb(isPreview ? {'datas': utils._deepCopy(dat), 'dataFormat': format} : dat);
    } else {
      // flatten dataj , then pass converted form into datas
      if (!Array.isArray(res)) dat = [res];
      if (calledGetFields) {
        dat = utils._flatten(res);
      } else {
        dat = isPreview ? res.slice(0,this.state.limit) : res;
      }
      dat = dat.map( (d) => flat(d) );

      if (['table','flat'].includes(format)) {
        // call setState for preview or export click for export
        cb(isPreview ? {datas: dat, dataFormat: format} : dat);
      };

      // from json to tsv
      if (['csv','tsv'].includes(format)) {
        let opts = {CHECK_SCHEMA_DIFFERENCES: false, 'DELIMITER': {'FIELD': (format === 'tsv' ? '\t' : ',') ,WRAP: '"'}};
        jsonexport(dat, (err, csv) => {
            if (err) throw err;
            // call setState for preview or export click for export
            cb(isPreview ? {datas: csv, dataFormat: format} : csv);
        }, opts);
      }
    }
  },

  _onExportTap() {

    let cb = (data) => {
        let blob = new Blob([data]);
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.download = "data."+this.state.dataFormat;
        a.href = url;
        a.click();
    };

    if (this.state.dataFormat === 'table') {
      let opts = {CHECK_SCHEMA_DIFFERENCES: false, 'DELIMITER': {'FIELD': '\t',WRAP: '"'}};
      converter.json2csv(this.state.dataj, (err, tsv) => {
          if (err) throw err;
          cb(tsv);
      }, opts);
    } else {
        if (this.state.dataFormat === 'json') {
          cb(JSON.stringify(this.state.dataj));
        } else {
          this._conversion(this.state.dataFormat,'export',cb)
        }
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
          <div className="result">

            <h2>Results Preview</h2>

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
                <p>After submitting a search or clicking an action at the left, a service query is made. <br/>A preview of the results will live in the panel below.</p>
                <p>You can toggle the format of the result data: json, csv, tab-delimited (tsv), table.</p>
                <p>The Export button will download a file of all the query results according to the selected format, containing all the fields fetched.</p>
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
