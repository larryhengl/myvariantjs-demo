'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const flat = require('flat');
const mui = require('material-ui');
const mv = require('myvariantjs');
const utils = require('../utils');
const mixins = require('baobab-react/mixins');
const Query = require('./Query.jsx');
const ThemeManager = mui.Styles.ThemeManager;

const Main = React.createClass({
  mixins: [mixins.root],

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getChildContext() {
    let colors = this.props.tree.get().colors;

    // customize theme
    let customTheme = ThemeManager.getMuiTheme(mui.Styles.LightRawTheme);
    customTheme.tabs.backgroundColor = colors.white;
    customTheme.raisedButton.primaryColor = colors.green;
    customTheme.flatButton.primaryTextColor = colors.green;
    customTheme.flatButton.secondaryTextColor = colors.blue;
    customTheme.inkBar.backgroundColor = colors.green;
    customTheme.textField.floatingLabelColor = colors.blue;
    customTheme.textField.focusColor = colors.blue;
    customTheme.textField.borderColor = colors.blue;

    return {
      muiTheme: customTheme
    };
  },

  componentWillMount() {
    let self = this;
    // prefetch the fields from myvariant
    mv.getfields().then(
        function(res) {
          let dat = res;
          if (!Array.isArray(res)) dat = [res];
          dat = utils._flatten(res);
          dat = dat.map( d => flat(d) );
          self.props.tree.select('fields').set(dat);
      })
      .catch(
        function(reason) {
          console.log('All manner of chaos ensued.  Fields could not be fetched, for this reason: '+reason);
      });
  },

  render(){
    return (
      <div>

        <section className={"page-header"}>
          <section className="sub1">
            <h1 className="project-name">myvariantjs</h1>
            <h2 className="project-name project-tagline">A UI to Search <a href="http://myvariant.info/" target="_blank">MyVariant.info</a></h2>
            <h5 className="project-tagline">
              <span style={{color:'#b5b5b5'}}>
                This is an experiment that tests the myvariantjs lib and incorparates some of the latest JS technologies:
                <br/>
                React, React Material UI, Baobab, Gulp, Browserify, Babel (ES6)</span>
            </h5>
            <a href="https://github.com/larryhengl/myvariantjs-demo" className="btn">View on GitHub</a>
          </section>
        </section>

        {/*  MAIN QUERY COMPONENT INSERTION POINT */}
        <section className="main-content row">
          <Query />
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
