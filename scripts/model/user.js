/**
 * @fileoverview Represents a sage application user
 */

'use strict';

/**
 * @module model
 */
define(function () {

  /**
   * Represents a user
   *
   * @class
   * @alias module:model/user
   *
   * @param {string} name
   * @param {string} email
   */
  function User(name, email) {
    this.name = name;
    this.email = email || '';
  }

  return User;

});
