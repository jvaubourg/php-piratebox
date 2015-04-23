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

var defaultChatPseudo = 'anonymous' + Math.floor(Math.random() * 100);


/**************/
/*** EVENTS ***/
/**************/

$(document).ready(function() {
  $('.btn-group').button();
  $('[data-toggle="tooltip"]').tooltip();

  var uploadOptions = { iframe: { url: '?/upload' }, multiple: true };
  var uploadArea = new FileDrop('dragndrop', uploadOptions);
  
  uploadArea.event('send', upload);

  setFileEvents($('.file'));
  setFolderEvents($('.folder'));

  updateNav();
  updateChat();
  updateChat(true);
  updateChatBadge();

  $(window).on('popstate', browserHistory);

  $('#menu a').click(showCorrectTab);
  $('#gotoupload').click(goToUpload);

  $('#createfolderbtn').click(createFolderInput);
  $('#createfolder input').blur(createFolderInputBlur);
  $('#createfolder input').keypress(createFolderInputKeys);
  $('#createfolder button').click(createFolderBtn);

  $('#chatbtn').click(postChatMessage);
  $('#commentin').keypress(postChatMessageKey);
  $('#pseudoin').keypress(pseudoInputKeys);

  if($(location).attr('href').match(/\?\/chat$/)) {
    $('a[data-tab=chat]').click();
  }

  $('.folderdelete').click(deleteFile);
});


/************************/
/*** GLOBAL SHORTCUTS ***/
/************************/

$(document).keypress(function(e) {

  // Enter
  if(e.keyCode == 13) {
    if(isTabActive('files') && $('.activefile').length == 1) {
      $(window).prop('location', $('.activefile').find('a').attr('href'));
    }
  }

  // Escape
  if(e.keyCode == 27) {
    if(isTabActive('files')) {
      $('.activefile').removeClass('activefile');
    }
  }

  // <- and ->
  if(e.keyCode == 37 || e.keyCode == 39) {
    var activefile;

    if(isTabActive('files') && !$('#renamein').length && $('#createfolderinput').css('display') == 'none') {
      if($('.activefile').length == 1) {
        if(e.keyCode == 37) {
          activefile = $('.activefile').prev();
        } else {
          activefile = $('.activefile').next();
        }
  
        $('.itemfile').removeClass('activefile');
  
      } else {
        if(e.keyCode == 37) {
          activefile = $('.file').last();
        } else {
          activefile = $('.file').first();
        }
      }
  
      $('html,body').scrollTop(activefile.offset().top - 180);
      activefile.addClass('activefile');

      return false;
    }
  }

  // F2
  if(e.keyCode == 113) {
    if(isTabActive('files')) {
      $('.activefile').find('.shortname').trigger('contextmenu');

      return false;
    }
  }

  // F3
  if(e.keyCode == 114) {
    if(isTabActive('chat')) {
      $('#menu a[data-tab=files]').click();

      return false;
    }
  }

  // F4
  if(e.keyCode == 115) {
    if(isTabActive('files')) {
      $('#menu a[data-tab=chat]').click();

      return false;
    }
  }
});
