'use strict';

import React from 'react';
import mui from 'material-ui';
const mixins = require('baobab-react/mixins');

// ----------------- SearchInput COMPONENT -------------------------------------- //
/* What this does:
*/


const SearchInput = React.createClass({
  mixins: [mixins.branch],

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  cursors: {
  },

  render() {
    return (
      <div>
          <FieldList />
      </div>
    )
  }

});

module.exports = SearchInput;
