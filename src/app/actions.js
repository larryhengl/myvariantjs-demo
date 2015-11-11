
const utils = require('./utils.js');
const mv = require('myvariantjs');
const flat = require('flat');

export function setWatchers(tree) {
  var watchErrors = tree.watch({
    input: ['activeQuery','input'],
    output: ['activeQuery','output'],
  });

  watchErrors.on('update', function(e) {
    debugger
  });
};

export function copyOutput(tree, from) {
  const main = tree.select('activeTabs').get('Main');
  let cur = tree.select('query', main);
  if (from === "defaults") {
    cur.set('output', tree.get('defaults','output'));
    cur.set('copyOutputFrom', null);
  } else {
    cur.set('output', tree.get('query', from, 'output'));
    cur.set('copyOutputFrom', from);
  }
};

export function toggleFieldList(tree) {
  tree.set('showFieldList', !tree.get('showFieldList'));
};

export function setFieldCursor(tree,val) {
  tree.set('fieldCursor', val);
};

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
      let cur = tree.get('fieldCursor');
      if (!utils._isEmpty(cur)) {
        AQ.select('input', cur, 'name').set(field.name);
        tree.select('fieldCursor').set(null);
      }
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

export function addSearchField(tree, field) {
  // this will add a search field (seeded with empty name and value).
  // this differs from the above addField fn in that it only adds input fields for search
  let accountedFor = true;
  let input = tree.select('query','search','input');
  let fields = input.get();
  if (fields && fields.length) {
    fields.forEach((field,idx)=>{
      if (!field.name) accountedFor = false;
    })
  }
  if (accountedFor) {
    input.push({name:null,value:null});
  }
};

export function removeSearchField(tree,idx) {
  // remove input field+term at given index
  let cur = tree.select('query','search','input');
  if (cur.get().length <= 1) {
    cur.set([{name:null,value:null}])
  } else {
    cur.splice([idx,1])
  }
};


export function removeInput(tree, field) {
  // can remove fielded inputs
};

export function clearInput(tree, source) {
  // can remove all input fields and values
  if (source === 'search') {
    tree.select('query','search','input').set([{name:null,value:null}])
  } else if (source === 'search.q') {
    tree.select('query','search','q').set(null);
  } else {
    tree.select('query',source,'input').set(null);
  }

};

export function clearOutput(tree) {
  // can remove all output fields
};


export function fetchData(tree,exampleN) {
    let self = this;
    let example = exampleN;

    // check if example is a string call by name or an object argument.
    // if string then do an example lookup, otherwise assume the obj passed is an example obj.
    if (typeof exampleN === 'string') {
      // if same example then kick out.
      if (exampleN === tree.activeQuery.lastExample) return;
      example = tree.query.examples.data[exampleN];
    }

    tree.set('isLoading',true);

    let got = example.params === null ? mv[example.caller]() : mv[example.caller](...example.params);
    got.then(
        function(res) {
          let dat = res;
          if (!Array.isArray(res)) dat = [res];
          if (example.caller === 'getfields') dat = utils._flatten(res);
          if (example.caller === 'query') dat = utils._flatten(res.hits);
          dat = dat.map(d => flat(d));
          tree.set('isLoading',false);
          tree.select('activeTabs','Query').set('results');
          tree.select('query',tree.get('activeTabs', 'Main')).set('results',dat);
      })
      .catch(
        function(reason) {
          console.log('All manner of chaos ensued.  Data could not be fetched, for this reason: '+reason);
          tree.set('isLoading',false);
          let cur = tree.select('query',tree.get('activeTabs', 'Main'));
          tree.set('error',true);
          tree.select('activeTabs','Query').set('results');
          cur.set('results',reason);
          cur.set('error',true);
      });
};

export function formatRequest(tree, searchType) {
  const self = this;
  //const cur = tree.select('query',searchType);
  const cur = tree.select('activeQuery');
  let arr = [];
  let q;
  if (searchType === 'search') {
    q = cur.get('input').map(f => f.name+':'+f.value).join(' AND ');
  } else if (searchType === 'search.q') {
    q = cur.get('q');
  } else {
    q = cur.get('input');
  }

  // attach the output args if any
  let output = cur.get('output');
  let opts = {};
  if (output.fields && output.fields.length) opts.fields = output.fields.join();
  if (output.size) opts.size = output.size;
  if (output.from) opts.from = output.from;
  if (output.scope && output.scope.length) opts.scope = output.scope.join();

  // set caller.  these reference the respective methods in the myvariantjs API.
  //  note: the example calls are intercepted and parsed in the fetchData method above.
  const caller = {
    'exact': 'getvariant',
    'search': 'query',
    'search.q': 'query',
    'batch': 'querymany',
    'passthru': 'passthru',
  };

  return {'caller':caller[searchType],'params':[q,opts]};
};
