/**
 * @fileoverview define a sticky-note class
 */

'use strict';

/**
 * @module model
 */
define(['./identifier'], function (Identifier) {

  /**
   * Represents a sticky-note which can be attached to canvas
   *
   * @class
   * @alias module:model/sticky-note
   * @param {string} note - sticky-note' text
   * @param {int} color - sticky-note color
   * @param {module:model/user} author - sticky-note author
   * @param {module:model/canvas-element} block - canvas block which will be
   *    attached
   */
  function StickyNote(note, color, author, block) {
    this.note = note || '';
    this.color = color || 'FFE079';
    this.createdAt = new Date();
    this.lastModified = new Date();
    this.author = author || null;
    this.id = Identifier.generateNext();
    this.block = block || null;

  }

  return StickyNote;

});
