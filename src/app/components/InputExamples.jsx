'use strict';

import React from 'react';
import mui from 'material-ui';
const mixins = require('baobab-react/mixins');

// ----------------- ExamplesInput COMPONENT -------------------------------------- //
/* What this does:
*/


const ExamplesInput = React.createClass({
  mixins: [mixins.branch],

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  cursors: {
  },

  render() {
    return (
      <div></div>
    )
  }

});

module.exports = ExamplesInput;
