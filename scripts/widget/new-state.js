/**
 * @fileoverview defines a state subclass according to state pattern
 */

'use strict';

/**
 * @module widget
 */
define(
    [
      './attachment-state',
      'model/user',
      'model/sticky-note'
    ],
      function(AttachmentState, User, StickyNote){

    /**
     * Represents a state which attachment box can be when a new sticky-note is
     * being inserted
     * @class
     * @alias module:widget/new-state
     * @extends module:widget/attachment-state
     * @param {object} spec - specs to build the object uses in the inheritance
     * @param {module:widget/sticky-note} spec.stickyNote - sticky-note the
     *    state works on
     * @param {object} my - shared secrets between inheritance
     */
    var _NewState = function _NewState(spec, my) {
      my = my || {};

      // extends attachment state
      AttachmentState.call(this, spec, my);

      /**
       * Opens the widget and set apropriated widgets
       * @override
       * @param {module:widget/attachment-box} box - attachment box which can see its widgets
       * @return {module:widget/new-state}
       */
      var _open = function _open(box) {
        box.show();

        my.stickyNote.author =
            new User(box.sage.author.name, box.sage.author.email);

        return this;
      }

      /**
       * Closes the apropriated widgets and save the attachment
       * @override
       * @param {module:widget/attachment-box} box - attachment box which can
       *    see its widgets
       * @return {module:widget/new-state}
       */
      var _save = function _save(box) {
        // fill the sticky-note data
        my.stickyNote.note = box.getEditBox().getText();
        my.stickyNote.color = box.getEditBox().getColor();


        box.getEditBox().setText('');
        box.close();

        box.sage.publish('new.sticky-note', {
            stickyNote: my.stickyNote
        });

        my.stickyNote = new StickyNote();

        return this;
      }

      // set public interface
      this.open = _open;
      this.save = _save;

    };


    // singleton instance
    var _instance;

    /**
     * returns the singleton object for state lazyly initiation
     * @exports module:widget/new-state
     * @param {object} [spec={}] - specs to build the state object
     * @param {object} [my={}] - secrets shared between inheritance
     * @return {module:widget/new-state}
     */
    var _static = {

      getInstance: function (spec, my) {

        if (!_instance) {
          spec.stickyNote = new StickyNote();
          _instance = new _NewState(spec, my);

        }

        return _instance;
      }
    };

    return _static;

});
