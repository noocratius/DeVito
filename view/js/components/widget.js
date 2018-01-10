/**
 * Componente de widgets da aplicação
 */

var Widget = (function ($) {

  var _component = $('.add-widget');
  var _postIt = $('.post-it', _component);

  // mostra o widget
  _component.on('open', function (e, blockIdentifier) {
    _component.data('block-id', blockIdentifier);
    _component.show();
  });

  _component.on('close', function () {
    _component.hide();
  });

  // envia os dados do post-it para ser salvo
  _component.on('close', function () {
    var note = _postIt.val();
    
    if (note) {
      _component.trigger('save', {
        'block-id': _component.data('block-id'),
        'post-it': {
          'color': _postIt.css('background-color'),
          'note': note
        }
      });

      // apaga as anotações
      _postIt.val('');
    }
  });

  return {
    open: function (blockIdentifier) {
      _component.trigger('open', blockIdentifier);
    },

    close: function () {
      _component.click(function () {
        _component.trigger('close');
      });

      _postIt.click(function (e) {
        e.stopPropagation();
      });
    }
  }

})(jQuery);
