require("babelify/polyfill");
const React = require('react');
const flat = require('flat');
const mui = require('material-ui');
const mv = require('myvariantjs');
const utils = require('../utils');

let Query = require('./Query.jsx');
let Result = require('./Result.jsx');
let ThemeManager = mui.Styles.ThemeManager;

// customize theme
let customTheme = ThemeManager.getMuiTheme(mui.Styles.LightRawTheme);
customTheme.tabs.backgroundColor = "#FFFFFF";
customTheme.raisedButton.primaryColor = "#62CE2B";
customTheme.flatButton.primaryTextColor = "#62CE2B";
customTheme.flatButton.secondaryTextColor = "#2679E1";
customTheme.inkBar.backgroundColor = "#62CE2B";

customTheme.textField.floatingLabelColor = "#2679E1";
customTheme.textField.focusColor = "#2679E1";
customTheme.textField.borderColor = "#2679E1";


let Main = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: customTheme
    };
  },

  getInitialState(){
    let colors = {
        primaryColor: customTheme.flatButton.primaryTextColor,
        secondaryColor: customTheme.flatButton.secondaryTextColor,
        defaultColor: "#FFFFFF",
    };
    let actions = [
        {'num':'0','caller':'getfields','params':null,'title1':'Get all fields','title2':"GET http://myvariant.info/v1/metadata/fields"},
        {'num':'1','caller':'getfields','params':['gene'],'title1':"Get field names containing <span style='color: " + colors.secondaryColor + ";'>gene</span>",'title2':"GET http://myvariant.info/v1/metadata/fields, filters for 'gene'"},
        {'num':'2','caller':'getvariant','params':['chr9:g.107620835G>A'],'title1':"Get variant <span style='color: " + colors.secondaryColor + ";'>chr9:g.107620835G>A</span>",'title2':"GET http://myvariant.info/v1/variant/chr9:g.107620835G>A"},
        {'num':'3','caller':'getvariant','params':['chr9:g.107620835G>A', ["dbnsfp.genename", "cadd.phred"]],'title1':"Get variant <span style='color: " + colors.secondaryColor + ";'>chr9:g.107620835G>A</span>, only show <span style='color: " + colors.secondaryColor + ";'>dbnsfp.genename</span> and <span style='color: " + colors.secondaryColor + ";'>cadd.phred</span> fields.",'title2':"GET http://myvariant.info/v1/variant/chr9:g.107620835G>A?fields=dbnsfp.genename,cadd.phred"},
        {'num':'4','caller':'getvariants','params':['chr1:g.866422C>T,chr1:g.876664G>A,chr1:g.69635G>C'],'title1':"Get variants <span style='color: " + colors.secondaryColor + ";'>chr1:g.866422C>T</span>, <span style='color: " + colors.secondaryColor + ";'>chr1:g.876664G>A</span>, <span style='color: " + colors.secondaryColor + ";'>chr1:g.69635G>C</span>",'title2':"POST http://myvariant.info/v1/variant/"},
        {'num':'5','caller':'query','params':['chr1:69000-70000'],'title1':"Get variants for genomic range <span style='color: " + colors.secondaryColor + ";'>chr1:69000-70000</span>",'title2':"GET http://myvariant.info/v1/query?q=chr1:69000-70000"},
        {'num':'6','caller':'query','params':['dbsnp.vartype:snp'],'title1':"Get variants for matching value on a specific field <span style='color: " + colors.secondaryColor + ";'>dbsnp.vartype:snp</span>",'title2':"GET http://myvariant.info/v1/query?q=dbsnp.vartype:snp"},
    ];
    return {
      colors: colors,
      actions: actions,
      short: false,
      isLoading: false,
      data: [],
      fields: [],
      lastAction: null,
      activeTab: 'search',  // 'search','find','examples'
    };
  },

  componentWillMount() {
    // prefetch the fields from myvariant
    let self = this;
    let action = {'caller':'getfields','params':null};
    let got = action.params === null ? mv[action.caller]() : mv[action.caller](...action.params);
    got.then(
        function(res) {
          let dat = res;
          if (!Array.isArray(res)) dat = [res];
          dat = utils._flatten(res);
          dat = dat.map( d => flat(d) );
          self.setState({fields:dat});
      })
      .catch(
        function(reason) {
          console.log('All manner of chaos ensued.  Data could not be fetched, for this reason: '+reason);
          //self.setState({data:[]});
      });
  },

  _shorten(){
    this.setState({short:true})
  },

  _setState(data){
    this.setState(data)
  },

  _setTab(t){
    this.setState({activeTab:t})
  },

  render(){
    return (
      <div>

        <section className={"page-header"+(this.state.short ? " short" : "")}>
          <section className="sub1">
            <h1 className="project-name">myvariantjs</h1>
            <h2 className="project-name project-tagline">A UI to Search <a href="http://myvariant.info/" target="_blank">MyVariant.info</a></h2>
            <h5 className="project-tagline">
              <span style={{color:'#b5b5b5'}}>
                This is an experiment that tests the myvariantjs lib and incorparates some of the latest JS technologies:
                <br/>
                React, React Material UI, Gulp, Browserify, Babel (ES6)</span>
            </h5>
            <a href="https://github.com/larryhengl/myvariantjs-demo" className="btn">View on GitHub</a>
          </section>
          <section className="sub2">
            <h1 className="project-name">Search <a href="http://myvariant.info/" target="_blank">MyVariant.info</a></h1>
          </section>
        </section>

        {/*<section className="main-content" onClick={this._shorten}>*/}
        <section className="main-content">
          <div className="row">

            <Query
              colors={this.state.colors}
              actions={this.state.actions}
              _setState={this._setState}
              fields={this.state.fields}
              activeTab={this.state.activeTab}
              _setTab={this._setTab} />

            <Result
              isLoading={this.state.isLoading}
              data={this.state.data}
              actions={this.state.actions}
              lastAction={this.state.lastAction} />

          </div>
        </section>

        <section className="page-footer">
          <footer className="site-footer">
            <span className="site-footer-owner"><a href="https://github.com/larryhengl/myvariantjs-demo">myvariantjs-demo</a> is maintained by <a href="https://github.com/larryhengl">larryhengl</a>.</span>
            <span className="site-footer-credits">This page is based on a generated <a href="https://pages.github.com">GitHub Page</a> / <a href="https://github.com/jasonlong/cayman-theme">Cayman theme</a> by <a href="https://twitter.com/jasonlong">Jason Long</a>.</span>
          </footer>
        </section>

      </div>
    )
  }

});

module.exports = Main;
