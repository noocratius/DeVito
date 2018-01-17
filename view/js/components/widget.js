/**
 * Componente de widgets da aplicação
 */

/**
 *  Módulo que trata os componente de interface de widget
 *
 * @module widget
 */
var Widget = (function ($) {

  var _component = $('.add-widget');
  var _postIt = $('.post-it', _component);
  var _closeButton = $('.close', _component);
  var _colorOption = $('.colors-options .color', _component);
  var _removeButton = $('.details > .remove', _component);

  // reseta os dados do componente
  function reset() {
    _component.data('block-id', null);
    _component.data('post-it', null);
    _component.data('note-id', null);
    $('.details', _component).hide();
  }

  // mostra o widget e define o identificador do bloco do canvas que disparou
  _component.on('open', function (e, data) {
    _component.data(data);
    _component.show();
  });

  // fecha o widget
  _component.on('close', function () {
    _component.hide();
  });

  // operação de cancelar um post-it
  _component.on('cancel', function () {
    _component.hide();
    // apaga o texto no post-it
    _postIt.val('');
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
          'color': _postIt.data('color'),
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

  // seleção de cor do post-it
  _colorOption.on('click', function (event) {
    event.stopPropagation();
    _component.trigger('change-color', $(this).data('color'));
  });

  // comportamento para o ponteiro sage enquanto seleciona a cor
  _colorOption.on('mouseenter', function () {
    $(this).addClass('selected');
  })
  .on('mouseout', function () {
    $(this).removeClass('selected');
  });

  // muda a cor do post-it para a selecionada
  _component.on('change-color', function (e, color) {
    _postIt.data('color', color);
    _postIt.css('background-color', color);
  });

  // comportamento para remover o post-it
  _removeButton.on('click', function (event) {
    event.stopPropagation();
    var noteId = _component.data('note-id');
    _component
    .trigger('cancel')
    .trigger('delete', noteId);
    reset();

  });

  return {

    /**
     * Abre o widget
     *
     * @param {int} blockIdentifier - Identificador do canvas que abre
     */
    open: function (blockIdentifier) {
      _component.trigger('open', blockIdentifier);
    },

    /**
     * Reseta todas as informações do widget
     */
    reset: function () {
      reset();
    }
  }

})(jQuery);
