/**
 * @fileoverview define a single canvas block class
 */

'use strict';

define(function () {
  /**
   * Representa um dos 9 elementos de bloco do canvas
   *
   * @constructor
   * @param {int} id - Identificador do bloco
   * @param {string} name - Nome do elemento do bloco
   */
  function CanvasElement(id, name) {
    this.id = id;
    this.name = name;
    this.postIts = new Array();
  }

  /**
   * Anexa um post-it ao elemento de canvas, no final do bloco
   *
   * @param {StickyNote} note - Post-it a ser anexado
   */
  CanvasElement.prototype.attachPostIt = function(note) {
    this.postIts.push(note);
    note.block = this;
  };

  /**
   * Retorna um post-it de acordo com o seu identificador ou null caso não exista
   *
   * @param {int} id - Identificador do post-it
   * @return {StickyNote | null}
   */
  CanvasElement.prototype.getPostIt = function (id) {
    for (var postIt of this.postIts) {
      if (postIt.id == id) return postIt;
    }

    return null;
  }

  /**
   * Remove um post-it pelo seu identificador
   *
   * @param {int} id - Identiicador do Post-it
   */
  CanvasElement.prototype.deletePostIt = function (id) {

    // lê a posição do post-it
    for (var i = 0; i < this.postIts.length; i++) {
      if (this.postIts[i].id == id) {
        this.postIts.splice(i, 1);
      }
    }
  }

  return CanvasElement;
});
