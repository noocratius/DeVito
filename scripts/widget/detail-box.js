/**
 * @fileoverview defines a colleague for sticky note attachment mediator
 */

'use strict';

/**
 * @module widget
 */
define(['jquery', './widget'], function($, Widget){

  /**
   * Represents a box (textarea) of widget details object
   * @constructor
   * @extends Widget
   * @param {object} spec - specs to build the object uses in the inheritance
   * @param {object} my - shared secrets between inheritance
   * @return {DetailBox}
   */
  return function DetailBox(spec, my) {
    var dateTimeFormat;

    my = my || {};

    /** @private {Date} last time sticky note was updated */
    var _lastModified;

    /** @private {Date} date when sticky note was created */
    var _createdAt;

    /** @private {string} author of sticky note */
    var _author;

    // format the date time object
    dateTimeFormat = new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // extends widget object
    Widget.call(this, spec, my);

    /**
     * set last modified date and modifies the related component in the view
     * @param {Date} lastModified
     * @return {this}
     */
    var _setLastModified = function _setLastModified(lastModified) {
      _lastModified = dateTimeFormat.format(lastModified);
      $('.last-modified', my.$component).text(_lastModified);

      return this;
    }

    /**
     * sets created datetime and modifies the related component in the view
     * @param {Date} createdAt
     * @return {this}
     */
    var _setCreatedAt = function _setCreatedAt(createdAt) {
      _createdAt = dateTimeFormat.format(createdAt);
      $('.created-at', my.$component).text(_createdAt);

      return this;

    }

    /**
     * sets the sticky note author and modifies the related component in the
     * view
     * @param {string} author
     * @return {this}
     */
    var _setAuthor = function _setAuthor(author) {
      _author = author;
      $('.author', my.$component).text(author);

      return this;
    }

    /**
     * show the component widget
     * @return {this}
     */
    var _show = function _show() {
      my.$component.show();

      return this;
    }

    /**
     * hides the component widget
     * @return {this}
     */
    var _close = function _close() {
      my.$component.hide();

      return this;
    }

    // sets public methods
    this.setLastModified = _setLastModified;
    this.setCreatedAt = _setCreatedAt;
    this.setAuthor = _setAuthor;
    this.show = _show;
    this.close = _close;

  };

});
