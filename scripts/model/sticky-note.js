/**
 * @fileoverview define a sticky-note class
 */

'use strict';

define(['./identifier'], function (Identifier) {
  /**
   * Representa um Post-it, lembrete que é anexado ao canvas
   *
   * @constructor
   * @param {string} note - Texto do post-it
   * @param {int} color - Cor do post-it
   * @param {User} author - Autor do Post-it
   * @param {CanvasElement} block - Elemento de Canvas no qual foi anexado
   */
  return function StickyNote(note, color, author, block) {
    this.note = note || '';
    this.color = color || 'FFE079';
    this.createdAt = new Date();
    this.lastModified = new Date();
    this.author = author || null;
    this.id = Identifier.generateNext();
    this.block = block || null;

  }

});
