// Speed up calls to hasOwnProperty
let hasOwnProperty = Object.prototype.hasOwnProperty;

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
  }

};
