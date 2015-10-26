require("babelify/polyfill");

const flat = require('flat');
const React = require('react/addons');
const mui = require('material-ui');
const mv = require('myvariantjs');
const utils = require('../utils');

let FlatButton = mui.FlatButton;
let List = mui.List;
let ListItem = mui.ListItem;
let ListDivider = mui.ListDivider;
let Tabs = mui.Tabs;
let Tab = mui.Tab;
let TextField = mui.TextField;
let SelectField = mui.SelectField;
let SvgIcon = mui.SvgIcon;
let IconButton = mui.IconButton;
let AddIcon = require('../svg-icons/add.jsx');
let DelIcon = require('../svg-icons/del.jsx');

let ActionItem = React.createClass({
  render(){
    return (
      <ListItem
        data-action={this.props.action.num}
        primaryText={
          <div className="row">
            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1">
              <span style={{color: (this.props.lastAction===this.props.action.num ? this.props.colors.primaryColor : this.props.colors.defaultColor)}} className="mega-octicon super-octicon octicon-chevron-right"></span>
            </div>
            <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11">
              <span className="itemPrimaryTitle" style={{color: this.props.colors.primaryColor}} dangerouslySetInnerHTML={utils._htmlify(this.props.action.title1)}></span><br/>
              <span className="itemSecondaryTitle title2">{this.props.action.title2}</span>
            </div>
          </div>
        }
        onTouchTap={this.props.onListItemTap} />
    )
  }
});

