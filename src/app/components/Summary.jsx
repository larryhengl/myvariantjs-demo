'use strict';

import React from 'react';
import mui from 'material-ui';
const mixins = require('baobab-react/mixins');

// -----------------  Summary COMPONENT -------------------------------------- //
/* What this does:
*/

const Summary = React.createClass({
  mixins: [mixins.branch],
  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  // Mapping baobab cursors
  cursors: {
    mainTab: ['activeTabs','Main'],
    queryTab: ['activeTabs','Query'],
    activeQuery: ['activeQuery'],
  },

  _setTab(t,e){
    e.preventDefault();
    if (e.currentTarget.classList.contains('inactive')) return;
    if (this.state.queryTab !== t) this.cursors.queryTab.set(t);
  },

  _setActive(tab){
    let classy = this.state.queryTab===tab ? " active" : "";
    if ((['passthru','examples'].indexOf(this.state.mainTab) > -1) && tab==="output") classy = " inactive";
    return classy;
  },

  render() {
    let output = [];
    if (this.state.activeQuery.output.fields && this.state.activeQuery.output.fields.length) {
      output.push(<span key="det0" className="details">fields: {this.state.activeQuery.output.fields.join()}</span>);
      output.push(<span key="det1" className="details">size: {this.state.activeQuery.output.size}</span>);
      output.push(<span key="det2" className="details">from: {this.state.activeQuery.output.from}</span>);
    } else {
      output.push(<span key="det0" className="centered">Define Output Fields?</span>);
    }
    return (
      <div className="summary row">
        <div className="summary-masthead inactive summary-block col-xs-3 col-sm-3 col-md-3 col-lg-3">
          <p className="centered">Search Summary</p>
        </div>
        <div className={"summary-input summary-block col-xs-3 col-sm-3 col-md-3 col-lg-3" + this._setActive('input')} onTouchTap={this._setTab.bind(null,'input')}>
          <h3>Input</h3>
          <span className="centered">Add Search Input</span>
        </div>
        <div className={"summary-output summary-block col-xs-3 col-sm-3 col-md-3 col-lg-3"+ this._setActive('output')} onTouchTap={this._setTab.bind(null,'output')}>
          <h3>Output</h3>
          {output}
        </div>
        <div className={"summary-results summary-block col-xs-3 col-sm-3 col-md-3 col-lg-3"+ this._setActive('results')} onTouchTap={this._setTab.bind(null,'results')}>
          <h3>Results</h3>
          <span className="centered">Results</span>
        </div>
      </div>
    )
  }

});
module.exports = Summary;
