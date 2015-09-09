require("babelify/polyfill");

const converter = require('json-2-csv');
const flat = require('flat');
const React = require('react');
const mui = require('material-ui');
const mv = require('myvariantjs');

const deepCopy = ( ob ) => JSON.parse(JSON.stringify( ob ));

let FlatButton = mui.FlatButton;
let IconButton = mui.IconButton;
let Paper = mui.Paper;
let Dialog = mui.Dialog;
let ThemeManager = new mui.Styles.ThemeManager();
let Colors = mui.Styles.Colors;
let SvgIcon = mui.SvgIcon;
let List = mui.List;
let ListItem = mui.ListItem;
let ListDivider = mui.ListDivider;
let ResultTable = require('./ResultTable.jsx');
let HelpIcon = require('../svg-icons/help-outline.jsx');

let FormatResults = React.createClass({
  render(){
    var comp;
    if (this.props.format==='table') {
      if (Array.isArray(this.props.datas) && !this.props.datas.length) {
        comp = <div className="center-xs ">No rows.  Run a new search.</div>;
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

let Main = React.createClass({
  getInitialState(){
    return {
      isLoading: false,
      lastAction: null,
      actions:{
        "1": {'caller':'getfields','params':null, 'title2':"GET http://myvariant.info/v1/fields"},
        "2": {'caller':'getfields','params':['gene'], 'title2':"GET http://myvariant.info/v1/fields, filters for 'gene'"},
        "3": {'caller':'getvariant','params':['chr9:g.107620835G>A'], 'title2':"GET http://myvariant.info/v1/variant/chr9:g.107620835G>A"},
        "4": {'caller':'getvariant','params':['chr9:g.107620835G>A', ["dbnsfp.genename", "cadd.phred"]], 'title2':"GET http://myvariant.info/v1/variant/chr9:g.107620835G>A?fields=dbnsfp.genename,cadd.phred"},
        "5": {'caller':'getvariants','params':['chr1:g.866422C>T,chr1:g.876664G>A,chr1:g.69635G>C'], 'title2':"POST http://myvariant.info/v1/variant/"},
      },
      dataj: null,
      datas: [],
      dataFormat: 'table',  // can be json, csv, tsv, table (default)
    };
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  },

  componentWillMount() {
    ThemeManager.setComponentThemes({
      flatButton: {
        primaryTextColor: "#62CE2B",
        secondaryTextColor: "#2679E1",
      },
    });
  },

  _onListItemTap(e) {
    this._fetchData(e.currentTarget.getAttribute("data-action"));
  },

  _flatten(data){
    return Object.keys(data).map(k => {
      return Object.assign({'fieldname': k}, data[k]);
    });
  },

  _fetchData(actionN){
    if (actionN === this.state.lastAction) return;

    let self = this;
    self.setState({'isLoading':true});

    let action = self.state.actions[actionN];
    let got = action.params === null ? mv[action.caller]() : mv[action.caller](...action.params);
    got.then(
        function(res) {
          let dat = res;
          if (!Array.isArray(res)) dat = [res];
          if (action.caller === 'getfields') dat = self._flatten(res);
          dat = dat.map( d => flat(d) );
          self.setState({'dataj': deepCopy(res), 'datas': dat, 'isLoading':false, 'lastAction':actionN});
      })
      .catch(
        function(reason) {
          console.log('All manner of chaos ensued.  Data could not be fetched, for this reason: '+reason);
          self.setState({'isLoading':false, 'dataj': null, 'datas': []});
      });
  },

  _onFormatTap(e) {
    let format = e.currentTarget.getAttribute("data-format");
    if (format && format !== this.state.dataFormat)
      this._convertFormat(format);
  },

  _convertFormat(format){
    let res = this.state.dataj;
    // from * to json
    if (format === 'json') {
      this.setState({'datas': deepCopy(res), 'dataFormat': format});
    } else {
      // flatten dataj , then pass converted form into datas
      let dat = res;
      if (!Array.isArray(res)) dat = [res];
      if (this.state.lastAction.caller === 'getfields') dat = this._flatten(res);
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
    const primaryColor = ThemeManager.getCurrentTheme().component.flatButton.primaryTextColor;
    const secondaryColor = ThemeManager.getCurrentTheme().component.flatButton.secondaryTextColor;
    const defaultColor = "#FFFFFF";
    return (
      <div>
        <div className="row">
          <div className="left col-xs-12 col-sm-4 col-md-4 col-lg-4">

            <h2>Search <a href="http://myvariant.info/" target="_blank">MyVariant.info</a></h2>

            <List insetSubheader={true} subheader={"Click an Action below"}>
              <ListItem
                data-action={1}
                primaryText={
                  <div className="row">
                    <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                      <span style={{color: this.state.lastAction==="1" ? primaryColor : defaultColor}} className="mega-octicon super-octicon octicon-chevron-right"></span>
                    </div>
                    <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11">
                      <span className="itemPrimaryTitle" style={{color: primaryColor}}>Get all fields</span><br/>
                      <span className="itemSecondaryTitle title2">{this.state.actions["1"].title2}</span>
                    </div>
                  </div>
                }
                onTouchTap={this._onListItemTap}
              />

              <ListItem
                data-action={2}
                primaryText={
                  <div className="row">
                    <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                      <span style={{color: this.state.lastAction==="2" ? primaryColor : defaultColor}} className="mega-octicon super-octicon octicon-chevron-right"></span>
                    </div>
                    <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11">
                      <span className="itemPrimaryTitle" style={{color: primaryColor}}>Get field names containing "<span style={{color: secondaryColor}}>gene</span>"</span><br/>
                      <span className="itemSecondaryTitle title2">{this.state.actions["2"].title2}</span>
                    </div>
                  </div>
                }
                onTouchTap={this._onListItemTap}
              />

              <ListDivider/>

              <ListItem
                data-action={3}
                primaryText={
                  <div className="row">
                    <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                      <span style={{color: this.state.lastAction==="3" ? primaryColor : defaultColor}} className="mega-octicon super-octicon octicon-chevron-right"></span>
                    </div>
                    <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11">
                      <span className="itemPrimaryTitle" style={{color: primaryColor}}>Get variant "<span style={{color: secondaryColor}}>chr9:g.107620835G>A</span>"</span><br/>
                      <span className="itemSecondaryTitle title2">{this.state.actions["3"].title2}</span>
                    </div>
                  </div>
                }
                onTouchTap={this._onListItemTap}
              />

              <ListItem
                data-action={4}
                primaryText={
                  <div className="row">
                    <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                      <span style={{color: this.state.lastAction==="4" ? primaryColor : defaultColor}} className="mega-octicon super-octicon octicon-chevron-right"></span>
                    </div>
                    <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11">
                      <span className="itemPrimaryTitle" style={{color: primaryColor}}>Get variant "<span style={{color: secondaryColor}}>chr9:g.107620835G>A</span>", only show "<span style={{color: secondaryColor}}>dbnsfp.genename</span>" and "<span style={{color: secondaryColor}}>cadd.phred</span>" fields.</span><br/>
                      <span className="itemSecondaryTitle title2">{this.state.actions["4"].title2}</span>
                    </div>
                  </div>
                }
                onTouchTap={this._onListItemTap}
              />

              <ListDivider/>

              <ListItem
                data-action={5}
                primaryText={
                  <div className="row">
                    <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                      <span style={{color: this.state.lastAction==="5" ? primaryColor : defaultColor}} className="mega-octicon super-octicon octicon-chevron-right"></span>
                    </div>
                    <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11">
                      <span className="itemPrimaryTitle" style={{color: primaryColor}}>Get variants "<span style={{color: secondaryColor}}>chr1:g.866422C>T</span>", "<span style={{color: secondaryColor}}>chr1:g.876664G>A</span>", "<span style={{color: secondaryColor}}>chr1:g.69635G>C</span>"</span><br/>
                      <span className="itemSecondaryTitle title2">{this.state.actions["5"].title2}</span>
                    </div>
                  </div>
                }
                onTouchTap={this._onListItemTap}
              />

            </List>

          </div>

          <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
            <br/>

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
                { this.state.isLoading ?
                    <div className="center-xs ">Loading...</div> :
                    <FormatResults datas={this.state.datas} format={this.state.dataFormat}/>
                }
            </div>

          </div>

        </div>

      </div>
    );
  },

});

module.exports = Main;
