
import jsonexport from 'jsonexport';
//import converter from 'json-2-csv';
const flat = require('flat');
const React = require('react');
const mixins = require('baobab-react/mixins');
const mui = require('material-ui');
const mv = require('myvariantjs');
const utils = require('../utils');

const FlatButton = mui.FlatButton;
const IconButton = mui.IconButton;
const Dialog = mui.Dialog;
const SvgIcon = mui.SvgIcon;
const ResultTable = require('./ResultTable.jsx');
const HelpIcon = require('../svg-icons/help-outline.jsx');

const FormatResults = React.createClass({
  render(){
    var comp = [];
    if (this.props.dataFormat==='table') {
      if (!this.props.data || (Array.isArray(this.props.data) && !this.props.data.length)) {
        comp.push(<div className="center-xs ">-- No results --<br/><br/>Run a new search.<br/>Find variants that satisfy specific field values.<br/>Or hit one of the example queries.</div>);
      } else {
        comp.push(<ResultTable ref="resulttable" datas={this.props.data} format={this.props.dataFormat}/>);
      }
    }
    if (this.props.dataFormat==='json') {
      comp.push(<div className="code-view" ref="page"><pre class="javascript"><code>{JSON.stringify(this.props.data,null,2)}</code></pre></div>);
    }
    if (['csv','tsv'].indexOf(this.props.dataFormat) > -1) {
      comp.push(<div className="code-view" ref="page"><span><pre><code>{this.props.data}</code></pre></span></div>);
    }
    return (
      <div>
        {comp}
      </div>
    );
  }

});

const Preview = React.createClass({
  mixins: [mixins.branch],

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  cursors: {
    colors: ['colors'],
    isLoading: ['isLoading'],
    dataFormat: ['dataFormat'],
    preview: ['preview'],
    activeQuery: ['activeQuery'],
  },

  getInitialState(){
    return ({
      data: null
    });
  },

  componentDidMount(){
    this.setState({
      data: this.state.preview
    });
  },

  componentDidUpdate(previousProps,previousState){
    if (this.state.preview !== previousState.preview) {
      this.setState({
        data: this.state.preview
      });
    }
  },

  _onFormatTap(format) {
    if (format && format !== this.state.dataFormat) {
      this.cursors.dataFormat.set(format);
      this.context.tree.commit();
      this._convertFormat(format);
    }
  },

  _convertFormat(format){
    // convert the preview data
    if (['json','table'].indexOf(format) > -1) {
      this.setState({'data':this.state.preview});
    } else {
      utils._convert(format, this.state.preview, (data) => this.setState({'data':data}));
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

    if (this.state.dataFormat === 'json') {
      cb(JSON.stringify(this.state.activeQuery.results));
    } else {
      utils._convert(this.state.dataFormat, this.state.activeQuery.results, cb);
    }
  },

  _onHelpTap() {
    this.refs.helpDialog.show();
  },

  render() {
    const greenBorder = '2px solid '+this.state.colors.green;
    return (
          <div className="result">

            <h3>Results Preview</h3>

            <div className="action-buttons center-xs">
              <FlatButton ref="btnJSON" label="JSON" primary={true} style={{borderBottom:(this.state.dataFormat==='json' ? greenBorder : 'none')}} onTouchTap={this._onFormatTap.bind(null,'json')} />
              <FlatButton ref="btnCSV" label="CSV" primary={true} style={{borderBottom:(this.state.dataFormat==='csv' ? greenBorder : 'none')}} onTouchTap={this._onFormatTap.bind(null,'csv')} />
              <FlatButton ref="btnTSV" label="TSV" primary={true} style={{borderBottom:(this.state.dataFormat==='tsv' ? greenBorder : 'none')}} onTouchTap={this._onFormatTap.bind(null,'tsv')} />
              <FlatButton ref="btnTable" label="Table" primary={true} style={{borderBottom:(this.state.dataFormat==='table' ? greenBorder : 'none')}} onTouchTap={this._onFormatTap.bind(null,'table')} />

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

            <div className="preview">
                { this.state.isLoading ?
                    <div className="center-xs ">Loading...</div> :
                    <FormatResults data={this.state.data} dataFormat={this.state.dataFormat}/>
                }
            </div>

          </div>
    );
  },
});

module.exports = Preview;
