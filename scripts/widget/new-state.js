/**
 * @fileoverview defines a state subclass according to state pattern
 */

jQuery(document).on('loaded.view', function (_, data) {
  'use strict';

  /**
   * @module widget
   */
  data.app.NewState = (function ($, Widget) {

    /**
     * Represents a state which attachment box can be when a new sticky-note is
     * being inserted
     * @constructor
     * @extends AttachmentState
     * @param {object} spec - specs to build the object uses in the inheritance
     * @param {BMCanvas.PostIt} spec.stickyNote - sticky-note the state works on
     * @param {object} my - shared secrets between inheritance
     * @return {NewState}
     */
    var _NewState = function _NewState(spec, my) {
      my = my || {};

      // extends attachment state
      AttachmentState.call(this, spec, my);

      /**
       * Opens the widget and set apropriated widgets
       * @override
       * @param {AttachmentBox} box - attachment box which can see its widgets
       * @return {this}
       */
      var _open = function _open(box) {
        box.show();
        my.stickyNote.author = new BMCanvas.User(box.app.author.name, box.app.author.email);

        return this;
      }

      /**
       * Closes the apropriated widgets and save the attachment
       * @override
       * @param {AttachmentBox} box - attachment box which can see its widgets
       * @return {this}
       */
      var _save = function _save(box) {
        // fill the sticky-note data
        my.stickyNote.note = box.getEditBox().getText();
        my.stickyNote.color = box.getEditBox().getColor();


        box.getEditBox().setText('');
        box.close();

        box.app.publish('new.sticky-note', {
            stickyNote: my.stickyNote
        });

        my.stickyNote = new BMCanvas.PostIt();

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
     *
     * @param {object} [spec={}] - specs to build the state object
     * @param {object} [my={}] - secrets shared between inheritance
     * @return {AttachmentState}
     */
    var _static = {

      getInstance: function (spec, my) {

        if (!_instance) {
          spec.stickyNote = new BMCanvas.PostIt();
          _instance = new _NewState(spec, my);

        }

        return _instance;
      }
    };

    return _static;

  })(jQuery, data.app.Widget);
});
