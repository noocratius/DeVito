/**
 * Módulo carrega um arquivo html, view, junto com um script e folha de estilos.
 *
 * O módulo faz uso do framework SAGE2 e node.js para receber a view que deseja
 * carregar fazendo uso da estrutura da aplicação para carregar os scripts, html
 * e stylesheets necessárias, que podem ser encontradas respectivamente em
 * view/js, view/html e view/stylesheets/css. Assim o módulo faz uso do node.js
 * para carregar os arquivos e envia-los via broadcast
 *
 */

"use strict";

// módulo de gerenciamento de arquivo
var fs = require('fs');
// módulo path de caminho do node
var path = require('path');

// caminho para a arquitetura dos tipos de arquivos necessário
const HTML_PATH    = path.join(path.dirname(__filename), 'view', 'html');
const JS_PATH      = path.join(path.dirname(__filename), 'view', 'js');
const CSS_PATH     = path.join(path.dirname(__filename), 'view',
                                                          'stylesheets', 'css');

function processRequest(wsio, data, config) {

  // nome dos arquivos a serem carregados
  var view = data.query.view || 'index';
  var script = data.query.script || '';
  var style = data.query.style || '';

  // dados enviados via broadcast, definido pelo framework SAGE2
  var broadcastData = {
    app: data.app,
    func: data.func,
    data: {
      content: '',
      script:  '',
      style: ''
    }
  };


  // caminho absoluto dos arquivos
  view = path.join(HTML_PATH, view) + '.html';
  style = path.join(CSS_PATH, style) + '.css';
  script = path.join(JS_PATH, script) + '.js';

  fs.readFile(view, 'utf8', function (err, content) {
    if (!err) {
      broadcastData.data.content = content;
    }

    broadcastData.data.style = fs.readFileSync(style, 'utf8');
    broadcastData.data.script = fs.readFileSync(script, 'utf8');

    // envia a mensagem via broadcast pelo SAGE2
    if (data.broadcast == true) {
      module.parent.exports.broadcast('broadcast', broadcastData);
    } else {
      wsio.emit('broadcast', broadcastData);
    }

  });

}

module.exports = processRequest;
