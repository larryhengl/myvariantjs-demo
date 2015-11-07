'use strict';

import React from 'react';
import mui from 'material-ui';
const mixins = require('baobab-react/mixins');

// -----------------  BatchInput COMPONENT -------------------------------------- //
/* What this does:
*/


const BatchInput = React.createClass({
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

module.exports = BatchInput;
