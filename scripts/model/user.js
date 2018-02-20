/**
 * @fileoverview Represents a User class
 */

'use strict';

define(function () {

  /**
   * Represents a user
   *
   * @constructor
   * @param {string} name
   * @param {string} email
   */
  return function User(name, email) {
    this.name = name;
    this.email = email || '';
  }

});
