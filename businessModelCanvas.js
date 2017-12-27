//
//
//
//
//
//

var businessModelCanvas = SAGE2_App.extend({

  init: function (data) {
    console.log("método 'init' chamado");
  },

  load: function (date) {
    console.log("método 'load' chamado");
  },

  draw: function (date) {
    console.log("método 'draw' chamado");
  },

  startResize: function (date) {
    console.log("método 'startResize' chamado");
  },

  startMove: function (date) {
    console.log("método 'startMove' chamado");
  },

  event: function (type, position, user, data, date) {
    console.log("método 'event' chamado");
  },

  quit: function () {
    console.log("método 'quit' chamado");
  }

});
