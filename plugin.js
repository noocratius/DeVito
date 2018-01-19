/**
 * @fileoverview load a html file with its related script and stylesheets
 *
 */

'use strict';

var fs = require('fs');
var path = require('path');

/** @const string */
const ENCODING = 'utf8';

/** @const string */
const HTML_PATH = path.join(path.dirname(__filename), 'view', 'html');

/** @const string */
const JS_PATH = path.join(path.dirname(__filename), 'view', 'js');

/** @const string */
const CSS_PATH =
    path.join(path.dirname(__filename), 'view', 'stylesheets', 'css');

/**
  * O módulo faz uso do framework SAGE2 e node.js para receber a view que deseja
  * carregar fazendo uso da estrutura da aplicação para carregar os scripts,
  * html e stylesheets necessárias, que podem ser encontradas respectivamente
  * em view/js, view/html e view/stylesheets/css. Assim o módulo faz uso do
  * node.js para carregar os arquivos e envia-los via broadcast
  *
  * @module plugin
  * @param {object} wsio
  * @param {object} data
  * @param {string} data.query.view
  * @param {string} data.query.script
  * @param {string} data.query.style
  * @param {string} data.query.data
  * @param {object} config
  * @return {undefined}
  */
function processRequest(wsio, data, config) {

  // nome dos arquivos a serem carregados
  var view = data.query.view || 'index';
  var script = data.query.script || '';
  var style = data.query.style || '';

  // dados anexado do procedimento a ser chamado
  var args = data.query.data || {};

  // dados enviados via broadcast, definido pelo framework SAGE2
  var broadcastData = {
    app: data.app,
    func: data.func,
    data: {
      content: '',
      script:  '',
      style: '',
      data: args
    }
  };

  // caminho absoluto dos arquivos
  view = path.join(HTML_PATH, view) + '.html';
  style = path.join(CSS_PATH, style) + '.css';
  script = path.join(JS_PATH, script) + '.js';

  fs.readFile(view, ENCODING, function (err, content) {
    if (!err) {
      broadcastData.data.content = content;

      try {
        broadcastData.data.style = fs.readFileSync(style, ENCODING);
      } catch (err) {
        broadcastData.data.style = '';
      }

      try {
        broadcastData.data.script = fs.readFileSync(script, ENCODING);
      } catch (err) {
        broadcastData.data.script = '';
      }
    }

    // envia a mensagem via broadcast pelo SAGE2
    if (data.broadcast == true) {
      module.parent.exports.broadcast('broadcast', broadcastData);
    } else {
      wsio.emit('broadcast', broadcastData);
    }

  });

}

module.exports = processRequest;
