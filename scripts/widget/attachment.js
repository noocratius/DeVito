/**
 * evento de create e de edit, diferente
 */

jQuery(document).on('view-loaded', function(e, view){

  /**
   * Módulo que anexa anotações no canvas
   * @module widget
   */
  window.Attachment = (function ($) {

    var _component = $('.add-widget');
    var _postIt = $('.post-it', _component);
    var _closeButton = $('.close', _component);
    var _colorOption = $('.colors-options .color', _component);
    var _removeButton = $('.details > .remove', _component);
    var _view = $(view);
    var _widgetDetails = $('.details', _component);

    // reseta os dados do componente
    var reset = function () {
      _component.data('block-id', null);
      _component.data('post-it', null);
      _component.data('note-id', null);
      _widgetDetails.hide();
      _postIt.val('');
    }

    // mostra o widget e define o identificador do bloco do canvas que disparou
    _component.on('open', function (event, data) {
      _component.data(data);
      _component.show();
    });

    // operação de cancelar um post-it
    _component.on('cancel', function (event) {
      event.stopPropagation();
      reset();
      $(this).trigger('close');
    });

    // envia os dados do post-it para ser salvo
    _component.on('close', function () {
      var note = _postIt.val();
      event.stopPropagation();
      _component.hide();

     // emite evento de 'save' caso o texto de inserção não seja vazio
      if (note) {
        _view.trigger('save', {
          'block-id': _component.data('block-id'),
          'author'  : _component.data('author'),
          'post-it' : {
            'id': _component.data('note-id'),
            'color': _postIt.data('color'),
            'note': note
          }
       });

       reset();
      }
    });

    // define comportamento para fechar o widget
    _component.on('click', function (event) {
      event.stopPropagation();
      _component.trigger('close');
    });

    // não permite eventos de cliques sejam efetuados no post-it do widget
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
    _colorOption
      .on('mouseenter', function () {
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

      _component.trigger('cancel');

      _view.trigger('delete', noteId);

    });

    return {

      /**
      * Abre o widget
      *
      * @param {int} blockIdentifier - Identificador do canvas que abre
      */
      open: function (data) {
        _component.trigger('open', data);
      },

      /**
       * Preenche os dados do widget com o post-it passado como argumento
       *
       * @param {BMCanvas.PostIt} postit - Post-it que será preenchido
       */
      fillNote: function (postit) {
        var author, createdAt, createdAtWidget, lastModified, lastModifiedWidget;

        author = $('.author', _widgetDetails);
        createdAtWidget = $('.created-at', _widgetDetails);
        lastModifiedWidget = $('.last-modified', _widgetDetails);

        _component.data('note-id', postit.id);

        _widgetDetails.show();

        // atualiza os valores no widget
        _postIt.val(postit.note);
        _component.trigger('change-color', postit.color);
        author.text(postit.author.name);

        // formata a data
        var dateTimeFormat = new Intl.DateTimeFormat('pt-BR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        var createdAt = dateTimeFormat.format(postit.createdAt);
        var lastModified = dateTimeFormat.format(postit.lastModified);

        createdAtWidget.text(createdAt);
        lastModifiedWidget.text(lastModified);

      },

      /**
       * Atualiza o post-it com os dados do widget, no modo edição
       *
       * @param {BMCanvas.PostIt} postit - Post-it que será atualizado
       */
      updatePostIt: function (postit) {
        postit.color = _postIt.css('background-color');
        postit.note = _postIt.val();
        postit.lastModified = new Date();

      }

    }

  })(jQuery);

});
