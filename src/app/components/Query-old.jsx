const flat = require('flat');
const React = require('react');
const mui = require('material-ui');
const mv = require('myvariantjs');
const utils = require('../utils');
const mixins = require('baobab-react/mixins');

let Avatar = mui.Avatar;
let List = mui.List;
let ListItem = mui.ListItem;
let ListDivider = mui.ListDivider;
let Card = mui.Card;
let CardHeader = mui.CardHeader;
let CardText = mui.CardText;
let Tabs = mui.Tabs;
let Tab = mui.Tab;
let TextField = mui.TextField;
let SelectField = mui.SelectField;
let FlatButton = mui.FlatButton;
let RaisedButton = mui.RaisedButton;
let IconButton = mui.IconButton;
let SvgIcon = mui.SvgIcon;
let AddIcon = require('../svg-icons/add.jsx');
let DelIcon = require('../svg-icons/del.jsx');
let MoreVertIcon = require('../svg-icons/more-vert.jsx');

let Result = require('./Result.jsx');
import FieldList from './FieldList.jsx';


// ----------------- example LIST ITEM COMPONENT -------------------------------------- //
let ExampleItem = React.createClass({
  render(){
    return (
      <ListItem
        data-example={this.props.example.num}
        primaryText={
          <div className="row">
            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1">
              <span style={{color: (this.props.lastExample===this.props.example.num ? this.props.colors.green : this.props.colors.defaultColor)}} className="mega-octicon super-octicon octicon-chevron-right"></span>
            </div>
            <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11">
              <span className="itemPrimaryTitle" style={{color: this.props.colors.green}} dangerouslySetInnerHTML={utils._htmlify(this.props.example.title1)}></span><br/>
              <span className="itemSecondaryTitle title2">{this.props.example.title2}</span>
            </div>
          </div>
        }
        onTouchTap={this.props.onListItemTap} />
    )
  }
});



