require("babelify/polyfill");

const flat = require('flat');
const React = require('react');
const mui = require('material-ui');
const mv = require('myvariantjs');

const deepCopy = ( ob ) => JSON.parse(JSON.stringify( ob ));

let FlatButton = mui.FlatButton;
let List = mui.List;
let ListItem = mui.ListItem;
let ListDivider = mui.ListDivider;
let Tabs = mui.Tabs;
let Tab = mui.Tab;

let htmlify = (str) => { return {__html: str}; };

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
              <span className="itemPrimaryTitle" style={{color: this.props.colors.primaryColor}} dangerouslySetInnerHTML={htmlify(this.props.action.title1)}></span><br/>
              <span className="itemSecondaryTitle title2">{this.props.action.title2}</span>
            </div>
          </div>
        }
        onTouchTap={this.props.onListItemTap} />
    )
  }
});

let Query = React.createClass({
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
        {'num':'1','caller':'getfields','params':null,'title1':'Get all fields','title2':"GET http://myvariant.info/v1/fields"},
        {'num':'2','caller':'getfields','params':['gene'],'title1':"Get field names containing <span style='color: " + colors.secondaryColor + ";'>gene</span>",'title2':"GET http://myvariant.info/v1/fields, filters for 'gene'"},
        {'num':'3','caller':'getvariant','params':['chr9:g.107620835G>A'],'title1':"Get variant <span style='color: " + colors.secondaryColor + ";'>chr9:g.107620835G>A</span>",'title2':"GET http://myvariant.info/v1/variant/chr9:g.107620835G>A"},
        {'num':'4','caller':'getvariant','params':['chr9:g.107620835G>A', ["dbnsfp.genename", "cadd.phred"]],'title1':"Get variant <span style='color: " + colors.secondaryColor + ";'>chr9:g.107620835G>A</span>, only show <span style='color: " + colors.secondaryColor + ";'>dbnsfp.genename</span> and <span style='color: " + colors.secondaryColor + ";'>cadd.phred</span> fields.",'title2':"GET http://myvariant.info/v1/variant/chr9:g.107620835G>A?fields=dbnsfp.genename,cadd.phred"},
        {'num':'5','caller':'getvariants','params':['chr1:g.866422C>T,chr1:g.876664G>A,chr1:g.69635G>C'],'title1':"Get variants <span style='color: " + colors.secondaryColor + ";'>chr1:g.866422C>T</span>, <span style='color: " + colors.secondaryColor + ";'>chr1:g.876664G>A</span>, <span style='color: " + colors.secondaryColor + ";'>chr1:g.69635G>C</span>",'title2':"POST http://myvariant.info/v1/variant/"},
    ];
    return {
      colors: colors,
      actions: actions,
    };
  },

  _listItemTap(e) {
    this._fetchData(e.currentTarget.getAttribute("data-action"));
  },

  _flatten(data){
    return Object.keys(data).map(k => {
      return Object.assign({'fieldname': k}, data[k]);
    });
  },

  _fetchData(actionN){

    if (actionN === this.props.lastAction) return;

    let self = this;
    self.props._setState({'isLoading':true});

    let action = self.state.actions[actionN];
    let got = action.params === null ? mv[action.caller]() : mv[action.caller](...action.params);
    got.then(
        function(res) {
          let dat = res;
          if (!Array.isArray(res)) dat = [res];
          if (action.caller === 'getfields') dat = self._flatten(res);
          dat = dat.map( d => flat(d) );
          self.props._setState({data:dat,'isLoading':false,'lastAction':actionN});
      })
      .catch(
        function(reason) {
          console.log('All manner of chaos ensued.  Data could not be fetched, for this reason: '+reason);
          self.props._setState({data:[],'isLoading':false,'lastAction':actionN});
      });
  },


  render() {
    let items = this.state.actions.map((a,i)=>{
      return <ActionItem key={"action"+i} colors={this.state.colors} action={a} lastAction={this.props.lastAction} onListItemTap={this._listItemTap} />
    });
    items.splice(2,0,<ListDivider key="divider1" />);
    items.splice(5,0,<ListDivider key="divider2" />);

    return (
      <div className="query left col-xs-12 col-sm-4 col-md-4 col-lg-4">

        <Tabs>
          <Tab label="Search" className="query-tab" style={{color:this.state.colors.primaryColor}}>

          </Tab>

          <Tab label="Find" className="query-tab" style={{color:this.state.colors.primaryColor}}>
          </Tab>

          <Tab label="Examples" className="query-tab" style={{color:this.state.colors.primaryColor}}>
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
