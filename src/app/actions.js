
export function copyOutput(tree, from) {
  tree.select('activeQuery').set('output', tree.select('query',from).get('output'));
};

export function toggleFieldList(tree) {
  tree.set('showFieldList', !tree.get('showFieldList'));
};

//exports.onFieldItemTap = function(tree, field) {
export function addField(tree, field) {
  // the field arg should have the index of the input passed in from the calling component
  //   and the selected name from the fieldlist
  // lookup the active query
  // run the logic to assign the field name at the given input index,
  //   or simply add the value to the output or scope arrays.
  const AT = tree.select('activeTabs');
  const main = AT.get('Main');
  const query = AT.get('Query');
  const AQ = tree.select('query',main);
  if (query === 'output') {
    if (AQ.get('output').fields.indexOf(field.name) === -1) {
      AQ.select('output','fields').push(field.name);
    }
  } else if (query === 'input') {
    if (main === 'search') {
      AQ.select('input', field.idx, 'name').set(field.name);
    } else if (main === 'batch') {
      if (AQ.get('scope').indexOf(field.name) === -1) AQ.select('scope').push(field.name);
    }
  }
};


export function removeField(tree, field) {
  // can remove fields from fieldlist for
  //   input, output & scope
  const AT = tree.select('activeTabs');
  const main = AT.get('Main');
  const query = AT.get('Query');
  const AQ = tree.select('query',main);
  if (query === 'output') {
    let fields = idx = AQ.get('output').fields;
    let idx = fields.indexOf(field);
    if (idx !== -1) {
      let c = AQ.select('output','fields');
      c.splice([idx,1]);
    }
  } else if (query === 'input') {
    if (main === 'search') {
      AQ.select('input').splice(field.idx,[1,1]);
    } else if (main === 'batch') {
      if (AQ.get('scope').indexOf(field.name) !== -1) AQ.select('scope').splice(field.name,[1,1]);
    }
  }
};

export function removeInput(tree, field) {
  // can remove fielded inputs
};

export function clearInput(tree) {
  // can remove all input fields and values
};

export function clearOutput(tree) {
  // can remove all output fields
};
