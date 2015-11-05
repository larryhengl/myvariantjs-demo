const React = require('react');
const ReactDOM = require('react-dom');

let injectTapEventPlugin = require('react-tap-event-plugin');
let tree = require('./state.js');
let Main = require('./components/Main.jsx'); // Our custom react component

//Needed for React Developer Tools
window.React = React;

//Needed for onTouchTap
//Can go away when react 1.0 is released
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

// Render the main app react component into the document body.
// For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
ReactDOM.render(<Main tree={tree} />, document.querySelector("#app"));
