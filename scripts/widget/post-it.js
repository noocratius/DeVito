/**
 * Post-it anexados ao canvas
 */

jQuery(document).on('postit-loaded', function (e, postitElement) {

  /**
   * @module widget
   */
  window.PostIt = (function ($) {
    var _postitWidget = $(postitElement);
    var _editLabel = '.edit';

    // mostra e esconde o botão de edição enquanto navega o post-it
    _postitWidget
      .on('mouseenter', function () {
        $(_editLabel, this).css('visibility', 'visible');
      })
      .on('mouseleave', function () {
        $(_editLabel, this).css('visibility', 'hidden');
      });

    // envia evento de edição caso o botão tenha de edição tenha sido pressionado
    $(_editLabel, _postitWidget).on('click', function (event) {

      var id = $(this).parent('.post-it').data('id');
      $(this).trigger('edit', id);
    });

    return {

      /**
       * anexa post-it ao bloco correspondente no DOM, assim substitui os dados
       * do, estilos e texto.
       *
       * @param {BMCanvas.PostIt} postit
       */
      attach: function (postit) {
        var blockWidget, textWidget;

        textWidget = $('.text', _postitWidget);

        blockWidget = $('.canvas-body-element').filter(function (index, element) {
          return $(element).parent('.canvas-element').data('id') == postit.block.id;
        });

        // preenche dados e conteúdo do post-it
        _postitWidget.data('id', postit.id);
        _postitWidget.css('background-color', postit.color);
        textWidget.text(postit.note);

        // anexa o post-it no bloco correspondente
        blockWidget.append(_postitWidget);
      }
    }

  })(jQuery);

});
