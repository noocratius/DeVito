/**
 * Componente de widgets da aplicação
 */

/**
 *  Módulo que trata os componente de interface de widget
 *
 * @module Widget
 */
var Widget = (function ($) {

  var _component = $('.add-widget');
  var _postIt = $('.post-it', _component);
  var _closeButton = $('.close', _component);

  // mostra o widget e define o identificador do bloco do canvas que disparou
  _component.on('open', function (e, data) {
    _component.data(data);
    _component.show();
  });

  // fecha o widget
  _component.on('close', function () {
    _component.hide();
  });

  _component.on('cancel', function () {
    _component.hide();
  });

  // envia os dados do post-it para ser salvo
  _component.on('close', function () {
    var note = _postIt.val();

    // emite evento de 'save' caso o texto de inserção não seja vazio
    if (note) {
      _component.trigger('save', {
        'block-id': _component.data('block-id'),
        'post-it': {
          'id': _component.data('note-id'),
          'color': _postIt.css('background-color'),
          'note': note
        },
        'author': _component.data('author')
      });

      // apaga as anotações
      _postIt.val('');
    }
  });

  // define comportamento para fechar o widget
  _component.click(function () {
    _component.trigger('close');
  });
  _postIt.click(function (e) {
    e.stopPropagation();
  });

  // fecha o widget quando clicar no botão para fechar
  _closeButton.on('click', function (event) {
    event.stopPropagation();
    _component.trigger('cancel');
  });

  return {

    /**
     * Abre o widget
     *
     * @param {int} blockIdentifier - Identificador do canvas que abre
     */
    open: function (blockIdentifier) {
      _component.trigger('open', blockIdentifier);
    }
  }

})(jQuery);
