'use strict';

import React from 'react';
import mui from 'material-ui';
const mixins = require('baobab-react/mixins');
const CircularProgress = mui.CircularProgress;

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
    isLoading: ['isLoading'],
    colors: ['colors'],
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
    // summarize inputs
    let input = [];

    if (this.state.activeQuery.input) {
      if (Array.isArray(this.state.activeQuery.input)) {
        if (this.state.activeQuery.q) {
          input.push(<span key="details" className="details">{this.state.activeQuery.q}</span>);
        } else if (this.state.activeQuery.input.length && this.state.activeQuery.input[0].name) {
          let inputs = this.state.activeQuery.input.filter(inp => inp.name).map((inp,i) => {
              return <div key={"det"+i} className="details"><span>{inp.name}: {inp.value}</span></div>;
          });

          input.push(
            <div key="deets" className="deets">
              {inputs}
            </div>
          );

        } else {
          input.push(<span key="nodeets" className="centered">Add Search Input</span>);
        }
      } else {
        input.push(<span key="details" className="details">{this.state.activeQuery.input}</span>);
      }
    } else {
      input.push(<span key="nodeets" className="centered">Add Search Input</span>);
    }

    // summarize outputs
    let output = [];
    if (this.state.activeQuery.output.fields && this.state.activeQuery.output.fields.length) {
      output.push(
        <div key="deets" className="deets">
          <div key="det0" className="details">fields({this.state.activeQuery.output.fields.length||0}): {this.state.activeQuery.output.fields.join(', ')}</div>
          <div key="det1" className="details">size: {this.state.activeQuery.output.size}</div>
          <div key="det2" className="details">from: {this.state.activeQuery.output.from}</div>
        </div>
    );
    } else {
      output.push(<span key="nodeets" className="centered">Define Output Fields?</span>);
    }


    // summarize results
    let result = [];
    if (this.state.isLoading) {
      result.push(<CircularProgress color={this.state.colors.green} style={{marginLeft: '40%'}} mode="indeterminate" size={0.75} />);
    } else {
      if (this.state.activeQuery.results && this.state.activeQuery.results.length) {
        result.push(
          <div key="deets" className="res"><p>{this.state.activeQuery.results.length + ' Row' + (this.state.activeQuery.results.length > 1 ? 's' : '')}</p></div>
      );
      } else {
        result.push(<span key="nodeets" className="centered">No Results</span>);
      }
    }

    return (
      <div className="summary row">
        <div className="summary-masthead inactive summary-block col-xs-3 col-sm-3 col-md-3 col-lg-3">
          <p className="centered">Search Summary</p>
        </div>
        <div className={"summary-input summary-block col-xs-3 col-sm-3 col-md-3 col-lg-3" + this._setActive('input')} onTouchTap={this._setTab.bind(null,'input')}>
          <h3>Input</h3>
          {input}
        </div>
        <div className={"summary-output summary-block col-xs-3 col-sm-3 col-md-3 col-lg-3"+ this._setActive('output')} onTouchTap={this._setTab.bind(null,'output')}>
          <h3>Output</h3>
          {output}
        </div>
        <div className={"summary-results summary-block col-xs-3 col-sm-3 col-md-3 col-lg-3"+ this._setActive('results')} onTouchTap={this._setTab.bind(null,'results')}>
          <h3>Results</h3>
          {result}
        </div>
      </div>
    )
  }

});
module.exports = Summary;
