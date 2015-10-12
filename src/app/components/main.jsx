require("babelify/polyfill");
const React = require('react');
const mui = require('material-ui');
const mv = require('myvariantjs');
let Query = require('./Query.jsx');
let Result = require('./Result.jsx');
let ThemeManager = mui.Styles.ThemeManager;

let customTheme = ThemeManager.getMuiTheme(mui.Styles.LightRawTheme);
customTheme.tabs.backgroundColor = "#FFFFFF";
customTheme.flatButton.primaryTextColor = "#62CE2B";
customTheme.flatButton.secondaryTextColor = "#2679E1";
customTheme.inkBar.backgroundColor = "#62CE2B";

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
    return {
      isLoading: false,
      data: [],
      short: false,
      lastAction: null,
    };
  },

  _shorten(){
    this.setState({short:true})
  },

  _setState(data){
    this.setState(data)
  },

  render(){
    return (
      <div>

        <section className={"page-header"+(this.state.short ? " short" : "")}>
          <section className="sub1">
            <h1 className="project-name">myvariantjs-demo</h1>
            <h2 className="project-tagline">A demo app for myvariantjs</h2>
            <h3 className="project-tagline">
              <span style={{color:'#b5b5b5'}}>
                This is an experiment that tests the myvariantjs lib and incorparates some of the latest JS technologies:
                <br/>
                React, React Material UI, Gulp, Browserify, Babel (ES6)</span>
            </h3>
            <a href="https://github.com/larryhengl/myvariantjs-demo" className="btn">View on GitHub</a>
          </section>
          <section className="sub2">
            <h1 className="project-name">Search <a href="http://myvariant.info/" target="_blank">MyVariant.info</a></h1>
          </section>
        </section>

        <section className="main-content" onClick={this._shorten}>
          <div className="row">
            <Query _setState={this._setState} />
            <Result isLoading={this.state.isLoading} data={this.state.data} lastAction={this.state.lastAction}/>
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