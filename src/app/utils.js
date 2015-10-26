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

};
