/** In this file, we create a React component which incorporates components provided by material-ui */

require("babelify/polyfill");
let React = require('react');
let mui = require('material-ui');
let FlatButton = mui.FlatButton;
let Paper = mui.Paper;
let Dialog = mui.Dialog;
let ThemeManager = new mui.Styles.ThemeManager();
let Colors = mui.Styles.Colors;

let List = mui.List;
let ListItem = mui.ListItem;
let ListDivider = mui.ListDivider;

let ResultTable = require('./ResultTable.jsx');

//let mv = require('myvariant');
let mv = require("../../../../../dist/index");
//console.log(mv);

import converter from 'json-2-csv';
import flat from 'flat';

const deepCopy = ( ob ) => JSON.parse(JSON.stringify( ob ));

let Main = React.createClass({

  getInitialState(){
    return {
      mv: mv,
      isLoading: false,
      lastAction: null,
      actions:{
        1: {'caller':'getfields','params':null},
        2: {'caller':'getfields','params':'gene'},
        3: {'caller':'getvariant','params':'chr9:g.107620835G>A'},
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

    let mv = self.state.mv;
    let action = self.state.actions[actionN];
    let got = mv[action.caller](action.params);
    got.then(
        function(res) {
          let dat = res;
          if (!Array.isArray(res)) dat = [res];
          if (action.caller === 'getfields') dat = self._flatten(res);
          dat = dat.map( (d) => flat(d) );
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
    // from * to json
    if (format === 'json') {
      this.setState({'datas': deepCopy(this.state.dataj), 'dataFormat': format});
    } else {
      // flatten dataj , then pass converted form into datas
      let dat = this.state.dataj.map( (d) => flat(d) );

      if (['table','flat'].includes(format)) {
        this.setState({datas: dat, dataFormat: format});
      };

      // from json to tsv
      if (['csv','tsv'].includes(format)) {
        let opts = {'DELIMITER': {'FIELD': (format === 'tsv' ? '\t' : ',') ,WRAP: '"'}};
        converter.json2csv(dat, (err, csv) => {
            if (err) throw err;
            console.log('j2c',csv);
            this.setState({datas: csv, dataFormat: format});
        }, opts);
      }
    }
  },

  _onExportTap(e) {
    console.log(e.target);
  },


  render() {
    const primaryColor = ThemeManager.getCurrentTheme().component.flatButton.primaryTextColor;
    const secondaryColor = ThemeManager.getCurrentTheme().component.flatButton.secondaryTextColor;
    const defaultColor = "#FFFFFF";

    return (
      <div>
        <div className="row">
          <div className="left col-xs-12 col-sm-4 col-md-4 col-lg-4">

            <h1>Search MyVariant.info</h1>

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
                      <span className="itemSecondaryTitle title1">mv.getfields()<br/>
                        <span className="itemSecondaryTitle title2">Hits http://myvariant.info/v1/fields</span>
                      </span>
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
                      <span className="itemSecondaryTitle title1">mv.getfields('gene')<br/>
                        <span className="itemSecondaryTitle title2">Hits http://myvariant.info/v1/fields, filters for 'gene'</span>
                      </span>
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
                      <span className="itemSecondaryTitle title1">mv.getvariant('chr9:g.107620835G>A')<br/>
                        <span className="itemSecondaryTitle title2">Hits http://myvariant.info/v1/variant/chr9:g.107620835G>A</span>
                      </span>
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
            </div>

            <div className="results">
                { this.state.isLoading ? <div className="center-xs ">Loading...</div> :
                    this.state.datas.length ? <ResultTable datas={this.state.datas} format={this.state.dataFormat}/> :
                      <div className="center-xs ">No rows.  Run a Search.</div> }
            </div>

          </div>

        </div>

      </div>
    );
  },

});

module.exports = Main;
