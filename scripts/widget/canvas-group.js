/**
 * @fileoverview define widget colleage for mediator pattern
 */

'use strict';

/**
 * @module widget
 */
define(
    [
      'jquery',
      'sage',
      './widget',
      './sticky-note'
    ],
      function($, sage, Widget, StickyNote){

        /**
         * Represents a single canvas element block, a colleague for sage app
         * which mediates selected block
         * @constructor
         * @extends Widget
         * @param {object} spec - specs to build the object uses in the
         *    inheritance
         * @param {object} my - shared secrets between inheritance
         * @return {CanvasGroup}
         */
        return function CanvasGroup(spec, my) {
          var _selected;

          spec = spec || {};
          my = my || {};

          // extends widget object
          Widget.call(this, spec, my);

          /**
           * returns the actual selected canvas block
           */
          var _getSelected = function _getSelected() {
            return _selected;
          }

          /**
           * returns the jQuery element repersenting the sticky-note
           * @private
           * @param {int} id - identifier to be search for
           * @return {widget.StickyNote}
           */
          var _getStickyNoteWidget = function _getStickyNoteWidget(id) {

            var $stickyNote = $('.post-it', my.$component).filter(function () {
              return $(this).data('id') === id;
            });

            return new StickyNote({
              selector: '.post-it',
              container: my.$component,
              name: 'sticky-note',
              mediator: sage,
              element: $stickyNote
            });
          }


          /**
           * append a sticky-note to selected block
           * @param {StickyNote} stickyNote - sticky-note to be appended
           * @return {this}
           */
          var _appendStickyNote = function _appendStickyNote(stickyNote) {

            var $body, stickyNoteWidget;

            stickyNoteWidget = new StickyNote({
              selector: '.post-it',
              container: my.$component,
              name: 'sticky-note',
              mediator: sage
            });

            // fill data in the widget
            stickyNoteWidget.setNote(stickyNote.note);
            stickyNoteWidget.setColor(stickyNote.color);
            stickyNoteWidget.setID(stickyNote.id);

            $body =
                $('.canvas-body-element', my.$component).filter(function (index, element) {
                  return $(element).parent(my.$component).data('id') == _getSelected();
                });

            $body.append(stickyNoteWidget.getDOM());

            return this;
          }

          /**
           * updates a sticky-note on selected block specify by sticky-note' id
           * @param {model.StickyNote} stickyNote - sticky-note to be updated
           * @return {this}
           */
          var _updateStickyNote = function _updateStickyNote(stickyNote) {
            var stickyNoteWidget = _getStickyNoteWidget(stickyNote.id);

            stickyNoteWidget.setNote(stickyNote.note);
            stickyNoteWidget.setColor(stickyNote.color);

            return this;
          }

          /**
           * delete a sticky-note by its id
           * @param {StickyNote} stickyNote - sticky-note to be deleted
           * @return {this}
           */
          var _removeStickyNote = function _removeStickyNote(stickyNote) {
            $(_getStickyNoteWidget(stickyNote.id).getDOM()).remove();
            return this;
          }

          var _this = this;

          // set the selected when jQuery $component receive a click event
          my.$component.click(function (_) {
            _.stopPropagation();
            _selected = $(this).data('id');
            _this.notify('selected.canvas', {id: _selected});
          });

          // set public interface
          this.getSelected = _getSelected;
          this.appendStickyNote = _appendStickyNote;
          this.updateStickyNote = _updateStickyNote;
          this.removeStickyNote = _removeStickyNote;

        };

});