let Query = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  contextTypes: {
    muiTheme: React.PropTypes.object,
  },
  getInitialState(){
    let colors = {
        primaryColor: this.context.muiTheme.flatButton.primaryTextColor,
        secondaryColor: this.context.muiTheme.flatButton.secondaryTextColor,
        defaultColor: "#FFFFFF",
    };
    let actions = [
        {'num':'0','caller':'getfields','params':null,'title1':'Get all fields','title2':"GET http://myvariant.info/v1/metadata/fields"},
        {'num':'1','caller':'getfields','params':['gene'],'title1':"Get field names containing <span style='color: " + colors.secondaryColor + ";'>gene</span>",'title2':"GET http://myvariant.info/v1/metadata/fields, filters for 'gene'"},
        {'num':'2','caller':'getvariant','params':['chr9:g.107620835G>A'],'title1':"Get variant <span style='color: " + colors.secondaryColor + ";'>chr9:g.107620835G>A</span>",'title2':"GET http://myvariant.info/v1/variant/chr9:g.107620835G>A"},
        {'num':'3','caller':'getvariant','params':['chr9:g.107620835G>A', ["dbnsfp.genename", "cadd.phred"]],'title1':"Get variant <span style='color: " + colors.secondaryColor + ";'>chr9:g.107620835G>A</span>, only show <span style='color: " + colors.secondaryColor + ";'>dbnsfp.genename</span> and <span style='color: " + colors.secondaryColor + ";'>cadd.phred</span> fields.",'title2':"GET http://myvariant.info/v1/variant/chr9:g.107620835G>A?fields=dbnsfp.genename,cadd.phred"},
        {'num':'4','caller':'getvariants','params':['chr1:g.866422C>T,chr1:g.876664G>A,chr1:g.69635G>C'],'title1':"Get variants <span style='color: " + colors.secondaryColor + ";'>chr1:g.866422C>T</span>, <span style='color: " + colors.secondaryColor + ";'>chr1:g.876664G>A</span>, <span style='color: " + colors.secondaryColor + ";'>chr1:g.69635G>C</span>",'title2':"POST http://myvariant.info/v1/variant/"},
        {'num':'5','caller':'query','params':['chr1:69000-70000'],'title1':"Get variants for genomic range <span style='color: " + colors.secondaryColor + ";'>chr1:69000-70000</span>",'title2':"GET http://myvariant.info/v1/query?q=chr1:69000-70000"},
        {'num':'6','caller':'query','params':['dbsnp.vartype:snp'],'title1':"Get variants for matching value on a specific field <span style='color: " + colors.secondaryColor + ";'>dbsnp.vartype:snp</span>",'title2':"GET http://myvariant.info/v1/query?q=dbsnp.vartype:snp"},
    ];
    return {
      colors: colors,
      actions: actions,
      qSearch: null,
      searchFields: {},  // {'select0':{ name:'Weekly', value: <input>},'select1':{name:'Never', value:<input>}},
      qSearchMany: null,
      scopeFields: null,   //['a','b'],   // for testing
    };
  },

  _listItemTap(e) {
    this._fetchData(e.currentTarget.getAttribute("data-action"));
  },

  _fetchData(actionN){
    if (actionN === this.props.lastAction) return;

    let self = this;
    self.props._setState({'isLoading':true});

    let action = actionN;
    // check if action is a string call by name or an object argument.
    // if string then do an action lookup, otherwise assume the obj passed is an action obj.
    if (typeof actionN === 'string') action = self.state.actions[actionN];

    let got = action.params === null ? mv[action.caller]() : mv[action.caller](...action.params);
    got.then(
        function(res) {
          let dat = res;
          if (!Array.isArray(res)) dat = [res];
          if (action.caller === 'getfields') dat = utils._flatten(res);
          if (action.caller === 'query') dat = utils._flatten(res.hits);
          dat = dat.map( d => flat(d) );
          self.props._setState({data:dat,'isLoading':false,'lastAction':actionN});
      })
      .catch(
        function(reason) {
          console.log('All manner of chaos ensued.  Data could not be fetched, for this reason: '+reason);
          self.props._setState({data:[],'isLoading':false,'lastAction':actionN});
      });
  },

  _formatRequest(searchType){
    var self = this;
    if (searchType === 'search') {
      let arr = [];
      let q;
      if (this.state.qSearch) {
        q = this.state.qSearch;
      } else {
        Object.keys(this.state.searchFields).map(function(f){
          if (self.state.searchFields[f].value)
            arr.push(self.state.searchFields[f].name+':'+self.state.searchFields[f].value)
        })
        q = arr.join(' AND ');
      }
      return {'caller':'query','params':[q]};  // currently forcing ANDed terms
    }
    if (searchType === 'find') {
      return {'caller':'querymany','params':[this.state.qSearchMany,this.state.scopeFields]};
    }
    return null;
  },

  _handleAddSearchField(){
    let obj = Object.assign(this.state.searchFields);
    obj['select'+Object.keys(this.state.searchFields).length] = null;
    this.setState({'searchFields':obj})
  },

  _handleSelectSearchField(i,e){
    if (!this.state.searchFields['select'+i] || e.target.value !== this.state.searchFields['select'+i].name) {
      let obj = Object.assign(this.state.searchFields);
      obj['select'+i] = Object.assign({},this.state.searchFields['select'+i],{'name': e.target.value});
      this.setState({'searchFields':obj})
    }
  },

  _handleInputChange(i,e){
    if (!this.state.searchFields['select'+i] || e.target.value !== this.state.searchFields['select'+i].value) {
      let obj = Object.assign(this.state.searchFields);
      obj['select'+i] = Object.assign({},this.state.searchFields['select'+i],{'value': e.target.value});
      this.setState({'searchFields':obj});
    }
  },

  _handleAddScopeField(){
    let arr = this.state.scopeFields === null ? [] : this.state.scopeFields.slice();
    arr.push('');
    this.setState({'scopeFields':arr});
  },

  _handleSelectScopeField(i,e){
    let arr = this.state.scopeFields.slice();
    if (arr.includes(e.target.value)) return;
    arr.splice(arr.indexOf(''),1);
    arr.push(e.target.value);
    this.setState({'scopeFields':arr});
  },

  _removeScopeField(i){
    let arr = this.state.scopeFields.slice();
    arr.splice(i, 1);
    this.setState({'scopeFields': arr})
  },

  _removeSearchField(f){
    let obj = Object.assign(this.state.searchFields);
    delete obj[f];
    this.setState({'searchFields': obj})
  },

  _handleSubmit(searchType){
    this._fetchData(this._formatRequest(searchType));
  },

  _handleClear(searchType){
    if (searchType === 'search') {
      this.setState({'searchFields':{}});
    }
  },

  render() {
    let self = this;
    let items = this.state.actions.map((a,i)=>{
      return (
        <ActionItem
          key={"action"+i}
          colors={this.state.colors}
          action={a}
          lastAction={this.props.lastAction}
          onListItemTap={this._listItemTap} />
        );
    });
    items.splice(2,0,<ListDivider key="divider1" />);
    items.splice(5,0,<ListDivider key="divider2" />);

    let selectfields = Object.keys(this.state.searchFields).map(function(f,i){
      let searchVal = (f && self.state.searchFields[f] && Object.keys(self.state.searchFields[f]).includes('name')) ? self.state.searchFields[f].name : null;

      return (
        <span className={'searchInputField '+f}>
          <span style={ searchVal ? {paddingTop: 4} : null}>
            <SelectField
              ref={'searchField'+i}
              className={'searchField '+f}
              style={{'maxHeight': '300px', 'overflowY':'scroll'}}
              floatingLabelText="Field"
              fullWidth={true}
              value={searchVal}
              onChange={self._handleSelectSearchField.bind(null,i)}
              valueMember="fieldname"
              displayMember="fieldname"
              menuItems={self.props.fields} />
          </span>

          <span>
            <TextField
              ref={'searchInputField'+i}
              hintText="Enter Term"
              floatingLabelText="Term"
              fullWidth={true}
              //value={self.state.floatingPropValue}
              onBlur={self._handleInputChange.bind(null,i)} />
          </span>

          <DelIcon className="minus faded-grey" onTouchTap={self._removeSearchField.bind(null,f)}/>

        </span>
      );
    });

    let scopefields = (!this.state.scopeFields || !this.state.scopeFields.length) ? null : this.state.scopeFields.map(function(f,i){
      return (
        <span className={'findInputField '+f}>
          <span style={ f.length ? {paddingTop: 4} : null}>
            <SelectField
              ref={'scopeField'+i}
              className={'scopeField '+f}
              style={{'maxHeight': '300px', 'overflowY':'scroll'}}
              floatingLabelText="Add a Scope Field..."
              fullWidth={true}
              value={f}
              onChange={self._handleSelectScopeField.bind(null,f)}
              valueMember="fieldname"
              displayMember="fieldname"
              menuItems={self.props.fields} />
          </span>

          <DelIcon className="minus faded-grey" onTouchTap={self._removeScopeField.bind(null,i)}/>
        </span>
      );
    });

    return (
      <div className="query left col-xs-12 col-sm-4 col-md-4 col-lg-4">

        <Tabs contentContainerStyle={{'paddingTop':'15px'}} value={this.props.activeTab}>

        {/* -------- Search Tab --------------*/}
          <Tab label="Search Any" className="query-tab" style={{color:this.state.colors.primaryColor}} value="search" onActive={this.props._setTab.bind(null,'search')}>
            <TextField
              hintText="Search"
              floatingLabelText="Enter Search Term"
              fullWidth={true}
              valueLink={this.linkState('qSearch')} />

            <h4>Or narrow search to specific fields...</h4>

            {selectfields}

            <FlatButton className="btnAdd" tooltip="Field to Search" tooltipPosition="bottom-right" touch={true} onTouchTap={this._handleAddSearchField}>
              <AddIcon className="faded-grey" />
              <span className="faded-grey" style={{"verticalAlign":"super", "padding":"0 5px"}}>Field to Search</span>
            </FlatButton>

            <br/>

            <FlatButton ref="btnSubmit" className="btnSubmit" label="Submit" secondary={true} onTouchTap={this._handleSubmit.bind(null,'search')} />

            <FlatButton ref="btnClear" className="btnClear" label="Clear" secondary={true} onTouchTap={this._handleClear.bind(null,'search')} />
          </Tab>

        {/* -------- Find Tab --------------*/}
          <Tab label="Find Many" className="query-tab" style={{color:this.state.colors.primaryColor}} value="find" onActive={this.props._setTab.bind(null,'find')}>
            <TextField
              hintText="Comma Separate Terms"
              floatingLabelText="Enter Terms"
              fullWidth={true}
              valueLink={this.linkState('qSearchMany')} />

            <br/>

            <h4>Limit search to specific fields...</h4>

            {scopefields}

            <FlatButton className="btnAdd" tooltip="Add Field to Limit" tooltipPosition="bottom-right" touch={true} onTouchTap={this._handleAddScopeField}>
              <AddIcon className="faded-grey" />
              <span className="faded-grey" style={{"verticalAlign":"super", "padding":"0 5px"}}>Limit Search to Field</span>
            </FlatButton>

            <br/>

            <FlatButton ref="btnSubmit" className="btnSubmit" label="Submit" secondary={true} onTouchTap={this._handleSubmit.bind(null,'find')} />

            <FlatButton ref="btnClear" className="btnClear" label="Clear" secondary={true} onTouchTap={this._handleClear.bind(null,'search')} />
          </Tab>

        {/* -------- Examples Tab --------------*/}
          <Tab label="Try Examples" className="query-tab" style={{color:this.state.colors.primaryColor}} value="examples" onActive={this.props._setTab.bind(null,'examples')}>
            <List insetSubheader={true} subheader={"Click an Action below"}>
              {items}
            </List>
          </Tab>

        </Tabs>

      </div>
    );
  },

});

module.exports = Query;
