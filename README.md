# MyVariantjs Demo


### Demo web app that uses the [myvariantjs](https://github.com/larryhengl/myvariantjs) lib

##### <span style='color:red'>This is an experiment that tests the myvariantjs lib and incorparates some of the latest JS technologies: React, React Material UI, Gulp, Browserify, Babel (ES6)</span>

## Requirements

This app requires that you have [node.js](https://nodejs.org) installed.

## Installation & Start

```
git clone git@github.com:larryhengl/myvariantjs-demo.git
cd myvariantjs-demo
npm install
npm start
```

## Usage

open browser to [http://localhost:3000/](http://localhost:3000/)

#### What are you looking at?

This web app uses the myvariantjs lib to talk to the MyVariant.info services.  You can issue `search` queries, `filters` or `example` calls.

*search* - feelin' lucky?  You can also scope the search query to specified fields.

*filters* - look for specific fields values.

*examples* - pre-configured set of actions to demonstrate some of the lib API. Click on an action, view the results.  If you see data then the lib is working.

The results box shows a sampling of the actual results.

You can toggle data formats and download a csv file of the entire resultset.

Perhaps, a more elaborate MyVariant viewer is coming!


## Developing the demo

The `npm start` script launches a web server and watcher, with browsersync for auto page reloads.

See package.json for all the npm run scripts


## Ingredients

This app uses Reactjs & styled with Material Design.

It is built with gulp & babel.

## Todo
 * add the follow params support:
   - _exists_
   - _missing_
   - AND, OR, NOT
   - facets
   - sort
   - fetch_all
   - scroll_id

+ improve the querymany interface
+ add paging?
+ enable vcf parsing?
