/**
 * @fileoverview defines a identifier module which generate random numbers each
 * call
 */

'use strict';

/**
 * @module model
 */
define(function () {
  /** @private {int} identifier number which will be incremented each call */
  var _base = 0;

  /** @private {string} identifier prefix */
  var _prefix = 'id_';

  /**
   * A module representing a unique identifier which have a unique identifier
   * and a prefix which can be changed by calling
   * {@link module:model/identifier.setPrefix}
   *
   * @exports model/identifier
   */
  var identifier = {

    /**
     * defines new prefix for all generated next identifiers
     *
     * @param {string} prefix
     * @return {module:model/identifier}
     */
    setPrefix: function (prefix) {
      _prefix = prefix;
      return this;
    },

    /**
     * generates a new identifier each call. Each call a internal numeric value
     * will be incremented thus provinding a unique number
     *
     * @return {string}
     */
    generateNext: function () {
      return _prefix + _base++;
    }
  };

  return identifier;
});
