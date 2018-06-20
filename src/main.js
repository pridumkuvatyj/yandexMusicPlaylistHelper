// icon by Vignesh Oviyan (http://www.flaticon.com/authors/vignesh-oviyan)

/**
 * Inject CSS styles into the page with <style> tag.
 *
 * @link https://css-tricks.com/snippets/javascript/inject-new-css-rules/
 * 
 * @param  string rule
 * @return void
 */
function injectStyles(rule) {
  var div = $("<div />", {
    html: '&shy;<style>' + rule + '</style>'
  }).appendTo("body");    
}

$(function() {
    $(window).on('load', function(event) {
        $('html').addClass('ymph');

        // calc player bar height
        var playerBarHeight = $('.bar__content').outerHeight() + $('.bar__content > .progress').outerHeight();
        // set playlist chooser height
        injectStyles('.ymph .d-addition__popup.popup.popup_fixed { height: calc(100% - '+playerBarHeight+'px) !important; }');

        // add events to playlist btn&popup
        // var playlistBtn = Mu.blocks.forElem($(".d-addition__opener")[0]);
    });

    $(document).on('click', '.d-addition__opener', function(event) {
        // event.preventDefault();
        $('html').toggleClass('ymph-opened');
        // reindexPlaylistSearch();
        // setTimeout(function() { $('.ymph-search-input').focus(); }, 800);
    });

    /*+++ensure the blur is gone when the playlist chooser is hidden*/
        $(document).on('mousedown', 'html.ymph-opened', function(e) {
            debugger;
            if($('.d-addition__popup.popup_hidden').length) {
                $('html').removeClass('ymph-opened');
            }
        });

        $(document).on('keydown', 'html.ymph-opened', function(e) {
            if (e.keyCode == 27) {
                $('html').removeClass('ymph-opened');
            }
        });
    /*---ensure the blur is gone when the playlist chooser is hidden*/
});