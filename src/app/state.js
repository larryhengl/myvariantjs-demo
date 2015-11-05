let Baobab = require('baobab');
let monkey = Baobab.monkey;
let utils = require('./utils.js');

const tree = {
  isLoading: false,
  colors: {
    white: "#FFFFFF",
    green: "#62CE2B",
    blue: "#2679E1",
  },
  fields: null,
  showFieldList: false,
  activeTabs: {
    Main: 'select',
    Query: 'input',
  },
  previewFormat: 'table',
  previewFormats: ['json','csv','tsv','table'],
  defaults: {
    tabs: {
      Main: 'select',
      Query: 'input',
    },
    output: {
      fields: 'all',
      size: 10,
      from: 0,
      scope: null,
    },
  },
  query: {
    exact: {
      input: null,
      output: null,
      results: null,
    },
    select: {
      input: null,
      output: null,
      results: null,
    },
    batch: {
      input: null,
      output: null,
      results: null,
    },
    passthru: {
      input: null,
      output: null,
      results: null,
    },
    examples: {
      input: null,
      data: null,
      lastExample: null,
      results: null,
    },
  },

  activeQuery: monkey({
    cursors: {
      main: ['activeTabs', 'Main'],
      query: ['query']
    },
    get: function(cur) {
      return cur.query[cur.main];
    }
  }),

  preview: monkey({
    cursors: {
      activeQuery: ['activeQuery'],
      format: ['previewFormat'],
    },
    get: function(cur){
      let cb = (data) => data;
      if (!cur.activeQuery.results) return null;
      return utils._convert(cur.format, cur.activeQuery.results.slice(7), cb);
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
tree.query.select.output = Object.assign(tree.defaults.output);
tree.query.batch.output = Object.assign(tree.defaults.output);
tree.query.passthru.output = Object.assign(tree.defaults.output);


module.exports = new Baobab(tree);
