// Speed up calls to hasOwnProperty
let hasOwnProperty = Object.prototype.hasOwnProperty;
let jsonexport = require('jsonexport');

module.exports = {

  _flatten(data) {
    return Object.keys(data).map(k => {
      return Object.assign({'fieldname': k}, data[k]);
    });
  },

  _deepCopy(ob) {
    return JSON.parse(JSON.stringify(ob));
  },

  _htmlify(str) {
    return {__html: str};
  },

  _toProperCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  },

  _isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;
    if (typeof obj === "undefined") return true;

    // eval'd number
    if (typeof obj === "number") return false;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (let key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
  },

  _convert(format,dat,cb){
    let options = {};
    let data = !Array.isArray(dat) ? [dat] : dat;
    if (['tsv','table','flat'].indexOf(format) > -1) options.rowDelimiter = '\t';
    if (['csv'].indexOf(format) > -1) options.rowDelimiter = ',';

    jsonexport(data, options, (err, csv) => {
        if(err) return console.log(err);
        cb(csv);
    });
  },

};
