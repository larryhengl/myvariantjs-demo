'use strict';

const React = require('react');
const mui = require('material-ui');
const mv = require('myvariantjs');
const utils = require('../utils');
const mixins = require('baobab-react/mixins');

import InputExact from './InputExact.jsx';
import InputSearch from './InputSearch.jsx';
import InputBatch from './InputBatch.jsx';
import InputPassThru from './InputPassThru.jsx';
import InputExamples from './InputExamples.jsx';

// --------------- Inputs COMPONENT ---------------------------------------- //
const Inputs = React.createClass({
  mixins: [mixins.branch],
  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  cursors: {
    tab: ['activeTabs','Query'],
  },

  render() {
    const tab = this.state.mainTab;
    const self = this;

    // -------------------- RENDER --------------------------------------- //
    return (
      <div className={(this.state.tab==="input" ? "input query" : "hidey")}>
        <InputExact />
        <InputSearch />
        <InputBatch />
        <InputPassThru />
        <InputExamples />
      </div>
    );
  },

});

module.exports = Inputs;
