
let utils = require('./utils.js');

export function copyOutput(tree, from) {
  const main = tree.select('activeTabs').get('Main');
  let cur = tree.select('query', main);
  cur.set('output', tree.select('query', from).get('output'));
  cur.set('copyOutputFrom', from);
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
  }
  if (source === 'search.q') {
    tree.select('query','search','q').set(null);
  }
};

export function clearOutput(tree) {
  // can remove all output fields
};


export function fetchData(tree,exampleN) {
    if (exampleN === this.state.lastExample) return;

    let self = this;
    self.setState({'isLoading':true});

    let example = exampleN;
    // check if example is a string call by name or an object argument.
    // if string then do an example lookup, otherwise assume the obj passed is an example obj.
    if (typeof exampleN === 'string') example = self.state.examples[exampleN];

    let got = example.params === null ? mv[example.caller]() : mv[example.caller](...example.params);
    got.then(
        function(res) {
          let dat = res;
          if (!Array.isArray(res)) dat = [res];
          if (example.caller === 'getfields') dat = utils._flatten(res);
          if (example.caller === 'query') dat = utils._flatten(res.hits);
          dat = dat.map( d => flat(d) );
          self.setState({data:dat,'isLoading':false,'lastExample':exampleN});
      })
      .catch(
        function(reason) {
          console.log('All manner of chaos ensued.  Data could not be fetched, for this reason: '+reason);
          self.setState({data:[],'isLoading':false,'lastExample':exampleN});
      });
};

export function formatRequest(tree,searchType) {
    var self = this;
    if (searchType === 'search') {
      let arr = [];
      let q;
      let opts = {};
      if (this.state.qSearch) {
        q = this.state.qSearch;
      } else {
        Object.keys(this.state.searchFields.search).map(function(f){
          if (self.state.searchFields.search[f] && self.state.searchFields.search[f].value)
            arr.push(self.state.searchFields.search[f].name+':'+self.state.searchFields.search[f].value)
        })
        q = arr.join(' AND ');
      }
      // attach the fields args if any
      if (this.state.searchFields.output && this.state.searchFields.output.length) {
        opts.fields = this.state.searchFields.output.join();
      }
      return {'caller':'query','params':[q,opts]};  // currently forcing ANDed terms
    }
    if (searchType === 'find') {
      return {'caller':'querymany','params':[this.state.qSearchMany,this.state.scopeFields]};
    }
    return null;
};
