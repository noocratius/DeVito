/**
 * @fileoverview Represents a canvas
 */

'use strict';

define(['./canvas-element'], function (CanvasElement) {

  /**
   * Represents a business model canvas
   *
   * @constructor
   * @param {string} title - Canvas title
   * @param {string} description - canvas description
   */
  function Canvas(title, description) {
    this.title = title || '';
    this.description = description || '';
    this.createdAt = new Date();
    this.lastModified = new Date();

    // inicializa os blocos do canvas
    this.canvasElements = new Array(9);

    // cria os elementos do canvas
    this.canvasElements[0] = new CanvasElement(1, 'parcerias chave');
    this.canvasElements[1] = new CanvasElement(2, 'atividades chave');
    this.canvasElements[2] = new CanvasElement(3, 'recursos chave');
    this.canvasElements[3] = new CanvasElement(4, 'proposta de Valor');
    this.canvasElements[4] = new CanvasElement(5, 'relação com o cliente');
    this.canvasElements[5] = new CanvasElement(6, 'canais');
    this.canvasElements[6] = new CanvasElement(7, 'segmentos de mercado');
    this.canvasElements[7] = new CanvasElement(8, 'estruturas de custos');
    this.canvasElements[8] = new CanvasElement(9, 'fontes de renda');
  }

  /**
   * Anexa um post-it a um bloco do canvas, identificado por um id
   *
   * @param {int} blockIdentifier - Identificador do bloco que será anexado
   * @param {StickyNote} postIt - Post-It que será anexado
   *
   */
  Canvas.prototype.attachStickyNote = function (blockIdentifier, note) {
    if (blockIdentifier > 0 && blockIdentifier <= this.canvasElements.length) {
      this.canvasElements[blockIdentifier - 1].attachPostIt(note);
    }
  };

  /**
   * Retorna um post-it de acordo com o seu identificador
   *
   * @param {int} postIt - Identificador do post-it a ser procurado
   * @return {StickyNote}
   */
  Canvas.prototype.getPostIt = function (id) {
    var postIt = null;
    for (var block of this.canvasElements) {

      if ((postIt = block.getPostIt(id)) != null)
        return postIt;
    }

    return postIt;
  }

  /**
   * Remove um post-it pelo seu identificador
   *
   * @param {StickyNote} postit - Identificador do post-it
   */
  Canvas.prototype.deletePostIt = function (postit) {
    this.canvasElements[postit.block.id - 1].deletePostIt(postit.id);
  }

  return Canvas;
})