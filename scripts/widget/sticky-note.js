/**
 * @fileoverview defines a sticky-note widget which represents a sticky-note
 * attached to business model canvas
 */

'use strict';

/**
 * @module widget
 */
define(
    [
      'jquery',
      'sage',
      'showdown',
      './widget',
      'patterns/event-aggregator'
    ],
    function($, sage, showdown, Widget, EventAggregator){

      /** @const {string} TEMPLATE defines sticky-note template path */
      const TEMPLATE_PATH = sage.resrcPath + 'view/html/post-it.html';

      /**
       * Represents a sticky-note widget
       *
       * @extends Widget
       * @param {object} spec - spec to build the sticky-note widget
       * @param {Element} [spec.element] - element representing sticky-note
       * @param {object} my - shared secrets between inheritance
       * @return {StickyNote}
       */
      return function StickyNote(spec, my) {
        var template, $note, $editButton;

        my = my || {};

        // extends Widget
        Widget.call(this, spec, my);

        // extends publish/subscribe pattern to listen to button
        EventAggregator.call(this);

        // load sticky-note template synchronous
        $.get({
          async: false,
          url: TEMPLATE_PATH,
        })
          .done(function (data) {
            template = data;
          });

        // create a existing sticky-note or a loaded one
        spec.element = spec.element || template;

        // set jQuery component
        my.$component = $(spec.element);

        // sticky-note text in dom
        $note = $('.text', my.$component);

        /** @private {string} sticky-note identifier */
        var _id;

        /** @private {string} */
        var _color;

        /** @private {string} */
        var _note;

        /**
         * set the sticky-note' note using markdown module 'showdown'
         * @param {string} note
         * @return {this}
         */
        var _setNote = function _setNote(note) {
          _note = note;

          // set html according to markdown module
          var converter = new showdown.Converter();
          $note.html(converter.makeHtml(_note));

          return this;
        }


        /**
         * returns sticky-note' note
         * @return {string}
         */
        var _getNote = function _getNote() {
          _note = $note.html();

          return _note;
        }

        /**
         * set the sticky-note' id
         * @param {string} text
         * @return {this}
         */
        var _setID = function _setID(id) {
          my.$component.data('id', id);
          _id = id;

          return this;
        }

        /**
         * returns sticky-note' id
         * @return {int}
         */
        var _getID = function _getID() {
          _id = my.$component.data('id');

          return _id;
        }


        /**
         * returns sticky-note' color
         * @return {string}
         */
        var _getColor = function _getColor() {
          _color = my.$component.css('background-color');

          return _color;
        }

        /**
         * set the sticky-note' color
         * @param {string} color
         * @return {this}
         */
        var _setColor = function _setColor(color) {
          my.$component.css('background-color', color);
          _color = color;

          return this;
        }


        // send event to sage app to edit sticky-note
        $editButton = $('.edit', my.$component);

        $editButton.click(function (_) {
          _.stopPropagation();
          var id = $(this).parent('.post-it').data('id');
          my.mediator.publish('click.edit', {'id': id});
        })

        // make edit button appers or hide on mouse hover
        my.$component.on('mouseenter', function () {
          $editButton = $('.edit', this);
          $editButton.css('visibility', 'visible');
        })
          .on('mouseleave', function () {
            $editButton = $('.edit', this);
            $editButton.css('visibility', 'hidden');
          });

        var _this = this;

        // initialize drag state
        my.$component.data('drag', false);

        // set draggable options
        my.$component.on('mousedown', function (_) {
          my.$component.data('drag', true);
          my.mediator.publish('dragstart', {widget: _this});
        })
          .on('mousemove', function (_) {

            if (my.$component.data('drag')) {
              my.mediator.publish('drag');
              console.log(my.$component.offset());
              my.$component.offset({
                top: _this.top,
                left: _this.left
              });
            }
          })
          .on('mouseup', function (_) {
            if (my.$component.data('drag')) {
              my.mediator.publish('dragend');
            }

            my.$component.data('drag', false);
          })
          .on('dragstart', function (_) {
            console.log('alooow');
          });

        // set public interface
        this.getID = _getID;
        this.setID = _setID;
        this.getNote = _getNote;
        this.setNote = _setNote;
        this.getColor = _getColor;
        this.setColor = _setColor;

      }

    }
);
