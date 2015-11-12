'use strict';

import React from 'react';
import mui from 'material-ui';
const mixins = require('baobab-react/mixins');
import Preview from './Preview.jsx';

// -----------------  Results COMPONENT -------------------------------------- //

/* What this does:
 *  Shows the results of the search.  Defaults to table format in preview mode.
 * ToDo: add the FixedDataTable component.
*/
const Results = React.createClass({
  mixins: [mixins.branch],

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  cursors: {
    tabs: ['activeTabs'],
    //results: ['activeQuery','results'],
  },

  render() {
    let results = [];
    if (this.state.tabs.Query==="results") {
      //if (!this.state.results) {
      //  results.push(<p className="centered">No results yet.  Run a search!</p>)
      //} else if (this.state.results.length === 0) {
      //  results.push(<p className="centered">No records found for your search.</p>)
      //} else {
        results.push(<Preview />)
      //}
    }

    return (
      <div className={(this.state.tabs.Query==="results" ? "results" : "hidey")} >
        {results}
      </div>
    )
  }

});

module.exports = Results;
