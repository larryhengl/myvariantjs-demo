let Baobab = require('baobab');
let monkey = Baobab.monkey;
let utils = require('./utils.js');

const tree = {
  isPublic: true,    // set this to false if hosting internally
  isLoading: false,
  colors: {
    white: "#FFFFFF",
    green: "#62CE2B",
    blue: "#2679E1",
  },
  fields: null,
  showFieldList: false,
  fieldCursor: null,
  activeTabs: {
    Main: 'exact',
    Query: 'input',
  },
  dataFormat: 'table',
  dataFormats: ['json','csv','tsv','table'],
  defaults: {
    tabs: {
      Main: 'exact',
      Query: 'input',
    },
    output: {
      fields: [],
      size: 10,
      from: 0,
    },
  },
  query: {
    exact: {
      input: null,
      output: null,
      copyOutputFrom: null,
      results: null,
      error: false,
    },
    search: {
      q: null,
      input: [{name:null,value:null}],
      output: null,
      copyOutputFrom: null,
      results: null,
      error: false,
    },
    batch: {
      input: null,
      scope: null,
      output: null,
      copyOutputFrom: null,
      results: null,
      error: false,
    },
    passthru: {
      input: null,
      output: null,
      results: null,
      error: false,
    },
    examples: {
      input: null,
      data: null,
      lastExample: null,
      output: null,
      results: null,
      error: false,
    },
  },

  activeQuery: monkey({
    cursors: {
      mainTab: ['activeTabs', 'Main'],
      query: ['query']
    },
    get: function(cur) {
      return cur.query[cur.mainTab];
    }
  }),

  preview: monkey({
    cursors: {
      activeQuery: ['activeQuery'],
      dataFormat: ['dataFormat'],
    },
    get: function(cur){
      if (!cur.activeQuery.results) return null;
      return cur.activeQuery.results.slice(0,7);
    }
  }),

  activeFields: monkey({
    cursors: {
      activeQuery: ['activeQuery'],
      tabs: ['activeTabs'],
    },
    get: function(cur){
      let fields = [];
      if (cur.tabs.Query === 'input') {
        if (cur.tabs.Main === 'batch') {
          fields = cur.activeQuery.scope || [];
        } else if (cur.tabs.Main === 'search') {
          // pluck the field name
          fields = cur.activeQuery[cur.tabs.Query].map(field => field.name);
        }
      } else if (cur.tabs.Query === 'output') {
        if (cur.activeQuery[cur.tabs.Query] && cur.activeQuery[cur.tabs.Query].fields) {
          fields = cur.activeQuery[cur.tabs.Query].fields;
        }
      }
      return fields;
    }
  }),

};

tree.query.examples.data = [
    {'num':'0','caller':'getfields','params':null,'title1':'Get all fields','title2':"GET http://myvariant.info/v1/metadata/fields"},
    {'num':'1','caller':'getfields','params':['gene'],'title1':"Get field names containing <span style='color: " + tree.colors.blue + ";'>gene</span>",'title2':"GET http://myvariant.info/v1/metadata/fields, filters for 'gene'"},
    {'num':'2','caller':'getvariant','params':['chr9:g.107620835G>A'],'title1':"Get variant <span style='color: " + tree.colors.blue + ";'>chr9:g.107620835G>A</span>",'title2':"GET http://myvariant.info/v1/variant/chr9:g.107620835G>A"},
    {'num':'3','caller':'getvariant','params':['chr9:g.107620835G>A', {fields:["dbnsfp.genename", "cadd.phred"]}],'title1':"Get variant <span style='color: " + tree.colors.blue + ";'>chr9:g.107620835G>A</span>, only show <span style='color: " + tree.colors.blue + ";'>dbnsfp.genename</span> and <span style='color: " + tree.colors.blue + ";'>cadd.phred</span> fields.",'title2':"GET http://myvariant.info/v1/variant/chr9:g.107620835G>A?fields=dbnsfp.genename,cadd.phred"},
    {'num':'4','caller':'getvariants','params':['chr1:g.866422C>T,chr1:g.876664G>A,chr1:g.69635G>C'],'title1':"Get variants <span style='color: " + tree.colors.blue + ";'>chr1:g.866422C>T</span>, <span style='color: " + tree.colors.blue + ";'>chr1:g.876664G>A</span>, <span style='color: " + tree.colors.blue + ";'>chr1:g.69635G>C</span>",'title2':"POST http://myvariant.info/v1/variant/"},
    {'num':'5','caller':'query','params':['chr1:69000-70000'],'title1':"Get variants for genomic range <span style='color: " + tree.colors.blue + ";'>chr1:69000-70000</span>",'title2':"GET http://myvariant.info/v1/query?q=chr1:69000-70000"},
    {'num':'6','caller':'query','params':['dbsnp.vartype:snp'],'title1':"Get variants for matching value on a specific field <span style='color: " + tree.colors.blue + ";'>dbsnp.vartype:snp</span>",'title2':"GET http://myvariant.info/v1/query?q=dbsnp.vartype:snp"},
];

tree.query.exact.output = Object.assign(tree.defaults.output);
tree.query.search.output = Object.assign(tree.defaults.output);
tree.query.batch.output = Object.assign(tree.defaults.output);
tree.query.passthru.output = Object.assign(tree.defaults.output);
tree.query.examples.output = Object.assign(tree.defaults.output);


module.exports = new Baobab(tree);
