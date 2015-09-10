# MyVariantjs Demo


### Demo web app that uses the [myvariantjs](https://github.com/larryhengl/myvariantjs) lib

##### <span style='color:red'>This is entirely an experiment that tests the myvariantjs lib and incorparates some of the latest JS technologies: React, React Material UI, Gulp, Browserify, Babel (ES6)</span>

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

#### What are you looking?

This web app using the myvariantjs lib to talk to the MyVariant.info services.  There are a pre-configured set of actions to demonstrate some of the lib API.

Click on an action, view the results.  If you see data then the lib is working.

You can toggle data formats and download a csv file of the results.

A more elaborate MyVariant viewer is coming!


## Developing the demo

The `npm start` script launches a web server and watcher, with browsersync for auto page reloads.

See package.json for all the npm run scripts


## Ingredients

This app uses Reactjs & styled with Material Design.

It is built with gulp & babel.

## Todo
+ add more queries
