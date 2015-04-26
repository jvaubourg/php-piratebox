/* php-piratebox
 * Copyright (C) 2015 Julien Vaubourg <julien@vaubourg.com>
 * Contribute at https://github.com/jvaubourg/php-piratebox
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


/***************/
/*** GLOBALS ***/
/***************/

var defaultChatPseudo;
var lastChatMsg = '';


/**************/
/*** EVENTS ***/
/**************/

$(document).ready(function() {
  $('.btn-group').button();
  $('[data-toggle="tooltip"]').tooltip();

  defaultChatPseudo = $('#tabchat').data('optDefaultPseudo') + Math.floor(Math.random() * 100);

  var uploadOptions = { iframe: { url: '?/upload' }, multiple: true };
  var uploadArea = new FileDrop('dragndrop', uploadOptions);
  
  uploadArea.event('send', upload);

  setFileEvents($('.file'));
  setFolderEvents($('.folder'));

  updateNav();
  createContextMenus();

  $(window).on('popstate', browserHistory);

  $('#dragndrop').click(closeDownload);
  $('#gotoupload').click(goToUpload);
  $('#closedownload').click(closeDownloadBtn);
  $('.folderdelete').click(deleteFolderBtn);

  if($('#tabfiles').data('optAllowNewfolders')) {
    $('#createfolderbtn').click(createFolderInput);
    $('#createfolder input').blur(createFolderInputBlur);
    $('#createfolder input').keydown(createFolderInputKeys);
    $('#createfolder button').click(createFolderBtn);
  }

  if($('#tabchat').data('optEnableChat')) {
    updateChat();
    updateChat(true);
    updateChatBadge();

    $('#menu a').click(goToTabClick);
    $('#chatbtn').click(postChatMessage);
    $('#commentin').keydown(postChatMessageKey);
    $('#pseudoin').keydown(pseudoInputKeys);

    if($(location).attr('href').match(/#chat$/)) {
      $('a[data-tab=chat]').click();
    }
  }
});


/************************/
/*** GLOBAL SHORTCUTS ***/
/************************/

$(document).keydown(function(e) {

  // Enter
  if(e.keyCode == 13) {
    if(isTabActive('files') && $('.activefile').length > 0) {
      if($('.activefile').hasClass('folder')) {
        $('.activefile').click()

       } else {
         $(window).prop('location', $('#download').find('a').attr('href'));
       }
    }
  }

  // Escape
  if(e.keyCode == 27) {
    if(isTabActive('files')) {
      closeDownload();
      $('.activefile').removeClass('activefile');
    }
  }

  // Page down
  if(e.keyCode == 34) {
    if(isTabActive('files') && $('#tabfiles').data('optAllowNewfolders')) {
      $('html,body').scrollTop($(document).height());
      $('#createfolderbtn').click();

      return false;
    }
  }

  // <- and ->
  if(e.keyCode == 37 || e.keyCode == 39) {
    var activefile;

    if(isTabActive('files') && !$('#renamein').length && $('#createfolderinput').css('display') == 'none') {
      if($('.activefile').length == 1) {
        if(e.keyCode == 37) {
          activefile = $('.activefile').prev();

          if(!activefile.hasClass('itemfile')) {
            activefile = $('.itemfile').last();
          }
        } else {
          activefile = $('.activefile').next();

          if(!activefile.hasClass('itemfile')) {
            activefile = $('.itemfile').first();
          }
        }
  
        $('.itemfile').removeClass('activefile');
  
      } else {
        if(e.keyCode == 37) {
          activefile = $('.itemfile').last();
        } else {
          activefile = $('.itemfile').first();
        }
      }
  
      $('html,body').scrollTop(activefile.offset().top - 155);

      if(activefile.hasClass('folder')) {
        closeDownload();
        activefile.addClass('activefile');

      } else {
        activefile.click();
      }

      return false;
    }
  }

  // Insert
  if(e.keyCode == 45) {
    if(isTabActive('files')) {
      goToUpload();

      return false;
    }
  }

  // Del
  if(e.keyCode == 46) {
    if(isTabActive('files') && $('#tabfiles').data('optAllowDeleting') && !$('.activefile').data('locked')) {
      deleteFile($('.activefile'));

      return false;
    }
  }

  // F2
  if(e.keyCode == 113) {
    if(isTabActive('files') && $('#tabfiles').data('optAllowRenaming') && !$('.activefile').data('locked')) {
      renameFile($('.activefile'));
      $('#renamein').select();

      return false;
    }
  }

  // F3
  if(e.keyCode == 114) {
    if(isTabActive('chat') && $('#tabchat').data('optEnableChat')) {
      $('#menu a[data-tab=files]').click();

      return false;
    }
  }

  // F4
  if(e.keyCode == 115) {
    if(isTabActive('files') && $('#tabchat').data('optEnableChat')) {
      $('#menu a[data-tab=chat]').click();

      return false;
    }
  }
});
