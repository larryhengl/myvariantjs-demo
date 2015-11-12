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
const Dialog = mui.Dialog;
const SvgIcon = mui.SvgIcon;
const IconButton = mui.IconButton;
const InfoIcon = require('../svg-icons/info-outline.jsx');

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
    customTheme.radioButton.checkedColor = colors.green;

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

  _onInfoTap(e) {
    this.refs.infoDialog.show();
  },

  _noop(e){
    e.stopPropagation()
    e.preventDefault();
  },

  render(){
    return (
      <div>

        <section className={"page-header"}>
          <section className="sub1 row">
            <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
              <h1 className="project-name">Search <a href="http://myvariant.info/" target="_blank" title="go to the myvariant.info homepage">MyVariant.info <img src="assets/img/myvariant.png" width="50px" /></a></h1>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2" style={{paddingTop: '8px'}}>
                <a href="" onClick={this._noop} className="btn btnInfo">
                  <IconButton tooltip="Info" touch={true} onTouchTap={this._onInfoTap}>
                    <InfoIcon className="faded-grey" />
                  </IconButton>
                </a>
                <a href="https://github.com/larryhengl/myvariantjs-demo" target="_blank" className="btn btnGitHub" title="see the code on GitHub">
                  <img src="assets/img/GitHub-Mark-32px.png" width="25px" />
                </a>
            </div>

            <Dialog
              ref="infoDialog"
              title={"What is this?"}
              autoDetectWindowHeight={true}
              autoScrollBodyContent={true}
              actions={[{ text: 'Got it' }]} >
              <span style={{color:'grey'}} className="infoDialogContents">
                  <p>This web app is a basic search page designed to test the <b>myvariantjs</b> lib.</p>
                  <br/>

                  <h3>HowTo</h3>
                  <ul className="infoList">Each tab is a separate search type:
                    <li><span className="bold">Exact</span> - run an exact search for a given variantid (HGVS formed). You can also enter multiple ids as comma-separated.</li>
                    <li><span className="bold">Search</span> - Run a fielded search by selecting the field [+ Field] button, then entering a term. You can supply multiple field+term entries. You can alternatively run a general search, but it is limited to rsid or HGVS names or chromosome range.</li>
                    <li><span className="bold">Batch</span> - Enter comma-separated list of terms.  You can supply fields to scope the search to.</li>
                    <li><span className="bold">Pass-Thru</span> - Enter a full URL address with query string parameters.</li>
                    <li><span className="bold">Examples</span> - Select one of the exmaple queries listed.</li>
                  </ul>

                  <br/>
                  <h3>Summary</h3>
                  <p>The Summary bar shows what Inputs and Outputs you have selected, and the Results box summarizes the query response.</p>
                  <p>You can select any of those three box (Input, Output, Results) to open its panel below.</p>

                  <br/>
                  <h3>Inputs</h3>
                  <p>You can enter the inputs needed for searching according to the search type, indicated at the top of this help dialog.</p>
                  <p>Hit the <span className="bold">+ Fields</span> button to open a field picker.</p>
                  <p>Usually you can find an <span className="bold">X</span> button to remove inputs.</p>
                  <p>Hit <span className="bold">Submit</span> to run the search.</p>
                  <p>Hit <span className="bold">Clear</span> to reset the inputs.</p>

                  <br/>
                  <h3>Outputs</h3>
                  <p>Open the Output panel to select field to limit the result to.  You can aslo supply reault fetch sizes and offsets (which are typically used for paging results).</p>
                  <p>You can copy Output settings for other search types.</p>
                  <p>If needed, you can re-submit the query with any updated output settings, or reset them to the defaults ("all fields", etc).</p>

                  <br/>
                  <h3>Results</h3>
                  <p>After submitting the search the Results panel will open showing the query response.</p>
                  <p>The Results Summary box will indicate a <span className="bold">TOTAL</span> count of rows fetched.</p>
                  <p>But currently you will only see a preview of the results, <span className="bold">LIMITED TO 7</span> rows.</p>
                  <p>The format tabs will convert the preview accordingly.</p>
                  <p>The <span className="bold">Export</span> tab will download a file containing the <span className="bold">FULL</span> set of rows, according to the actively selected format.</p>


                  <br/>
                  <h3>API Features to be added to this UI (and myvariantjs lib)</h3>
                  <ul className="infoList">
                    <li><span className="bold">Sorting</span> - so that the server returns pre-sorted data.</li>
                    <li><span className="bold">Facets</span> - for grouping.</li>
                    <li><span className="bold">fetch_all</span> - for returning large sets of un-ordered data.</li>
                    <li><span className="bold">scroll_id</span> - used for offsets in fetch_all</li>
                  </ul>

                  <br/>
                  <h3>In The Future...</h3>
                  <p>We will implement a data table widget to show and sort/filter the entire result set.</p>
                  <p>We may add the ability to paste or upload lists of ids for the barch searches.</p>
                  <p>Perhaps we will remove the Preview feature.</p>
                  <p>We could add a VFC parser or uploader?</p>
                  <p>We could implement the email feature from the MyVariant.info service API.</p>
                  <p>Possibly add the cool stuff you folks tell us about.</p>
                  <p>Perhaps refactor this app to use Cerebral.js</p>

                  <br/>
                  <h3>Happy Searching!</h3>
                  <br/>


                  <h3>Tools</h3>
                  <ul className="infoList">It incorparates some of the latest JS technologies:
                    <li><span className="bold">React</span> - framework.</li>
                    <li><span className="bold">Material UI</span> - design.</li>
                    <li><span className="bold">Baobab</span> - state tree.</li>
                    <li><span className="bold">Gulp + Browserify + Babel 6</span> - (for ES6) build tools.</li>
                  </ul>

              </span>
            </Dialog>

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
