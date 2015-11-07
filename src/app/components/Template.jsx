'use strict';

import React from 'react';
import mui from 'material-ui';
const mixins = require('baobab-react/mixins');

// -----------------  COMPONENT -------------------------------------- //
/* What this does:
*/


const TEMPLATE = React.createClass({
  mixins: [mixins.branch],

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  cursors: {
  },

  render() {
    return (
    )
  }

};
module.exports = TEMPLATE;
