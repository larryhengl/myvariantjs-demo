require("babelify/polyfill");

const flat = require('flat');
const React = require('react/addons');
const mui = require('material-ui');
const mv = require('myvariantjs');
const utils = require('../utils');

let Avatar = mui.Avatar;
let Dialog = mui.Dialog;
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


// ----------------- ACTION LIST ITEM COMPONENT -------------------------------------- //
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



// ----------------- FIELDS LIST COMPONENT -------------------------------------- //
let Fields = React.createClass({
  render(){
    let fields = this.props.fields.map((f,i) => {
        let isSelected = false;
        return (
          <div key={"field"+i} className={"row"+(isSelected ? " selected" : "")} onClick={this.props._fieldItemTap.bind(null,f.fieldname)} >
            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-lg-offset-1">
              <span>{f.fieldname}</span>
            </div>
            <div className="col-xs-7 col-sm-7 col-md-7 col-lg-7">
              { f.notes ? <span dangerouslySetInnerHTML={{__html: "<span>"+f.notes+"</span>"}}></span> : <span></span>}
            </div>
          </div>
        );
    });
    return (
      <div>
        {fields}
      </div>
    );
  }
});


// --------------- MAIN QUERY ---------------------------------------- //
let Query = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  contextTypes: {
    muiTheme: React.PropTypes.object,
  },
  getInitialState(){
    return {
      colors: this.props.colors,
      actions: this.props.actions,
      qSearch: null,
      searchFields: {
        search: {'select0':{}},  // {'select0':{ name:'Weekly', value: <input>},'select1':{name:'Never', value:<input>}},
        output: []
      },
      qSearchMany: null,
      scopeFields: {
        search: [],   // array of field names
        output: []
      },
      fieldCursor: null,  // gonna be {source:'searchFields',name: 'select<X>'} or {source: 'scopeFields'}
    };
  },

  _listItemTap(e) {
    this._fetchData(e.currentTarget.getAttribute("data-action"));
  },

  _fieldItemTap(val) {
    if (this.state.fieldCursor) {
      if (this.state.fieldCursor.source === 'searchFields') {
        this._handleSelectSearchField(this.state.fieldCursor.name, val)
      } else if (this.state.fieldCursor.source === 'scopeFields') {
      }
      //else if (this.state.fieldCursor.source === 'Fields') {}
    }
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
        Object.keys(this.state.searchFields.search).map(function(f){
          if (self.state.searchFields.search[f].value)
            arr.push(self.state.searchFields.search[f].name+':'+self.state.searchFields.search[f].value)
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

  _handleSelectSearchField(name,val){
    if (!this.state.searchFields[name] || val !== this.state.searchFields[name].name) {
      let obj = Object.assign(this.state.searchFields);
      obj.search[name] = Object.assign({},this.state.searchFields.search[name],{'name': val});
      this.setState({'searchFields':obj})
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
      this.setState({'qSearch': null, 'searchFields':{}});
    }
    if (searchType === 'find') {
      this.setState({'qSearchMany':null, 'scopeFields':null});
    }
  },

  _clearFieldCursor(){
    this.setState({'fieldCursor':null});
  },

  _openFieldsDialog(field){
    this.setState({'fieldCursor':field});
    this.refs.fieldsDialog.show();
  },

  render() {
    let self = this;


    // ---------------- EXAMPLE ACTION ITEMS ----------------------------- //
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


    // -------------------- SEARCH FIELDS ------------------------------- //
    let selectfields = Object.keys(this.state.searchFields.search).map(function(f,i){
      let searchName = (f && self.state.searchFields.search[f] && Object.keys(self.state.searchFields.search[f]).includes('name')) ? self.state.searchFields.search[f].name : null;
      let searchVal = (f && self.state.searchFields.search[f] && Object.keys(self.state.searchFields.search[f]).includes('value')) ? self.state.searchFields.search[f].value : null;

      return (
        <Card className={'searchInputField'}>
          <CardHeader
              title={searchName||"Field"}
              subtitle={searchVal}
              avatar={<Avatar>F</Avatar>}>

            <DelIcon className="minus faded-grey" onTouchTap={self._removeSearchField.bind(null,f)}/>
           </CardHeader>


          <CardText>

            <span>
              <RaisedButton
                ref={'searchField'+i}
                className={'searchField '+f}
                label={searchName||'Select a Field'}
                primary={true}
                fullWidth={true}
                onClick={self._openFieldsDialog.bind(null,{name:f,source:'searchFields'})} >
                <MoreVertIcon className="selectFieldButton"/>
              </RaisedButton>
            </span>

            <span>
              <TextField
                ref={'searchTermField'+i}
                hintText="Enter Term"
                floatingLabelText="Search Term"
                fullWidth={true}
                value={searchVal}
                onBlur={self._handleInputChange.bind(null,i)} />
            </span>
          </CardText>
        </Card>
      );
    });


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



    // -------------------- RENDER --------------------------------------- //
    return (
      <div className="query left col-xs-12 col-sm-4 col-md-4 col-lg-4">
        <h2>Search</h2>

        <Tabs contentContainerStyle={{'paddingTop':'15px'}} value={this.props.activeTab}>


        {/* -------- Search Tab --------------*/}
          <Tab label="Search" className="query-tab" style={{color:this.state.colors.primaryColor}} value="search" onActive={this.props._setTab.bind(null,'search')}>
            <h3>Search in Any Field</h3>

            <TextField
              hintText="Search"
              floatingLabelText="Enter Search Term Here"
              fullWidth={true}
              valueLink={this.linkState('qSearch')} />

           <br />
           <p style={{fontStyle:'italic',fontSize:'x-small'}}><b>note:</b> general search service currently supports <b>only</b> <span style={{color:'red'}}>rsid</span> and <span style={{color:'red'}}>hgvs names</span></p>
           <br />

            <hr />

            <h4>Or search in specific fields...</h4>

            {selectfields}

            <FlatButton className="btnAdd" tooltip="Field to Search" tooltipPosition="bottom-right" touch={true} onTouchTap={this._handleAddSearchField}>
              <AddIcon className="faded-grey" />
              <span className="faded-grey" style={{"verticalAlign":"super", "padding":"0 5px"}}>Add Another Field</span>
            </FlatButton>

            <br/>

            <FlatButton ref="btnSubmit" className="btnSubmit" label="Submit" secondary={true} onTouchTap={this._handleSubmit.bind(null,'search')} />

            <FlatButton ref="btnClear" className="btnClear" label="Clear" secondary={true} onTouchTap={this._handleClear.bind(null,'search')} />
          </Tab>



        {/* -------- Find Tab --------------*/}
          <Tab label="Find" className="query-tab" style={{color:this.state.colors.primaryColor}} value="find" onActive={this.props._setTab.bind(null,'find')}>
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
          <Tab label="Try" className="query-tab" style={{color:this.state.colors.primaryColor}} value="examples" onActive={this.props._setTab.bind(null,'examples')}>
            <h3>Try Some Examples</h3>
            <List insetSubheader={true} subheader={"Click an Action below"}>
              {items}
            </List>
          </Tab>

        </Tabs>

        <Dialog
          ref="fieldsDialog"
          title={"Select a Field"}
          actions={[{ text: 'Done' }]}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
          onDismiss={this._clearFieldCursor}
          modal={true}>
          <div style={{height: '1000px'}}>
            <Fields fields={this.props.fields} _fieldItemTap={this._fieldItemTap} />
          </div>
        </Dialog>

      </div>
    );
  },

});

module.exports = Query;
