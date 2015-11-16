# MyVariantjs Demo


### Demo web app that uses the [myvariantjs](https://github.com/larryhengl/myvariantjs) lib

##### <span style='color:red'>This is an experiment that tests the myvariantjs lib.  Feel free to use it as a basic search page.  Note that the search fetch size is frozen at 10 records, and only has a preview that shows the first 7 results.  Simply remove the Output.jsx `disable` prop in the Select field for size.  Also note that even though the preview is capped at 7 rows, you can export the full results.  A future version will have a live data table showing the full results.</span>

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

This web app uses the myvariantjs lib to talk to the MyVariant.info services.  You can issue `search` queries, `filters` or `example` calls.  Hit the `info` button in the top right for full details, but in a nutshell you can run searches in several ways:

*exact* - for when you are searching on a specific variant id.
*search* - for doing fielded searches.
*batch* - for doing multi-term searches on scoped fields.
*pass-thru* - for submitting a full search URL.
*examples* - for running predefined searches.

The results box shows a sampling of the actual results.

You can toggle data formats in the preview and download a file of the full search results.


## Developing the demo

The `npm start` script launches a web server and watcher, with browsersync for auto page reloads.

See package.json for all the npm run scripts


## Ingredients

This app uses Reactjs, styled with Material UI.

It is built with gulp & babel.

## Todo
 * add the follow parameter support:
   - \_exists\_
   - \_missing\_
   - AND, OR, NOT
   - facets
   - sort
   - fetch_all
   - scroll_id

+ add paging?
+ enable vcf parsing?
