/**
 * @fileoverview load a html file and its related stylesheets and returns
 * through sage applicationRPC method
 *
 */

'use strict';

var fs = require('fs');
var path = require('path');

/**
 * @const {string}
 * @package
 */
const ENCODING = 'utf8';

/**
 * @const {string}
 * @package
 */
const HTML_PATH = path.join(path.dirname(__filename), 'view', 'html');

/**
 * @const {string}
 * @package
 */
const CSS_PATH =
    path.join(path.dirname(__filename), 'view', 'stylesheets', 'css');

/**
  * this module uses sage framework and node.js to receive a html file you wish
  * to load into the application, using its architecture via applicationRPC call.
  * HTML and Stylesheets being loaded can be found respectively in view/html and
  * view/stylesheet/css. Thus processRequest makes use of node.js to load theses
  * files and send via broadcast.
  *
  * @module plugin
  * @param {object} wsio
  * @param {object} data
  * @param {string} data.query.view - html file name
  * @param {string} data.query.style - style file name
  * @param {string} data.query.data - aditional data to share between call
  * @param {object} config
  */
function processRequest(wsio, data, config) {

  // file names
  var view = data.query.view || 'index';
  var style = data.query.style || '';

  // attached data shared between applicationRPC call
  var args = data.query.data || {};

  // data sent via broadcast, defined by sage framework processRequest method
  var broadcastData = {
    app: data.app,
    func: data.func,
    data: {
      content: '',
      style: '',
      data: args
    }
  };

  // absolute path for html and stylesheets
  view = path.join(HTML_PATH, view) + '.html';
  style = path.join(CSS_PATH, style) + '.css';

  // read html file and stylesheet by node modules
  fs.readFile(view, ENCODING, function (err, content) {
    if (!err) {
      broadcastData.data.content = content;

      try {
        broadcastData.data.style = fs.readFileSync(style, ENCODING);
      } catch (err) {
        broadcastData.data.style = '';
      }
    }

    // broadcast message via sage method
    if (data.broadcast == true) {
      module.parent.exports.broadcast('broadcast', broadcastData);
    } else {
      wsio.emit('broadcast', broadcastData);
    }

  });

}

module.exports = processRequest;
