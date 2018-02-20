/**
 * @fileoverview defines a identifier module which generate random numbers
 */

'use strict';

define(function () {
  /** @private  identifier number which will be incremented each call */
  var _base = 0;

  /** @private  identifier prefix */
  var _prefix = 'id_';

  return {

    /**
     * Defines new prefix
     *
     * @param {string} prefix
     * @return {this}
     */
    setPrefix: function (prefix) {
      _prefix = prefix;
      return this;
    },

    /**
     * Gera um novo identificador a cada chamada
     *
     * @return {string}
     */
    generateNext: function () {
      return _prefix + _base++;
    }
  };
});
