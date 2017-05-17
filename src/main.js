/*
icon by Vignesh Oviyan (http://www.flaticon.com/authors/vignesh-oviyan)
 */

function hideYmph() {
    $('.add-to-popup').addClass('popup_hidden');
    $('html').removeClass('ymph-choose-playlist');
}

function injectPlaylistSearch() {
   setTimeout(function () {
      if ($('.add-to-popup').length < 1) {
         injectPlaylistSearch();
      } else {
        $('<div class="ymph-search-bar"><input type="text" class="ymph-search-input" placeholder="Search"></div>').insertBefore('.add-to-popup .add-to-popup__list');
      }
   }, 1000);
}

function reindexPlaylistSearch() {
   setTimeout(function () {
      if ($('.add-to-popup__list .add-to-popup__item').length < 1) {
         reindexPlaylistSearch();
      } else {
        //get all playlists' titles
        window.ymphFuzzySearchItems = [];
        $('.add-to-popup__list .add-to-popup__item').each(function(index, el) {
            window.ymphFuzzySearchItems.push({
                'id': $(this).data('b'),
                'title': $(this).text()
            });
        });
      }
   }, 500);
}

function ymphClearSearch() {
    $('.add-to-popup__list').removeClass('ymph-search-processed');
    $('.add-to-popup__list .add-to-popup__item.ymph-search-item-container-highlight').each(function(index, el) {
        $(this).removeClass('ymph-search-item-container-highlight');
        var highlightedText = $(this).find('.ymph-search-item-highlight');
        highlightedText.replaceWith(highlightedText.text());
    });
}

function ymphProcessSearch(searchString) {
    ymphClearSearch();

    if(searchString.length) {
        var searchOptions = {
            pre: '<span class="ymph-search-highlight">',
            post: '</span>',
            extract: function(el) { return el.title; }
        };

        var results = fuzzy.filter(searchString, window.ymphFuzzySearchItems, searchOptions);
        if(results.length) {
            $('.add-to-popup__list').addClass('ymph-search-processed');

            $.each(results, function(index, val) {
                var matchedItem = $('.add-to-popup__list .add-to-popup__item[data-b="' + val.original.id + '"]');
                if(matchedItem.length) {
                    matchedItem.addClass('ymph-search-item-container-highlight');
                    matchedItem.contents().last().replaceWith('<span class="ymph-search-item-highlight">' + val.string + '</span>');
                } else {
                    console.error('YMPH: can\'t find a playlist item to highlight it');
                }
            });
        }
    }
}

$(function() {
    injectPlaylistSearch();

    $(document).on('click', '.add-to__button', function(event) {
        event.preventDefault();
        $('html').toggleClass('ymph-choose-playlist');
        reindexPlaylistSearch();
        setTimeout(function() { $('.ymph-search-input').focus(); }, 800);
    });

    $(document).on('keyup', function(e) {
        if (e.keyCode == 27) {
            if($('html').hasClass('ymph-choose-playlist')) {
                hideYmph();
            }
        }
    });

    $(document).on('click', 'div.add-to-popup__item', function(event) {
        hideYmph();
    });

    $(document).on('input change', '.ymph-search-input', function(event) {
        //чтобы не отрабатывало еще раз при потере фокуса с инпута(до этого уже по таймауту отработало при событии input)
        var isChangeOnFocusBlur = (event.type === 'change' && event.target.type === 'text');

        if(!isChangeOnFocusBlur) {
            if(typeof window.ymphSearchInputTimeout != 'undefined')
                clearTimeout(window.ymphSearchInputTimeout);
            var searchVal = $(this).val();
            window.ymphSearchInputTimeout = setTimeout(function() { ymphProcessSearch(searchVal); }, 70);
        }
    });
});