// --------------- MAIN QUERY ---------------------------------------- //
let Query = React.createClass({
  mixins: [mixins.branch, React.addons.LinkedStateMixin],
  contextTypes: {
    muiTheme: React.PropTypes.object,
  },
  // Mapping baobab actions
  actions: {
    addField: actions.addField
  },
  // Mapping baobab cursors
  cursors: {
    colors: ['colors'],
  },











  _listItemTap(e) {
    this._fetchData(e.currentTarget.getAttribute("data-example"));
  },

  _fieldItemTap(val) {
    if (this.state.fieldCursor) {
      if (this.state.fieldCursor.source === 'searchFields') {
        if (this.state.fieldCursor.name === 'outputFields') {
          if (this.state.searchFields.output.includes(val)) {
            this._handleRemoveOutputField('searchFields',val);
          } else {
            this._handleAddOutputField('searchFields',val);
          }
        } else {
          this._handleSelectSearchField(this.state.fieldCursor.name, val);
          this._closeFieldList();
        }
      } else if (this.state.fieldCursor.source === 'scopeFields') {
      }
      //else if (this.state.fieldCursor.source === 'Fields') {}
    }
  },

  _fetchData(exampleN){
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
  },

  _formatRequest(searchType){
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
  },

  _handleAddSearchField(){
    // look at all search field names,
    // if any are null then prevent adding new search fields
    let obj = Object.assign(this.state.searchFields);
    let keyz = Object.keys(this.state.searchFields.search);
    let accountedFor = true;
    for (let k of keyz) {
      if (obj.search[k].hasOwnProperty('name') && !obj.search[k].name) accountedFor = false;
    }
    if (accountedFor) {
      obj.search['select'+keyz.length] = null;
      this.setState({'searchFields':obj})
    }
  },

  _handleSelectSearchField(name,val){
    if (!this.state.searchFields[name] || val !== this.state.searchFields[name].name) {
      let obj = Object.assign(this.state.searchFields);
      obj.search[name] = Object.assign({},this.state.searchFields.search[name],{'name': val});
      this.setState({'searchFields':obj}, this._handleAddSearchField)
    }
  },
/*
  _handleInputChange(i,e){
    if (!this.state.searchFields['select'+i] || e.target.value !== this.state.searchFields['select'+i].value) {
      let obj = Object.assign(this.state.searchFields);
      obj['select'+i] = Object.assign({},this.state.searchFields['select'+i],{'value': e.target.value});
      this.setState({'searchFields':obj});
    }
  },
*/
  _handleInputChange(i,e){
    if (!this.state.searchFields['select'+i] || e.target.value !== this.state.searchFields.search['select'+i].value) {
      let obj = Object.assign(this.state.searchFields);
      obj.search['select'+i] = Object.assign({},this.state.searchFields.search['select'+i],{'value': e.target.value});
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
    delete obj.search[f];
    this.setState({'searchFields': obj})
  },

  _handleSubmit(searchType){
    this._fetchData(this._formatRequest(searchType));
  },

  _handleClear(searchType){
    if (searchType === 'search') {
      this.setState({
        qSearch: null,
        searchFields: {
          search: {'select0':{}},
          output: []
        },
      });
    }
    if (searchType === 'find') {
      this.setState({
        qSearchMany: null,
        scopeFields: {
          search: [],
          output: []
        },
      });
    }
  },

  _handleAddOutputField(source,field){
    let newObj = {};
    let obj = Object.assign(this.state[source]);
    obj.output.push(field);
    newObj[source] = obj;
    this.setState(newObj);
  },

  _handleRemoveOutputField(data){
    let newObj = {};
    let obj = Object.assign(this.state[data.source]);
    obj.output.splice(this.state[data.source].output.indexOf(data.field),1);
    newObj[data.source] = obj;
    this.setState(newObj);
  },

  _openFieldList(field){
    this.setState({'showFieldList': true, 'fieldCursor':field});
  },

  _closeFieldList(){
    this.setState({'showFieldList': false, 'fieldCursor':null});
  },

  _setTab(t){
    this.setState({activeTab:t});
  },

  render() {
    let self = this;


    // ---------------- EXAMPLE example ITEMS ----------------------------- //
    let items = this.state.examples.map((a,i)=>{
      return (
        <exampleItem
          key={"example"+i}
          colors={this.state.colors}
          example={a}
          lastExample={this.state.lastExample}
          onListItemTap={this._listItemTap} />
        );
    });
    items.splice(2,0,<ListDivider key="divider1" />);
    items.splice(5,0,<ListDivider key="divider2" />);


    // -------------------- SEARCH FIELDS ------------------------------- //
    let searchInputFields = Object.keys(this.state.searchFields.search).map(function(f,i){
      let searchName = (f && self.state.searchFields.search[f] && Object.keys(self.state.searchFields.search[f]).includes('name')) ? self.state.searchFields.search[f].name : null;
      let searchVal = (f && self.state.searchFields.search[f] && Object.keys(self.state.searchFields.search[f]).includes('value')) ? self.state.searchFields.search[f].value : null;

      return (
        <div className="searchInputFields row">
            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1" style={{'marginTop':'25px', 'padding':'0px'}} >
              <RaisedButton
                ref={'searchField'+i}
                className={'searchField '+f}
                labelStyle={{'padding':'0px'}}
                label={'+ Field'}
                primary={true}
                fullWidth={true}
                onClick={self._openFieldList.bind(null,{name:f,source:'searchFields'})} >
              </RaisedButton>
            </div>

            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-lg-offset-1">
              <TextField
                ref={'searchTermField'+i}
                disabled={true}
                floatingLabelText="Search Field"
                value={searchName}
                fullWidth={true} />
            </div>

            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <TextField
                ref={'searchTermField'+i}
                hintText="Enter Term"
                floatingLabelText="Search Term"
                fullWidth={true}
                value={searchVal}
                onBlur={self._handleInputChange.bind(null,i)} />
            </div>

            <DelIcon
              className="del faded-grey col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-lg-offset-1"
              style={{'marginTop':'40px'}}
              onTouchTap={self._removeSearchField.bind(null,f)} />
        </div>
      );
    });

    // -------------------- SEARCH OUTPUT FIELDS ------------------------------- //
    let searchOutputFields = [];
    searchOutputFields.push(<ListItem key={'outputAll'} className={'searchOutputField outputField'} primaryText={'All Fields'} />);
    if (this.state.searchFields &&
        this.state.searchFields.output &&
        this.state.searchFields.output.length) {
      searchOutputFields = this.state.searchFields.output.map(function(f,i){
        return (
          <ListItem
            key={'output'+i}
            className={'searchOutputField outputField'}
            primaryText={f}
            rightIcon={<DelIcon className="del" onTouchTap={self._handleRemoveOutputField.bind(null,{source:'searchFields',field:f})} />} />
        );
      });
    }


    // -------------------- FIND SCOPE FIELDS ------------------------------- //
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



    let activeFields = [];
    if (this.state.fieldCursor) {
      if (this.state.fieldCursor.source === 'searchFields') {
        if (this.state.fieldCursor.name === 'outputFields') {
          activeFields = this.state.searchFields.output;
        } else if (this.state.searchFields.search[this.state.fieldCursor.name] && this.state.searchFields.search[this.state.fieldCursor.name].name) {
            activeFields.push(this.state.searchFields.search[this.state.fieldCursor.name].name);
        }
      }

      if (this.state.fieldCursor.source === 'scopeFields') {
        if (this.state.fieldCursor.name === 'outputFields') {
          activeFields = this.state.scopeFields.output;
        } else {
          activeFields = this.state[this.state.fieldCursor.source].search;
        }
      }
    }


    // -------------------- RENDER --------------------------------------- //
    return (
      <div className="query col-xs-12 col-sm-12 col-md-12 col-lg-12">

        <Tabs contentContainerStyle={{'paddingTop':'15px'}} value={this.state.activeTab.split('.')[0]||'search'}>

          {/* -------- Spacer Tab --------------*/}
          <Tab value="x"></Tab>

          {/* -------- Search Tab --------------*/}
          <Tab label="Search" className="query-tab col-xs-2 col-sm-2 col-md-2 col-lg-2" style={{color:this.state.colors.green}} value="search" onActive={this._setTab.bind(null,'search')}>

            <Card style={{'padding':'20px 35px'}}>
              <CardText>
                <Tabs contentContainerStyle={{'paddingTop':'15px'}} value={this.state.activeTab.split('.')[1]||'input'}>

                  {/* -------- Input Tab --------------*/}
                  <Tab label="Input" className="query-tab" style={{color:this.state.colors.green}} value="input" onActive={this._setTab.bind(null,'search.input')}>

                    <div className='fSearch'>
                      <h3>Field Search</h3>
                      {searchInputFields}
                    </div>

                    <CardText>
                        <FlatButton ref="btnSubmit" className="btnSubmit" label="Submit" secondary={true} onTouchTap={this._handleSubmit.bind(null,'search')} />
                        <FlatButton ref="btnClear" className="btnClear" label="Clear Search Inputs" secondary={true} onTouchTap={this._handleClear.bind(null,'search')} />
                    </CardText>

                    <br />

                    <div className='qSearch'>
                      <h3>Simple Search</h3>

                      <TextField
                        hintText="Search"
                        floatingLabelText="Enter the full fielded query string or simple search term here"
                        fullWidth={true}
                        valueLink={this.linkState('qSearch')} />
                    </div>

                    <CardText>
                        <FlatButton ref="btnSubmit" className="btnSubmit" label="Submit" secondary={true} onTouchTap={this._handleSubmit.bind(null,'search')} />
                        <FlatButton ref="btnClear" className="btnClear" label="Clear Search Inputs" secondary={true} onTouchTap={this._handleClear.bind(null,'search')} />
                    </CardText>

                    <br />

                    <div className="search-notes">
                     <h3>Notes</h3>
                      <p>If running a general search without field names, it will be limited to rsid and hgvs names.</p>
                      <p>Wildcard character “*” or ”?” is supported in either simple queries or fielded queries:</p>
                      <pre>
                        <p>dbnsfp.genename:CDK?</p>
                        <p>dbnsfp.genename:CDK*</p>
                      </pre>
                      <p>Wildcard character can not be the first character. It will be ignored.</p>
                    </div>

                  </Tab>



                  {/* -------- Output Tab --------------*/}
                  <Tab label="Output" className="query-tab" style={{color:this.state.colors.green}} value="output" onActive={this._setTab.bind(null,'search.output')}>
                    <div style={{marginTop: '20px', marginLeft: '47.5%'}}>
                      <RaisedButton
                        labelStyle={{'padding':'0px'}}
                        label={'+ Field'}
                        primary={true}
                        onClick={this._openFieldList.bind(null,{name:'outputFields',source:'searchFields'})} >
                      </RaisedButton>
                    </div>
                    <Card style={{margin:'1% 20%'}}>
                      <CardText>
                        <List>
                          {searchOutputFields}
                        </List>
                      </CardText>
                    </Card>
                  </Tab>


                  {/* -------- Results Tab --------------*/}
                  <Tab label="Results" className="query-tab" style={{color:this.state.colors.green}} value="results" onActive={this._setTab.bind(null,'search.results')}>

                    <Result
                      isLoading={this.state.isLoading}
                      data={this.state.data}
                      examples={this.props.examples}
                      lastExample={this.state.lastExample} />

                  </Tab>

                 </Tabs>
               </CardText>

            </Card>

           </Tab>


        {/* -------- Find Tab --------------*/}
          <Tab label="Find" className="query-tab col-xs-2 col-sm-2 col-md-2 col-lg-2" style={{color:this.state.colors.green}} value="find" onActive={this._setTab.bind(null,'find')}>
            <h3>Find Many Variants in Batch</h3>

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

            <FlatButton ref="btnClear" className="btnClear" label="Clear" secondary={true} onTouchTap={this._handleClear.bind(null,'find')} />
          </Tab>

        {/* -------- Examples Tab --------------*/}
          <Tab label="Try" className="query-tab col-xs-2 col-sm-2 col-md-2 col-lg-2" style={{color:this.state.colors.green}} value="examples" onActive={this._setTab.bind(null,'examples')}>
            <h3>Try Some Examples</h3>
            <List insetSubheader={true} subheader={"Click an Example below"}>
              {items}
            </List>
          </Tab>

          {/* -------- Spacer Tab --------------*/}
          <Tab value="x"></Tab>

        </Tabs>

        { this.state.showFieldList && <FieldList showFieldList={this.state.showFieldList} closeFieldList={this._closeFieldList} fields={this.props.fields} fieldItemTap={this._fieldItemTap} activeFields={activeFields} /> }

      </div>
    );
  },

});

module.exports = Query;
