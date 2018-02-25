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
      './widget',
      './sticky-note'
    ],
      function($, Widget, StickyNote){

        /**
         * Represents a single canvas element block, a colleague for sage app
         * which mediates selected block
         * @class
         * @alias module:widget/canvas-group
         * @extends module:widget/widget
         * @param {object} spec - specs to build the object uses in the
         *    inheritance
         * @param {object} my - shared secrets between inheritance
         * @return {CanvasGroup}
         */
        function CanvasGroup(spec, my) {
          var _selected;

          spec = spec || {};
          my = my || {};

          // extends widget object
          Widget.call(this, spec, my);

          /**
           * returns the last selected canvas block
           * @return {int}
           */
          var _getSelected = function _getSelected() {
            return _selected;
          }

          /**
           * returns the jQuery element repersenting the sticky-note
           * @param {int} id - identifier to be search for
           * @return {module:widget/sticky-note}
           */
          var _getStickyNoteWidget = function _getStickyNoteWidget(id) {

            var $stickyNote = $('.post-it', my.$component).filter(function () {
              return $(this).data('id') === id;
            });

            return new StickyNote({
              selector: '.post-it',
              container: my.$component,
              name: 'sticky-note',
              mediator: my.mediator,
              element: $stickyNote
            });
          }


          /**
           * append a sticky-note to selected block
           * @param {module:widget/sticky-note} stickyNote - sticky-note to be
           *    appended
           * @return {module:widget/canvas-group}
           */
          var _appendStickyNote = function _appendStickyNote(stickyNote) {

            var $body, stickyNoteWidget;

            stickyNoteWidget = new StickyNote({
              selector: '.post-it',
              container: my.$component,
              name: 'sticky-note',
              mediator: my.mediator
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
           * @param {module:widget/sticky-note} stickyNote - sticky-note to be
           *    updated
           * @return {module:widget/canvas-group}
           */
          var _updateStickyNote = function _updateStickyNote(stickyNote) {
            var stickyNoteWidget = _getStickyNoteWidget(stickyNote.id);

            stickyNoteWidget.setNote(stickyNote.note);
            stickyNoteWidget.setColor(stickyNote.color);

            return this;
          }

          /**
           * delete a sticky-note by its id
           * @param {module:widget/sticky-note} stickyNote - sticky-note to be
           *    deleted
           * @return {module:widget/canvas-group}
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

        return CanvasGroup;
});
